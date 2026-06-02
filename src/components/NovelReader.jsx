import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight, FiBookOpen } from 'react-icons/fi'
import { PageFlip } from 'page-flip'
import novelRaw from '../../Room404 Novel.md?raw'

const CHARS_PER_LINE = 54
const MAX_LINES_PER_PAGE = 19

function renderInline(text) {
  if (!text) return text
  const parts = []
  let lastIdx = 0
  const re = /!\[([^\]]*)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index))
    if (m[1] && m[2]) {
      parts.push(<img key={m.index} src={m[2]} alt={m[1]} className="max-w-full h-auto my-2 mx-auto rounded" />)
    } else if (m[3]) {
      parts.push(<strong key={m.index} className="font-bold text-[#3B2A1A]">{m[3]}</strong>)
    }
    lastIdx = m.index + m[0].length
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx))
  return parts.length ? parts : text
}

function renderLine(ln, i) {
  const { text, type } = ln
  if (type === 'empty') return <div key={i} className="h-3" />
  if (type === 'hr') return <div key={i} className="my-4 border-t border-[#7A1212]/20" />

  if (type === 'heading') {
    const level = ln.level || 3
    const cls = level <= 2
      ? 'blood-heading text-2xl md:text-3xl mt-6 mb-4 !text-[#7A1212] border-l-2 border-[#7A1212] pl-4 leading-tight'
      : 'blood-heading text-xl md:text-2xl mt-6 mb-3 !text-[#7A1212] border-l-2 border-[#7A1212]/70 pl-4 leading-tight'
    return <h2 key={i} className={cls}>{text.replace(/^#+\s*/, '')}</h2>
  }

  if (type === 'blockquote') {
    return (
      <blockquote key={i} className="pl-4 ml-2 border-l-2 border-[#7A1212]/30 italic text-[#3B2A1A]/80 text-[14px] md:text-[15px] my-2">
        {renderInline(text)}
      </blockquote>
    )
  }

  if (type === 'list-item') {
    const prefix = ln.ordered ? `${ln.index || 1}.` : '—'
    return (
      <p key={i} className="text-[14px] md:text-[16px] text-[#3B2A1A]/90 pl-4 ml-2 mb-1 text-justify tracking-tight">
        <span className="text-[#7A1212]/50 mr-2">{prefix}</span>
        {renderInline(text)}
      </p>
    )
  }

  return (
    <p key={i} className={`text-[14px] md:text-[16px] text-[#3B2A1A]/90 text-justify tracking-tight leading-[1.75] ${i > 0 ? 'mt-1' : ''}`}>
      {renderInline(text)}
    </p>
  )
}

const TitlePage = () => (
  <div className="relative h-full flex flex-col items-center justify-center p-12 z-10 font-['Special_Elite'] text-center">
    <div className="absolute w-72 h-72 bg-[#F5D67A]/15 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute w-40 h-40 bg-[#7A1212]/10 blur-[80px] rounded-full pointer-events-none top-1/3" />
    <h1 className="text-6xl md:text-8xl text-[#7A1212] mb-8 tracking-tighter leading-none select-none drop-shadow-lg"
      style={{ textShadow: '0 0 30px rgba(122,18,18,0.3), 0 2px 4px rgba(0,0,0,0.2)' }}>
      ROOM 404
    </h1>
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#7A1212]/40 to-transparent mb-8" />
    <p className="text-[#3B2A1A] text-lg md:text-xl italic opacity-80 max-w-sm tracking-wide leading-relaxed">
      &ldquo;Some doors were never meant to be opened&hellip;&rdquo;
    </p>
    <div className="mt-12 text-[#7A1212]/20 text-xs tracking-[0.5em] uppercase">A Novel of Terror</div>
  </div>
)

export default function NovelReader({ onClose }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const bookRef = useRef(null)
  const pageFlipRef = useRef(null)

  const pages = useMemo(() => {
    const paragraphs = novelRaw.split('\n')
    const result = [{ lines: [], chapter: null }]
    let curLines = []
    let lineCount = 0
    let afterBreak = true
    let currentChapter = null

    const flush = () => {
      if (curLines.length) {
        result.push({ lines: [...curLines], chapter: currentChapter })
        curLines = []
        lineCount = 0
      }
    }

    const classify = (t) => {
      const s = t.trim()
      if (!s) return { text: '', type: 'empty' }

      const stripped = s.replace(/\s+/g, '')
      if (/^#{1,3}$/.test(stripped)) return { text: '', type: 'pagebreak' }
      if (/^[-*_]{3,}$/.test(s)) return { text: '', type: 'pagebreak' }

      if (/^###\s/.test(s)) return { text: s, type: 'heading', level: 3 }
      if (/^##\s/.test(s)) return { text: s, type: 'heading', level: 2 }
      if (/^#\s/.test(s)) return { text: s, type: 'heading', level: 1 }
      if (/^>\s/.test(s)) return { text: s.replace(/^>\s*/, ''), type: 'blockquote' }
      if (/^[-*]\s/.test(s)) return { text: s.replace(/^[-*]\s*/, ''), type: 'list-item', ordered: false }
      if (/^\d+\.\s/.test(s)) return { text: s.replace(/^\d+\.\s*/, ''), type: 'list-item', ordered: true }
      return { text: s, type: 'paragraph' }
    }

    for (const raw of paragraphs) {
      const ln = classify(raw)

      if (ln.type === 'pagebreak') {
        flush()
        afterBreak = true
        continue
      }

      if (afterBreak && ln.type === 'empty') continue
      afterBreak = false

      if (ln.type === 'heading' && ln.level === 3) {
        const m = ln.text.match(/^###\s+Chapter\s+(\d+)\s*[—\-–]\s*(.+)/)
        if (m) {
          currentChapter = { num: parseInt(m[1], 10), title: m[2] }
        }
      }

      if (ln.type === 'empty') {
        if (lineCount + 1 > MAX_LINES_PER_PAGE) flush()
        curLines.push(ln); lineCount += 1
        continue
      }

      const weight = ln.type === 'heading' ? 3 : 0
      const est = Math.ceil((ln.text?.length || 0) / CHARS_PER_LINE) + weight

      if (lineCount + est <= MAX_LINES_PER_PAGE) {
        curLines.push(ln); lineCount += est
      } else {
        let rem = ln.text || ''
        let first = true
        while (rem.length) {
          const avail = MAX_LINES_PER_PAGE - lineCount
          if (avail <= (ln.type === 'heading' ? 2 : 1)) { flush(); continue }
          const limit = avail * CHARS_PER_LINE
          if (rem.length <= limit * 1.1) {
            curLines.push({ ...ln, text: rem }); lineCount += Math.ceil(rem.length / CHARS_PER_LINE) + (first && ln.type === 'heading' ? 2 : 0)
            rem = ''
          } else {
            let sp = rem.lastIndexOf(' ', limit)
            if (sp === -1 || sp < limit * 0.7) sp = limit
            const chunk = rem.slice(0, sp).trim()
            if (chunk) curLines.push({ ...ln, text: chunk })
            flush()
            rem = rem.slice(sp).trim()
            first = false
          }
        }
      }
    }
    flush()
    return result
  }, [])

  const totalPages = pages.length

  useEffect(() => {
    if (!bookRef.current || !pages.length) return

    const rect = bookRef.current.getBoundingClientRect()
    const w = Math.floor(rect.width)
    const h = Math.floor(rect.height)

    const pf = new PageFlip(bookRef.current, {
      width: w,
      height: h,
      size: 'fixed',
      autoSize: true,
      showCover: true,
      usePortrait: true,
      flippingTime: 800,
      drawShadow: false,
      mobileScrollSupport: false,
    })

    pf.loadFromHTML(bookRef.current.querySelectorAll('.book-page'))

    pf.on('flip', (e) => {
      setCurrentPage(e.data)
    })

    pf.on('changeState', (e) => {
      setIsFlipping(e.data !== 'read')
    })

    pageFlipRef.current = pf

    const saved = localStorage.getItem('room404_novel_page')
    if (saved) {
      const p = parseInt(saved, 10)
      if (!isNaN(p) && p >= 0 && p < totalPages) {
        pf.turnToPage(p)
        setCurrentPage(p)
      }
    }

    return () => pf.destroy()
  }, [pages.length])

  useEffect(() => {
    localStorage.setItem('room404_novel_page', currentPage)
  }, [currentPage])

  const nextPage = useCallback(() => {
    if (!pageFlipRef.current || isFlipping) return
    pageFlipRef.current.flipNext('bottom')
  }, [isFlipping])

  const prevPage = useCallback(() => {
    if (!pageFlipRef.current || isFlipping) return
    pageFlipRef.current.flipPrev('bottom')
  }, [isFlipping])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage()
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [nextPage, prevPage, onClose])

  function renderPageContent(pageData, pageIndex) {
    const isTitle = pageIndex === 0
    const { lines, chapter } = pageData
    return (
      <div className="relative w-full h-full overflow-hidden rounded-sm">
        <div className="absolute inset-0 bg-cover bg-center shadow-inner" style={{ backgroundImage: 'url("/page.png")' }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-black/5" />
        <div className="absolute inset-0 pointer-events-none bg-noise opacity-[0.04] mix-blend-multiply" />
        <div className="absolute inset-0 pointer-events-none rounded-sm" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.12) 100%)'
        }} />

        <div className="relative h-full flex flex-col p-6 sm:p-8 md:p-10 z-10 font-['Special_Elite']">
          {isTitle ? (
            <TitlePage />
          ) : (
            <>
              <div className="mb-4 flex flex-col items-center">
                <span className="text-[#7A1212]/50 text-[10px] tracking-[0.4em] uppercase font-bold select-none">
                  {chapter ? `Chapter ${chapter.num} \u2014 ${chapter.title}` : 'The Manuscript'}
                </span>
                <div className="w-12 h-px bg-[#7A1212]/15 mt-2" />
              </div>
              <div className="flex-1 overflow-hidden">
                {lines.map((ln, i) => renderLine(ln, i))}
              </div>
              <div className="mt-3 flex flex-col items-center">
                <div className="w-full h-px bg-[#7A1212]/12 mb-2" />
                <div className="w-full flex justify-between items-center px-1">
                  <span className="text-[#7A1212]/40 text-[11px] font-bold tracking-wider font-['Special_Elite']">{pageIndex + 1}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-horror text-sm text-blood/50">ROOM</span>
                    <span className="font-horror text-base text-blood">404</span>
                  </div>
                  <span className="text-[#7A1212]/30 text-xs">❦</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none border border-black/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.08)] rounded-sm" />
      </div>
    )
  }

  const canGoNext = currentPage < totalPages - 1
  const canGoPrev = currentPage > 0
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden select-none">
      <div className="fixed inset-0 pointer-events-none z-[1] bg-noise opacity-[0.025]" />
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(245,214,122,0.03) 0%, transparent 60%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-[1] mix-blend-overlay opacity-[0.015]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[9999] p-3 bg-black/60 border border-blood/20 text-blood hover:bg-blood/20 hover:text-blood-300 rounded-full transition-all shadow-lg hover:shadow-blood/20"
        title="Close reader (Esc)"
      >
        <FiX size={20} />
      </button>

      <div className="relative z-10 flex items-center justify-center w-full max-w-2xl px-4">
        <div className="relative w-full max-w-lg" style={{ height: 'min(80vh, 820px)' }}>
          <div ref={bookRef} className="w-full h-full">
            {pages.map((pageData, idx) => (
              <div key={idx} className="book-page w-full h-full" data-density={idx === 0 ? 'hard' : 'soft'}>
                {renderPageContent(pageData, idx)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-6 flex items-center justify-center gap-6 w-full max-w-3xl px-4">
        <button
          onClick={prevPage}
          disabled={!canGoPrev}
          className="p-3 text-blood disabled:opacity-10 hover:text-blood-300 transition-all disabled:cursor-not-allowed hover:scale-110 active:scale-95"
        >
          <FiChevronLeft size={28} />
        </button>

        <div className="px-6 py-2 bg-black/60 border border-blood/15 rounded-full shadow-inner backdrop-blur-sm">
          <span className="font-['Special_Elite'] text-blood text-sm tracking-[0.3em]">
            {currentPage + 1}<span className="text-blood/40 mx-2">/</span>{totalPages}
          </span>
        </div>

        <button
          onClick={nextPage}
          disabled={!canGoNext}
          className="p-3 text-blood disabled:opacity-10 hover:text-blood-300 transition-all disabled:cursor-not-allowed hover:scale-110 active:scale-95"
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      <div className="relative z-20 mt-4 w-full max-w-3xl px-8">
        <div className="relative w-full h-[2px] bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blood/50 to-blood"
            style={{ boxShadow: '0 0 8px rgba(122,18,18,0.4)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center text-horror-offwhite/15 font-['Special_Elite'] text-[9px] tracking-[0.3em] uppercase italic">
          <span className="flex items-center gap-2">
            <FiBookOpen size={10} className="text-blood/30" />
            Deciphering the Darkness
          </span>
          <span className="text-blood/30">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
