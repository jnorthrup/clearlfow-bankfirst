import React, { useState, useCallback } from 'react';
import { BasicInfoCollection } from './BasicInfoCollection';
import { IdentityVerification } from './IdentityVerification';
import { GoogleOAuthBinding } from './GoogleOAuthBinding';

export type OnboardingStep = 'basic-info' | 'identity-verification' | 'google-binding' | 'complete';

interface OnboardingFlowProps {
  onComplete: (userData: {
    name: string;
    email: string;
    useCase: string;
    identityVerification: {
      provider: string;
      status: string;
      verifiedAt: string;
      score?: number;
    };
    googleSub?: string;
  }) => void;
  isEmbedded?: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, isEmbedded = false }) => {
  const [step, setStep] = useState<OnboardingStep>('basic-info');
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    useCase: string;
  } | null>(null);
  const [verificationData, setVerificationData] = useState<{
    provider: string;
    status: string;
    verifiedAt: string;
    score?: number;
  } | null>(null);
  const [googleSub, setGoogleSub] = useState<string | null>(null);

  const handleBasicInfoComplete = useCallback((data: { name: string; email: string; useCase: string }) => {
    setUserData(data);
    setStep('identity-verification');
  }, []);

  const handleVerificationComplete = useCallback((data: {
    provider: string;
    status: string;
    verifiedAt: string;
    score?: number;
  }) => {
    setVerificationData(data);
    setStep('google-binding');
  }, []);

  const handleGoogleBindingComplete = useCallback((sub: string) => {
    setGoogleSub(sub);
    setStep('complete');

    if (userData && verificationData) {
      onComplete({
        name: userData.name,
        email: userData.email,
        useCase: userData.useCase,
        identityVerification: verificationData,
        googleSub: sub,
      });
    }
  }, [userData, verificationData, onComplete]);

  const handleSkipVerification = useCallback(() => {
    setVerificationData({
      provider: 'none',
      status: 'skipped',
      verifiedAt: new Date().toISOString(),
    });
    setStep('google-binding');
  }, []);

  const handleSkipGoogleBinding = useCallback(() => {
    setStep('complete');
    if (userData && verificationData) {
      onComplete({
        name: userData.name,
        email: userData.email,
        useCase: userData.useCase,
        identityVerification: verificationData,
        googleSub: undefined,
      });
    }
  }, [userData, verificationData, onComplete]);

  const renderStepIndicator = () => {
    const steps: { key: OnboardingStep; label: string }[] = [
      { key: 'basic-info', label: 'Basic Info' },
      { key: 'identity-verification', label: 'Identity' },
      { key: 'google-binding', label: 'Google' },
    ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((s, index) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {index < currentIndex ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm ${index <= currentIndex ? 'text-slate-200' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${index < currentIndex ? 'bg-blue-600' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (step === 'complete') {
    return null;
  }

  return (
    <div className={isEmbedded ? '' : 'min-h-screen bg-slate-900'}>
      {renderStepIndicator()}
      {step === 'basic-info' && (
        <BasicInfoCollection onComplete={handleBasicInfoComplete} isEmbedded={isEmbedded} />
      )}
      {step === 'identity-verification' && userData && (
        <IdentityVerification
          userData={userData}
          onVerificationComplete={handleVerificationComplete}
          onSkip={handleSkipVerification}
          isEmbedded={isEmbedded}
        />
      )}
      {step === 'google-binding' && (
        <GoogleOAuthBinding
          onBindingComplete={handleGoogleBindingComplete}
          isEmbedded={isEmbedded}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
