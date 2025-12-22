'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, ShoppingBag, User } from 'iconoir-react'; // Só estes que sabemos existem
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
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="store" icon={<ShoppingBag />} label="Store" />
      <TabItem value="history" icon={<span>📜</span>} label="History" /> {/* Emoji */}
      <TabItem value="guide" icon={<span>📖</span>} label="Guide" /> {/* Emoji */}
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};