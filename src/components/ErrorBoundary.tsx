import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#120A0E] text-[#FFFCF8] p-6">
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4">💔</div>
            <h1 className="text-xl font-black mb-2">Oops, something broke</h1>
            <p className="text-sm text-[#EDE6D9]/60 mb-6">
              Whaatachi hit a snag. Try refreshing the page.
            </p>
            <p className="text-[10px] text-[#EDE6D9]/30 mb-6 font-mono break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="px-6 py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl cursor-pointer transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
