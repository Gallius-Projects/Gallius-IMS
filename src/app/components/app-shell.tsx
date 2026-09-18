'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useUserContext();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_info');

    if (!token || !savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, [router]);

  return <>{children}</>;
}
