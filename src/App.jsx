import { Component } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Download from './components/Download'
import Gallery from './components/Gallery'
import Feedback from './components/Feedback'
import Footer from './components/Footer'

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
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-horror-black text-horror-offwhite">
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <About />
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
