'use client'; // ✅ ADICIONAR ESTA LINHA - layout precisa ser client component

import { StoreProvider } from '@/components/StoreContext';
import { MiniKitProvider } from '@worldcoin/minikit-js';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata precisa estar separada porque usamos 'use client'
export const metadata: Metadata = {
  title: 'Gold Rush Miner - World App',
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
  const [isClient, setIsClient] = useState(false);

  // Garantir que estamos no client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Meta tags importantes para World App */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a192f" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ MiniKitProvider É OBRIGATÓRIO para WLD */}
        {isClient ? (
          <MiniKitProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </MiniKitProvider>
        ) : (
          // Fallback durante SSR
          <StoreProvider>
            {children}
          </StoreProvider>
        )}
      </body>
    </html>
  );
}