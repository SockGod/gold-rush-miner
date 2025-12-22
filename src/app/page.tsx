// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">⛏️ SOCKGOD Gold Rush</h1>
        <p className="text-gray-300">Loading mining adventure...</p>
        <div className="mt-8">
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-yellow-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}