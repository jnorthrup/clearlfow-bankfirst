import express, { Request, Response } from 'express';

const router = express.Router();

interface VerificationSession {
  id: string;
  provider: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  userData: {
    name: string;
    email: string;
    useCase?: string;
  };
}

const verificationSessions = new Map<string, VerificationSession>();

router.post('/stripe/create-session', async (req: Request, res: Response) => {
  try {
    const { name, email, useCase } = req.body;
    
    const sessionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: VerificationSession = {
      id: sessionId,
      provider: 'stripe_identity',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userData: { name, email, useCase },
    };
    
    verificationSessions.set(sessionId, session);
    
    const clientSecret = `${sessionId}_secret_${Math.random().toString(36).substr(2, 16)}`;
    
    res.json({
      id: sessionId,
      provider: 'stripe',
      status: 'pending',
      clientSecret,
      url: process.env.STRIPE_IDENTITY_URL 
        ? `${process.env.STRIPE_IDENTITY_URL}?session_id=${sessionId}`
        : undefined,
    });
  } catch (error) {
    console.error('Error creating Stripe verification session:', error);
    res.status(500).json({ error: 'Failed to create verification session' });
  }
});

router.post('/plaid/create-verification', async (req: Request, res: Response) => {
  try {
    const { name, email, useCase } = req.body;
    
    const sessionId = `plaid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: VerificationSession = {
      id: sessionId,
      provider: 'plaid_id_verify',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userData: { name, email, useCase },
    };
    
    verificationSessions.set(sessionId, session);
    
    res.json({
      id: sessionId,
      provider: 'plaid',
      status: 'pending',
      url: process.env.PLAID_ID_VERIFY_URL
        ? `${process.env.PLAID_ID_VERIFY_URL}?session_id=${sessionId}`
        : undefined,
    });
  } catch (error) {
    console.error('Error creating Plaid verification session:', error);
    res.status(500).json({ error: 'Failed to create verification session' });
  }
});

router.post('/bank/create-session', async (req: Request, res: Response) => {
  try {
    const { name, email, useCase } = req.body;
    
    const sessionId = `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: VerificationSession = {
      id: sessionId,
      provider: 'bank_link',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userData: { name, email, useCase },
    };
    
    verificationSessions.set(sessionId, session);
    
    res.json({
      id: sessionId,
      provider: 'bank',
      status: 'pending',
      url: process.env.BANK_VERIFY_URL
        ? `${process.env.BANK_VERIFY_URL}?session_id=${sessionId}`
        : undefined,
    });
  } catch (error) {
    console.error('Error creating bank verification session:', error);
    res.status(500).json({ error: 'Failed to create verification session' });
  }
});

router.get('/status/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = verificationSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      id: session.id,
      provider: session.provider,
      status: session.status,
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    res.status(500).json({ error: 'Failed to check verification status' });
  }
});

router.post('/webhook/:provider', async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { sessionId, status, data } = req.body;
    
    const session = verificationSessions.get(sessionId);
    if (session) {
      session.status = status;
      verificationSessions.set(sessionId, session);
    }
    
    console.log(`Verification webhook for ${provider}:`, { sessionId, status, data });
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing verification webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;
