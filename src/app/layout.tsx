import { StoreProvider } from '@/components/StoreContext';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SOCKGOD Gold Rush - READY FOR WLD', // MUDADO PARA FORÇAR DEPLOY
  description: 'Skill-based gold mining game on World App',
  icons: {
    icon: '/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Removido ClientProviders */}
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}