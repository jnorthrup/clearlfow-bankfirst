import dynamic from 'next/dynamic';

const AppWithAuth = dynamic(
  () => import('./clearflow-main/src/app/App').then(mod => ({ default: mod.App })),
  { ssr: false, loading: () => <div className="min-h-screen bg-slate-900" /> }
);

export default function Page() {
  return <AppWithAuth />;
}
