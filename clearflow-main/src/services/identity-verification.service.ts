import { IdentityProvider, IdentityVerificationData } from '../types/app.models';

const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_BASE_URL || '/api';

export type VerificationProvider = 'stripe' | 'plaid' | 'bank';

export interface VerificationSession {
  id: string;
  provider: VerificationProvider;
  status: 'pending' | 'completed' | 'failed';
  clientSecret?: string;
  url?: string;
}

export interface VerificationResult {
  success: boolean;
  provider: IdentityProvider;
  score?: number;
  documentType?: string;
  documentCountry?: string;
  error?: string;
  referenceId?: string;
}

class IdentityVerificationService {
  private getProviderConfig(provider: VerificationProvider) {
    return {
      stripe: {
        endpoint: `${API_BASE_URL}/verification/stripe/create-session`,
        webhook: `${API_BASE_URL}/verification/stripe/webhook`,
      },
      plaid: {
        endpoint: `${API_BASE_URL}/verification/plaid/create-verification`,
        webhook: `${API_BASE_URL}/verification/plaid/webhook`,
      },
      bank: {
        endpoint: `${API_BASE_URL}/verification/bank/create-session`,
        webhook: `${API_BASE_URL}/verification/bank/webhook`,
      },
    }[provider];
  }

  async createVerificationSession(
    provider: VerificationProvider,
    userData: { name: string; email: string; useCase?: string }
  ): Promise<VerificationSession> {
    const config = this.getProviderConfig(provider);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create session' }));
      throw new Error(error.error || 'Failed to create verification session');
    }

    return response.json();
  }

  async checkVerificationStatus(sessionId: string): Promise<VerificationResult> {
    const response = await fetch(`${API_BASE_URL}/verification/status/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check verification status');
    }

    return response.json();
  }

  mapProviderToIdentityProvider(provider: VerificationProvider): IdentityProvider {
    switch (provider) {
      case 'stripe':
        return 'stripe_identity';
      case 'plaid':
        return 'plaid_id_verify';
      case 'bank':
        return 'bank_link';
      default:
        return 'stripe_identity';
    }
  }

  getProviderDisplayInfo(provider: VerificationProvider) {
    return {
      stripe: {
        name: 'Stripe Identity',
        description: 'Government ID + selfie verification',
        icon: '🪪',
        supportedDocs: 'Passport, Driver License, ID Card (100+ countries)',
        verificationLevel: 'enhanced' as const,
      },
      plaid: {
        name: 'Plaid Identity Verification',
        description: 'KYC/AML compliant identity data',
        icon: '🏦',
        supportedDocs: 'Bank-linked identity verification',
        verificationLevel: 'full' as const,
      },
      bank: {
        name: 'Bank Link Verification',
        description: 'Verify through your bank (Robinhood-style)',
        icon: '🔗',
        supportedDocs: 'Any bank account you own',
        verificationLevel: 'basic' as const,
      },
    }[provider];
  }

  getVerificationRequirements(provider: VerificationProvider): string[] {
    switch (provider) {
      case 'stripe':
        return [
          'Government-issued photo ID',
          'Device with camera for selfie',
          'Stable internet connection',
        ];
      case 'plaid':
        return [
          'Bank account at a supported institution',
          'Online banking credentials',
          'Account in good standing (90+ days old)',
        ];
      case 'bank':
        return [
          'Bank account with online banking',
          'Account must be in your name',
          'Ability to verify small test deposits',
        ];
    }
  }
}

export const identityVerificationService = new IdentityVerificationService();
