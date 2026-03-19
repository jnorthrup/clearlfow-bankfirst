"use client";

import { AuthProvider } from '../../clearflow-main/src/contexts/AuthContext';
import { App } from '../../clearflow-main/src/app/App';

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
