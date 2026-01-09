'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, ShoppingBag, User } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const Navigation = () => {
  const [value, setValue] = useState('home');
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/store')) setValue('store');
    else if (path.includes('/history')) setValue('history');
    else if (path.includes('/guide')) setValue('guide');
    else if (path.includes('/profile')) setValue('profile');
    else setValue('home');
  }, []);

  const handleTabChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'home') router.push('/home');
    else if (newValue === 'store') router.push('/store');
    else if (newValue === 'history') router.push('/history');
    else if (newValue === 'guide') router.push('/guide');
    else if (newValue === 'profile') router.push('/profile');
  };

  return (
    // ⬇️ CONTAINER PRINCIPAL COM LARGURA TOTAL E ESTILO FLEX PARA OS ITENS ⬇️
    <div className="w-full">
      <Tabs 
        value={value} 
        onValueChange={handleTabChange}
        // ⬇️ ESTILO DIRETO NO COMPONENTE TABS PARA DISTRIBUIR OS ITENS ⬇️
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between', // Distribui os itens igualmente
        }}
      >
        <TabItem value="home" icon={<Home />} label="Home" />
        <TabItem value="store" icon={<ShoppingBag />} label="Store" />
        <TabItem value="history" icon={<span>📜</span>} label="History" />
        <TabItem value="guide" icon={<span>📖</span>} label="Guide" />
        <TabItem value="profile" icon={<User />} label="Profile" />
      </Tabs>
    </div>
  );
};