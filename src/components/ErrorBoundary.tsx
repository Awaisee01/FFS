
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            {this.state.error && (
              <details className="text-sm text-red-600">
                <summary className="cursor-pointer">Error details</summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline" size="sm">
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                variant="destructive" 
                size="sm"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
