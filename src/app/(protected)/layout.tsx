'use client';

import { Navigation } from '@/components/Navigation';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="pb-20">
        {children}
      </div>
      
      {/* NAVIGATION FIXO NO FUNDO - LARGURA TOTAL */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 py-2 z-50">
        <Navigation /> {/* ⬅️ REMOVI a div com flex justify-center */}
      </div>
    </div>
  );
}