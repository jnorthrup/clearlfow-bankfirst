import React, { useState, useCallback } from 'react';
import {
  identityVerificationService,
  VerificationProvider,
  VerificationSession,
} from '../../services/identity-verification.service';

interface IdentityVerificationProps {
  userData: { name: string; email: string; useCase?: string };
  onVerificationComplete: (verificationData: {
    provider: string;
    status: 'verified';
    verifiedAt: string;
    score?: number;
    documentType?: string;
  }) => void;
  onSkip?: () => void;
  isEmbedded?: boolean;
}

type Step = 'select-provider' | 'initiating' | 'verification' | 'complete' | 'failed';

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  userData,
  onVerificationComplete,
  onSkip,
  isEmbedded = false,
}) => {
  const [step, setStep] = useState<Step>('select-provider');
  const [selectedProvider, setSelectedProvider] = useState<VerificationProvider | null>(null);
  const [session, setSession] = useState<VerificationSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providers: VerificationProvider[] = ['stripe', 'plaid', 'bank'];

  const handleProviderSelect = useCallback(async (provider: VerificationProvider) => {
    setSelectedProvider(provider);
    setStep('initiating');
    setError(null);

    try {
      const newSession = await identityVerificationService.createVerificationSession(
        provider,
        userData
      );
      setSession(newSession);

      if (newSession.url) {
        window.location.href = newSession.url;
      } else {
        setStep('verification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start verification');
      setStep('failed');
    }
  }, [userData]);

  const handleMockVerification = useCallback(() => {
    setStep('complete');
    const providerInfo = identityVerificationService.getProviderDisplayInfo(selectedProvider!);
    onVerificationComplete({
      provider: identityVerificationService.mapProviderToIdentityProvider(selectedProvider!),
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      score: 0.95,
      documentType: providerInfo.name,
    });
  }, [selectedProvider, onVerificationComplete]);

  const handleRetry = useCallback(() => {
    setStep('select-provider');
    setSession(null);
    setError(null);
  }, []);

  const containerClass = isEmbedded
    ? ''
    : 'flex items-center justify-center min-h-screen';

  const cardClass = isEmbedded
    ? 'p-6'
    : 'p-8 bg-slate-800/50 rounded-lg shadow-2xl border border-slate-700 max-w-2xl w-full';

  const renderProviderCard = (provider: VerificationProvider) => {
    const info = identityVerificationService.getProviderDisplayInfo(provider);
    const requirements = identityVerificationService.getVerificationRequirements(provider);

    return (
      <button
        key={provider}
        onClick={() => handleProviderSelect(provider)}
        className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-lg text-left transition-all duration-200 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.icon}</span>
            <div>
              <h3 className="font-semibold text-slate-100 group-hover:text-blue-400">
                {info.name}
              </h3>
              <p className="text-sm text-slate-400">{info.description}</p>
            </div>
          </div>
          <span className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded">
            {info.verificationLevel.toUpperCase()}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-600">
          <p className="text-xs text-slate-400 mb-1">Required:</p>
          <ul className="text-xs text-slate-300 space-y-1">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="text-blue-400">•</span> {req}
              </li>
            ))}
          </ul>
        </div>
      </button>
    );
  };

  const renderContent = () => {
    switch (step) {
      case 'select-provider':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-100">Verify Your Identity</h1>
              <p className="text-slate-400 mt-2">
                Select a verification method to continue. This is required before you can use ClearFlow.
              </p>
            </div>
            <div className="space-y-4">
              {providers.map(renderProviderCard)}
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full mt-6 text-center text-sm text-slate-500 hover:text-slate-400"
              >
                Skip for now
              </button>
            )}
          </>
        );

      case 'initiating':
        return (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-100">Starting Verification</h2>
            <p className="text-slate-400 mt-2">
              Connecting to {selectedProvider && identityVerificationService.getProviderDisplayInfo(selectedProvider).name}...
            </p>
          </div>
        );

      case 'verification':
        return (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-100">Verification In Progress</h2>
            <p className="text-slate-400 mt-2 mb-6">
              Please complete the verification process in the opened window.
            </p>
            <button
              onClick={handleMockVerification}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              (Dev: Complete Mock Verification)
            </button>
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
            <h2 className="text-xl font-semibold text-slate-100 mt-4">Identity Verified</h2>
            <p className="text-slate-400 mt-2">
              Your identity has been successfully verified via{' '}
              {selectedProvider && identityVerificationService.getProviderDisplayInfo(selectedProvider).name}.
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
            <h2 className="text-xl font-semibold text-slate-100 mt-4">Verification Failed</h2>
            <p className="text-red-400 bg-red-900/30 p-3 rounded-md mt-4 text-sm">
              {error || 'An unexpected error occurred during verification.'}
            </p>
            <div className="mt-6 space-x-4">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500"
                >
                  Skip
                </button>
              )}
            </div>
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

export default IdentityVerification;
