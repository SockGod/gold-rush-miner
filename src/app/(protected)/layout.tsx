'use client';

import { Navigation } from '@/components/Navigation';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* CONTEÚDO PRINCIPAL COM ESPAÇO PARA NAVIGATION */}
      <div style={{ paddingBottom: '70px' }}>
        {children}
      </div>
      
      {/* NAVIGATION FIXO NO FUNDO */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '10px 0',
        zIndex: 100
      }}>
        <Navigation />
      </div>
    </>
  );
}