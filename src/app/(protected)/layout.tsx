'use client';

import { Navigation } from '@/components/Navigation';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* CONTEÚDO COM SCROLL - NUNCA TAPA A TAB */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>
      
      {/* TAB FIXA NO FUNDO - SEMPRE VISÍVEL */}
      <div className="flex-shrink-0 bg-gray-900 border-t border-gray-700 py-2">
        <Navigation />
      </div>
    </div>
  );
}