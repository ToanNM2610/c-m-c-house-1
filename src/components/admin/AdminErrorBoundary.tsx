'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Admin module:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
            Đã xảy ra sự cố tại phân hệ {this.props.moduleName || 'này'}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 max-w-md mx-auto mb-6 font-mono text-xs overflow-x-auto p-2 bg-red-100/50 dark:bg-red-900/40 rounded">
            {this.state.error?.message || 'Lỗi không xác định'}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

