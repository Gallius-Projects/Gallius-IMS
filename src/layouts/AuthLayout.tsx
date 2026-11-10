import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {children}
      {/* Animated background blobs */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ backgroundColor: 'var(--accent)', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: 'var(--accent)' }}
        />
      </div> */}

      {/* Grid pattern overlay */}
      {/* <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      /> */}

      {/* <div className="relative w-full">{children}</div> */}
    </div>
  );
}
