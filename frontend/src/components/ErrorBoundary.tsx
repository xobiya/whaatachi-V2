import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRetrying: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
    this.startAutoRetry();
  }

  componentWillUnmount(): void {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  private startAutoRetry(): void {
    this.retryTimer = setTimeout(() => {
      this.setState({ hasError: false, error: null, isRetrying: true });
      setTimeout(() => this.setState({ isRetrying: false }), 300);
    }, 3000);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#120A0E] text-[#FFFCF8] p-6">
          <div className="max-w-md text-center space-y-6">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#EB317A] border-r-[#C9A84C] border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#EB317A]/20 to-[#C9A84C]/20 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-black">Connection interrupted</h1>
              <p className="text-sm text-[#EDE6D9]/60">
                Having trouble loading this page. Retrying automatically...
              </p>
            </div>
            <button
              onClick={() => {
                if (this.retryTimer) clearTimeout(this.retryTimer);
                this.setState({ hasError: false, error: null, isRetrying: true });
                setTimeout(() => this.setState({ isRetrying: false }), 300);
              }}
              className="px-6 py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl cursor-pointer transition-all text-sm"
            >
              Retry now
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
