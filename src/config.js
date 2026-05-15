// Google Apps Script web app URL.
// Add this to .env.local after deploying google-apps-script.gs:
// VITE_GOOGLE_SHEET_API_URL=https://script.google.com/macros/s/.../exec
export const GOOGLE_SHEET_API_URL = import.meta.env.VITE_GOOGLE_SHEET_API_URL || ''
