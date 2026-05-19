import { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught error:', error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4 py-12">
        <div className="card w-full max-w-lg p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral/15 text-coral">
            <AlertTriangle size={22} />
          </span>
          <h1 className="display mt-5 text-2xl">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink/65">
            The admin console hit an unexpected error. Reload to recover, or head back to the dashboard.
          </p>

          {this.state.error?.message && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-ink/5 p-3 text-left text-[11px] font-mono text-ink/65">
              {this.state.error.message}
            </pre>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { this.reset(); window.location.reload(); }}
              className="btn-primary"
            >
              <RotateCcw size={13} /> Reload page
            </button>
            <a href="/" className="btn-outline">
              <Home size={13} /> Back to dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
