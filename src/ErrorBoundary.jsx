import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info) }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-black text-ink mb-2">Something went wrong</h2>
        <p className="text-sm text-ink-muted mb-6 max-w-xs">
          {this.state.error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
          className="btn-primary px-8 py-3"
        >Go Home</button>
      </div>
    )
    return this.props.children
  }
}
