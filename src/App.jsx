import { Component, useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Download from './components/Download'
import Gallery from './components/Gallery'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import NovelReader from './components/NovelReader'
import StoryWorld from './components/StoryWorld'
import StorylineVideoPlayer from './components/StorylineVideoPlayer'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-horror-black flex items-center justify-center p-8">
          <div className="text-center max-w-lg">
            <h1 className="font-horror text-6xl text-blood mb-4">ERROR</h1>
            <p className="font-body text-horror-offwhite/60 mb-4">
              Something went wrong. Please try refreshing the page.
            </p>
            <pre className="font-body text-xs text-blood-300/50 bg-horror-dark p-4 rounded overflow-auto max-h-32">
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [showReader, setShowReader] = useState(() => window.location.hash === '#reader')
  const [activeVideo, setActiveVideo] = useState(() => getActiveVideo(window.location.hash))

  useEffect(() => {
    const checkHash = () => {
      setShowReader(window.location.hash === '#reader')
      setActiveVideo(getActiveVideo(window.location.hash))
    }
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  const handleCloseReader = () => {
    setShowReader(false)
    if (window.location.hash === '#reader') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  const handleCloseVideo = () => {
    setActiveVideo(null)
    if (window.location.hash === '#video' || window.location.hash === '#trailer') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <ErrorBoundary>
      {showReader && <NovelReader onClose={handleCloseReader} />}
      {activeVideo && (
        <StorylineVideoPlayer
          onClose={handleCloseVideo}
          videoId={activeVideo.videoId}
          title={activeVideo.title}
          label={activeVideo.label}
        />
      )}
      <div className="relative min-h-screen bg-horror-black text-horror-offwhite">
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <About />
          <StoryWorld />
          <Features />
          <Download />
          <Gallery />
          <Feedback />
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  )
}

function getActiveVideo(hash) {
  if (hash === '#trailer') {
    return {
      videoId: 'KePtFC3sWvk',
      title: 'Room 404 Trailer Video',
      label: 'Official Trailer Video'
    }
  }

  if (hash === '#video') {
    return {
      videoId: 'byrbtAzBaTs',
      title: 'Room 404 Storyline Video',
      label: 'Official Storyline Video'
    }
  }

  return null
}
