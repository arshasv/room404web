import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiSend, FiAlertCircle, FiStar, FiZap, FiCheck, FiLoader } from 'react-icons/fi'
import { GOOGLE_SHEET_API_URL } from '../config'

const tabs = [
  { id: 'feedback', label: 'Feedback', icon: FiStar },
  { id: 'bug', label: 'Report Bug', icon: FiAlertCircle },
  { id: 'feature', label: 'Feature Request', icon: FiZap },
]

const initialFormData = {
  name: '',
  email: '',
  severity: 'Low',
  platform: 'Windows',
  message: '',
}

const platformOptions = ['Windows', 'Linux']
const duplicateWindowMs = 10000

const sanitizeValue = (value) => value.replace(/[<>]/g, '').trim()
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function Feedback() {
  const ref = useRef(null)
  const lastSubmissionRef = useRef({ key: '', time: 0 })
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('feedback')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSubmitted(false)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const sanitized = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, sanitizeValue(String(value))])
    )

    if (!sanitized.name || !sanitized.email || !sanitized.message || !sanitized.platform) {
      setError('The shadows need every required field before this can be sent.')
      return
    }

    if (!isValidEmail(sanitized.email)) {
      setError('Enter a valid email address before submitting.')
      return
    }

    if (!GOOGLE_SHEET_API_URL) {
      setError('Feedback endpoint is not configured yet. Add VITE_GOOGLE_SHEET_API_URL to .env.local.')
      return
    }

    const payload = {
      name: sanitized.name,
      email: sanitized.email,
      feedbackType: activeTab === 'bug' ? 'Bug Report' : activeTab === 'feature' ? 'Feature Request' : 'Feedback',
      type: activeTab,
      severity: activeTab === 'bug' ? sanitized.severity : '',
      platform: sanitized.platform,
      suggestion: activeTab === 'feedback' ? sanitized.message : '',
      bugDescription: activeTab === 'bug' ? sanitized.message : '',
      featureRequest: activeTab === 'feature' ? sanitized.message : '',
      message: sanitized.message,
      timestamp: new Date().toISOString(),
      source: 'room404web',
    }

    const submissionKey = JSON.stringify(payload)
    const now = Date.now()

    if (
      lastSubmissionRef.current.key === submissionKey &&
      now - lastSubmissionRef.current.time < duplicateWindowMs
    ) {
      setError('This exact message was just sent. Give it a moment before trying again.')
      return
    }

    setSending(true)
    lastSubmissionRef.current = { key: submissionKey, time: now }

    try {
      await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })
      setSubmitted(true)
      setFormData(initialFormData)
      setTimeout(() => setSubmitted(false), 3500)
    } catch (err) {
      console.error('Feedback submission failed:', err)
      setError('The message could not reach the archive. Please try again in a moment.')
      lastSubmissionRef.current = { key: '', time: 0 }
    } finally {
      setSending(false)
    }
  }

  const renderForm = () => {
    if (submitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="feedback-success-sigil w-16 h-16 border-2 border-blood/50 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="text-blood-300 text-2xl" />
          </div>
          <h3 className="font-title text-xl text-horror-bone mb-2">Message Sealed</h3>
          <p className="font-body text-sm text-horror-offwhite/40">Your submission has been sent to the archive</p>
        </motion.div>
      )
    }

    return (
      <motion.form
        key={activeTab}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative z-10 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="feedback-name" className="block font-body text-sm text-horror-offwhite/60 mb-2">Name</label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="feedback-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="feedback-email" className="block font-body text-sm text-horror-offwhite/60 mb-2">Email</label>
            <input
              id="feedback-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="feedback-field"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {activeTab === 'bug' && (
          <div>
            <label htmlFor="feedback-severity" className="block font-body text-sm text-horror-offwhite/60 mb-2">Severity</label>
            <select
              id="feedback-severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="feedback-field text-horror-offwhite/80"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="feedback-platform" className="block font-body text-sm text-horror-offwhite/60 mb-2">Platform</label>
          <select
            id="feedback-platform"
            name="platform"
            required
            value={formData.platform}
            onChange={handleChange}
            className="feedback-field text-horror-offwhite/80"
          >
            {platformOptions.map((platform) => (
              <option key={platform}>{platform}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="feedback-message" className="block font-body text-sm text-horror-offwhite/60 mb-2">
            {activeTab === 'bug' ? 'Description' : activeTab === 'feedback' ? 'Your Feedback' : 'Feature Description'}
          </label>
          <textarea
            id="feedback-message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="feedback-field resize-none"
            placeholder={
              activeTab === 'bug'
                ? 'Describe the bug and steps to reproduce...'
                : activeTab === 'feedback'
                ? 'Share your thoughts about the game...'
                : "Describe the feature you'd like to see..."
            }
          />
        </div>

        {error && (
          <p className="font-body text-sm text-blood-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full group text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <FiLoader className="mr-3 animate-spin" />
          ) : (
            <FiSend className="mr-3 group-hover:translate-x-1 transition-transform" />
          )}
          {sending ? 'Sending...' : 'Submit'}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </motion.form>
    )
  }

  return (
    <section id="feedback" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-black via-horror-dark to-horror-black pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">Community</span>{' '}
            <span className="text-blood">Feedback</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
          <p className="section-subtitle mt-6">
            Your voice shapes the nightmare. Share your thoughts, report bugs, or suggest features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="horror-card p-1">
            <div className="relative z-10 flex border-b border-horror-gray/30" role="tablist" aria-label="Community feedback type">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`feedback-panel-${tab.id}`}
                    onClick={() => handleTabChange(tab.id)}
                    className={`feedback-tab ${isActive ? 'feedback-tab-active' : 'text-horror-offwhite/45'}`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div
              id={`feedback-panel-${activeTab}`}
              role="tabpanel"
              className="relative z-10 p-6 md:p-8"
            >
              {renderForm()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
