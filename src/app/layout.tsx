import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { StoreProvider } from '@/components/StoreContext';
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

export const metadata = {
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
  return (
    <html lang="en">
      <head>
        {/* Meta tags importantes para World App */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MiniKitProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </MiniKitProvider>
      </body>
    </html>
  );
}