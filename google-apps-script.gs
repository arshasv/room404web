/**
 * Google Apps Script - ROOM 404 Feedback Form Backend
 *
 * Deployment:
 * 1. Open the Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1y-D_BtEgv7OJSOleRkh6wp-aQ37XURfviEe7lM5qpSQ/
 * 2. Extensions > Apps Script
 * 3. Paste this file, save, and deploy:
 *    Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL into .env.local:
 *    VITE_GOOGLE_SHEET_API_URL=https://script.google.com/macros/s/.../exec
 *
 * The script reads row 1 as the source of truth and appends each submission
 * into the matching columns. Reordering Sheet columns does not require code
 * changes as long as the headers remain recognizable.
 */

const SPREADSHEET_ID = '1y-D_BtEgv7OJSOleRkh6wp-aQ37XURfviEe7lM5qpSQ'
const BACKEND_VERSION = '2026-05-14-no-bug-title'
const RATE_LIMIT_SECONDS = 20
const DUPLICATE_WINDOW_SECONDS = 120
const MAX_FIELD_LENGTH = 5000

const REQUIRED_HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Feedback Type',
  'Suggestion',
  'Bug Description',
  'Severity',
  'Feature Request',
  'Platform',
  'Status',
  'Source',
]

const HEADER_ALIASES = {
  timestamp: ['timestamp', 'submitted at', 'date', 'created at', 'time'],
  name: ['name', 'full name'],
  email: ['email', 'email address'],
  feedbackType: ['feedback type', 'type', 'submission type', 'category'],
  suggestion: ['suggestion', 'feedback', 'your feedback', 'message', 'comments'],
  bugDescription: ['bug description', 'description', 'bug', 'bug report'],
  severity: ['severity', 'priority'],
  featureRequest: ['feature request', 'feature', 'request'],
  platform: ['platform', 'device', 'os'],
  status: ['status'],
  source: ['source'],
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ result: 'error', error: 'Missing request body' })
    }

    const data = parseJson(e.postData.contents)
    const submission = buildSubmission(data)
    const validationError = validateSubmission(submission)

    if (validationError) {
      return jsonResponse({ result: 'error', error: validationError })
    }

    const rateLimitKey = getClientKey(submission.email)
    const cache = CacheService.getScriptCache()

    if (cache.get('rate:' + rateLimitKey)) {
      return jsonResponse({ result: 'error', error: 'Please wait before submitting again' })
    }

    const duplicateKey = 'duplicate:' + digest(JSON.stringify(submission))
    if (cache.get(duplicateKey)) {
      return jsonResponse({ result: 'duplicate', message: 'Duplicate submission ignored' })
    }

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)

    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
      const headers = ensureSubmissionHeaders(sheet, submission)
      const row = buildRowFromHeaders(headers, submission)

      sheet.appendRow(row)
      cache.put('rate:' + rateLimitKey, '1', RATE_LIMIT_SECONDS)
      cache.put(duplicateKey, '1', DUPLICATE_WINDOW_SECONDS)
    } finally {
      lock.releaseLock()
    }

    return jsonResponse({ result: 'success' })
  } catch (err) {
    console.error('ROOM 404 submission failed:', err)
    return jsonResponse({ result: 'error', error: 'Submission failed' })
  }
}

function doGet() {
  return jsonResponse({
    status: 'ROOM 404 Feedback API is running',
    version: BACKEND_VERSION,
    spreadsheetId: SPREADSHEET_ID,
  })
}

function parseJson(contents) {
  try {
    return JSON.parse(contents)
  } catch (err) {
    throw new Error('Invalid JSON payload')
  }
}

function buildSubmission(data) {
  const type = sanitize(data.type || '').toLowerCase()
  const feedbackType = sanitize(data.feedbackType || readableType(type))

  return {
    timestamp: sanitize(data.timestamp || new Date().toISOString()),
    name: sanitize(data.name || ''),
    email: sanitize(data.email || '').toLowerCase(),
    feedbackType: feedbackType,
    suggestion: sanitize(data.suggestion || (type === 'feedback' ? data.message : '') || ''),
    bugDescription: sanitize(data.bugDescription || (type === 'bug' ? data.message : '') || ''),
    severity: sanitize(data.severity || ''),
    featureRequest: sanitize(data.featureRequest || (type === 'feature' ? data.message : '') || ''),
    platform: sanitize(data.platform || ''),
    status: 'New',
    source: sanitize(data.source || 'room404web'),
  }
}

function validateSubmission(submission) {
  if (!submission.name) return 'Name is required'
  if (!submission.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) return 'Valid email is required'
  if (!submission.feedbackType) return 'Feedback type is required'
  if (!submission.platform) return 'Platform is required'

  const hasMessage = submission.suggestion || submission.bugDescription || submission.featureRequest
  if (!hasMessage) return 'Submission message is required'

  return ''
}

function getHeaders(sheet) {
  const lastColumn = sheet.getLastColumn()
  if (!lastColumn) {
    throw new Error('Sheet must have headers in row 1 before submissions can be appended')
  }

  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map(function(header) { return String(header || '').trim() })

  if (!headers.some(Boolean)) {
    throw new Error('Sheet header row is empty')
  }

  return headers
}

function ensureSubmissionHeaders(sheet, submission) {
  const headers = getHeaders(sheet)

  REQUIRED_HEADERS.forEach(function(requiredHeader) {
    const requiredKey = findSubmissionKey(requiredHeader)
    const hasHeader = headers.some(function(header) {
      return findSubmissionKey(header) === requiredKey
    })

    if (!hasHeader) {
      const nextColumn = headers.length + 1
      sheet.getRange(1, nextColumn).setValue(requiredHeader)
      headers.push(requiredHeader)
    }
  })

  return headers
}

function buildRowFromHeaders(headers, submission) {
  return headers.map(function(header) {
    const key = findSubmissionKey(header)
    return key ? submission[key] || '' : ''
  })
}

function findSubmissionKey(header) {
  const normalizedHeader = normalize(header)

  for (const key in HEADER_ALIASES) {
    if (HEADER_ALIASES[key].some(function(alias) { return normalize(alias) === normalizedHeader })) {
      return key
    }
  }

  return ''
}

function sanitize(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, MAX_FIELD_LENGTH)
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function readableType(type) {
  if (type === 'bug') return 'Bug Report'
  if (type === 'feature') return 'Feature Request'
  return 'Feedback'
}

function getClientKey(email) {
  return digest(email || 'anonymous')
}

function digest(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value)
  return bytes.map(function(byte) {
    const hex = (byte < 0 ? byte + 256 : byte).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
