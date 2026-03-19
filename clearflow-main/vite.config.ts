import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env': {},
        'window.process.env': {
          ...env,
          GOOGLE_CLIENT_ID: env.VITE_GOOGLE_CLIENT_ID || '572657972176-r225vclut7gptavspci56u6m9blse6kt.apps.googleusercontent.com',
          REACT_APP_API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:8000',
          PLAID_CLIENT_ID: env.PLAID_CLIENT_ID || '6988ae960aba88001ee6c2c6',
          API_KEY: env.API_KEY || 'MOCK_API_KEY_FOR_GEMINI',
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
