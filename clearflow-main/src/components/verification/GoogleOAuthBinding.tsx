import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface GoogleOAuthBindingProps {
  onBindingComplete: (googleSub: string) => void;
  isEmbedded?: boolean;
}

type Step = 'select' | 'binding' | 'complete' | 'failed';

declare const google: any;

export const GoogleOAuthBinding: React.FC<GoogleOAuthBindingProps> = ({
  onBindingComplete,
  isEmbedded = false,
}) => {
  const [step, setStep] = useState<Step>('select');
  const [error, setError] = useState<string | null>(null);
  const { isConfigured, renderGoogleButton } = useAuth();

  const handleGoogleBind = useCallback(() => {
    setStep('binding');
    setError(null);

    if (!isConfigured) {
      const mockSub = `google_${Date.now()}_mock`;
      setStep('complete');
      onBindingComplete(mockSub);
      return;
    }

    const handleCredentialResponse = (response: any) => {
      try {
        const idToken = response.credential;
        const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
        const googleSub = decodedToken.sub;

        setStep('complete');
        onBindingComplete(googleSub);
      } catch (err) {
        setError('Failed to parse Google response');
        setStep('failed');
      }
    };

    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: (window as any).process.env.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      google.accounts.id.renderButton(
        document.getElementById('google-bind-button'),
        { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', width: '280' }
      );
    }
  }, [isConfigured, onBindingComplete]);

  const handleRetry = useCallback(() => {
    setStep('select');
    setError(null);
  }, []);

  const containerClass = isEmbedded
    ? ''
    : 'flex items-center justify-center min-h-screen';

  const cardClass = isEmbedded
    ? 'p-6'
    : 'p-8 bg-slate-800/50 rounded-lg shadow-2xl border border-slate-700 max-w-md w-full';

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Link Your Google Account</h1>
              <p className="text-slate-400 mt-2">
                Bind your Google account to enable app links and secure sign-in.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h3 className="font-medium text-slate-200 mb-2">Why bind Google?</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Secure authentication</li>
                  <li>• App links to your Google account</li>
                  <li>• Easy account recovery</li>
                </ul>
              </div>
              <button
                onClick={handleGoogleBind}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-800 font-semibold rounded-md hover:bg-slate-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </>
        );

      case 'binding':
        return (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-100">Connecting to Google...</h2>
            <p className="text-slate-400 mt-2">Please complete the Google sign-in.</p>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-slate-100 mt-4">Google Account Linked</h2>
            <p className="text-slate-400 mt-2">
              Your Google account has been successfully bound.
            </p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-slate-100 mt-4">Binding Failed</h2>
            <p className="text-red-400 bg-red-900/30 p-3 rounded-md mt-4 text-sm">
              {error || 'Failed to bind Google account.'}
            </p>
            <button
              onClick={handleRetry}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className={containerClass}>
      <div className={cardClass}>{renderContent()}</div>
    </div>
  );
};

export default GoogleOAuthBinding;
