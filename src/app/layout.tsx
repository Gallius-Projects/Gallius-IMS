import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  League_Spartan,
  Poppins,
  Montserrat,
} from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
// import AppShell from './components/app-shell';
import './globals.css';
import AppShell from './components/app-shell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-league-spartan',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Asset Inventory System | Gallius OPC',
  description: 'A modern, premium inventory and asset management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} ${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full transition-colors duration-200">
        <ThemeProvider>
          <UserProvider>
            <AppShell>{children}</AppShell>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
