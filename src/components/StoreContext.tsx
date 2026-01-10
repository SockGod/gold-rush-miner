'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type StoreItem = {
  id: string;
  name: string;
  description: string;
  price: number; // in WLD
  image: string;
  type: 'consumable' | 'pack';
  effects?: {
    tnt?: number;
    timer?: number;
    precision?: number;
    extraPlays?: number;
  };
};

export type InventoryItem = {
  itemId: string;
  quantity: number;
  usesLeft?: number; // for items with multiple uses (precision pack)
};

type ActivePowerUp = {
  type: 'precision';
  expiresAt: number; // timestamp
};

type StoreContextType = {
  inventory: InventoryItem[];
  activePowerUps: ActivePowerUp[];
  addToInventory: (itemId: string, quantity: number) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  useItem: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
  storeItems: StoreItem[];
  purchaseItem: (itemId: string) => Promise<boolean>;
  // New functions for power-ups
  activatePrecision: () => boolean;
  hasActivePrecision: () => boolean;
  useTNT: () => boolean;
  useTimerBoost: () => boolean;
  useExtraPlay: () => boolean;
  getTNTCount: () => number;
  getTimerBoostCount: () => number;
  getPrecisionCount: () => number;
  getPrecisionItemCount: () => number; // New: number of packs (not uses)
  getExtraPlaysCount: () => number;
  // Reset active power-ups (when game ends)
  resetActivePowerUps: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// STORE ITEMS (adjusted prices for better economy)
export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'tnt_pack',
    name: 'TNT Pack',
    description: 'Destroys ALL rocks on screen during game',
    price: 0.15,
    image: '/game-assets/tnt01.png',
    type: 'consumable',
    effects: { tnt: 1 }
  },
  {
    id: 'timer_boost',
    name: 'Timer Boost',
    description: '+30 seconds to current time during game',
    price: 0.10,
    image: '/game-assets/timer-boost.png',
    type: 'consumable',
    effects: { timer: 1 }
  },
  {
    id: 'precision_pack',
    name: 'Precision Pack',
    description: 'Click area +50% for 20 seconds (3 uses per pack)',
    price: 0.25,
    image: '/game-assets/precision-pack.png',
    type: 'consumable',
    effects: { precision: 3 }
  },
  {
    id: 'extra_plays',
    name: 'Extra Plays',
    description: '+2 extra games (ignores daily limit)',
    price: 0.25,
    image: '/game-assets/extra-plays.png',
    type: 'consumable',
    effects: { extraPlays: 2 }
  },
  {
    id: 'silver_chest',
    name: 'Silver Chest',
    description: 'Pack: 3 plays + 2 TNT + 2 Timers + 1 Precision Pack',
    price: 0.99,
    image: '/game-assets/silver-chest.png',
    type: 'pack',
    effects: { extraPlays: 3, tnt: 2, timer: 2, precision: 1 }
  },
  {
    id: 'golden_chest',
    name: 'Golden Chest',
    description: 'Pack: 5 plays + 3 TNT + 3 Timers + 2 Precision Packs',
    price: 1.25,
    image: '/game-assets/golden-chest.png',
    type: 'pack',
    effects: { extraPlays: 5, tnt: 3, timer: 3, precision: 2 }
  },
  {
    id: 'diamond_chest',
    name: 'Diamond Chest',
    description: 'Pack: 10 plays + 5 TNT + 5 Timers + 3 Precision Packs',
    price: 1.75,
    image: '/game-assets/diamond-chest.png',
    type: 'pack',
    effects: { extraPlays: 10, tnt: 5, timer: 5, precision: 3 }
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('goldrush_inventory');
    if (savedInventory) {
      try {
        const parsed = JSON.parse(savedInventory);
        
        // MIGRATION: If old items don't have usesLeft, add it
        const migratedInventory = parsed.map((item: InventoryItem) => {
          if (item.itemId === 'precision_pack' && item.usesLeft === undefined) {
            return {
              ...item,
              usesLeft: item.quantity * 3 // Each old pack has 3 uses
            };
          }
          return item;
        });
        
        setInventory(migratedInventory);
      } catch (error) {
        console.error('Error loading inventory:', error);
      }
    }
    
    // Load active power-ups
    const savedPowerUps = localStorage.getItem('goldrush_active_powerups');
    if (savedPowerUps) {
      try {
        const powerUps = JSON.parse(savedPowerUps);
        // Remove expired power-ups
        const now = Date.now();
        const validPowerUps = powerUps.filter((p: ActivePowerUp) => p.expiresAt > now);
        setActivePowerUps(validPowerUps);
      } catch (error) {
        console.error('Error loading active power-ups:', error);
      }
    }
  }, []);

  // Save inventory and power-ups to localStorage
  useEffect(() => {
    localStorage.setItem('goldrush_inventory', JSON.stringify(inventory));
    localStorage.setItem('goldrush_active_powerups', JSON.stringify(activePowerUps));
  }, [inventory, activePowerUps]);

  // Remove expired power-ups periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActivePowerUps(prev => prev.filter(p => p.expiresAt > now));
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const addToInventory = (itemId: string, quantity: number) => {
    console.log(`📦 Adding to inventory: ${itemId} x${quantity}`);
    
    // SPECIAL CASE: Extra Plays gives 2 plays per purchase
    const actualQuantity = itemId === 'extra_plays' ? quantity * 2 : quantity;
    
    setInventory(prev => {
      const existing = prev.find(item => item.itemId === itemId);
      
      if (existing) {
        return prev.map(item => 
          item.itemId === itemId 
            ? { 
                ...item, 
                quantity: item.quantity + actualQuantity,
                // If it's precision pack, add 3 uses per item
                usesLeft: itemId === 'precision_pack' 
                  ? (item.usesLeft || 0) + (quantity * 3)
                  : item.usesLeft
              }
            : item
        );
      } else {
        const newItem: InventoryItem = { 
          itemId, 
          quantity: actualQuantity,
          // Precision pack starts with 3 uses per item
          usesLeft: itemId === 'precision_pack' ? quantity * 3 : undefined
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromInventory = (itemId: string, quantity: number) => {
    setInventory(prev => {
      return prev
        .map(item => {
          if (item.itemId === itemId) {
            const newQuantity = item.quantity - quantity;
            if (newQuantity <= 0) return null;
            return { 
              ...item, 
              quantity: newQuantity,
              // Adjust usesLeft if it's precision pack
              usesLeft: itemId === 'precision_pack' && item.usesLeft 
                ? Math.max(0, item.usesLeft - (quantity * 3))
                : item.usesLeft
            };
          }
          return item;
        })
        .filter(Boolean) as InventoryItem[];
    });
  };

  const useItem = (itemId: string): boolean => {
    const item = inventory.find(i => i.itemId === itemId);
    if (!item || item.quantity <= 0) {
      console.log(`❌ Cannot use ${itemId}: not in inventory`);
      return false;
    }

    console.log(`🔧 Using item: ${itemId}, current quantity: ${item.quantity}, usesLeft: ${item.usesLeft}`);

    // For precision pack, use one "use" instead of a whole item
    if (itemId === 'precision_pack') {
      if (item.usesLeft && item.usesLeft > 0) {
        setInventory(prev =>
          prev.map(i => {
            if (i.itemId === itemId) {
              const newUsesLeft = i.usesLeft! - 1;
              console.log(`🎯 Using precision use. Remaining uses: ${newUsesLeft}`);
              
              // If uses are exhausted, remove one item from quantity
              if (newUsesLeft <= 0 && i.quantity > 0) {
                console.log(`📦 Precision pack exhausted, removing one item. New quantity: ${i.quantity - 1}`);
                return {
                  ...i,
                  quantity: i.quantity - 1,
                  usesLeft: 3 // New item adds 3 uses
                };
              }
              return { ...i, usesLeft: newUsesLeft };
            }
            return i;
          })
        );
        return true;
      } else {
        // Fallback: if no usesLeft but has quantity, use one item
        removeFromInventory(itemId, 1);
        return true;
      }
    }

    // For other items, remove one from quantity
    removeFromInventory(itemId, 1);
    return true;
  };

  const getItemQuantity = (itemId: string): number => {
    const item = inventory.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  };

  // 🎯 SPECIFIC FUNCTIONS FOR POWER-UPS

  const getTNTCount = (): number => {
    return getItemQuantity('tnt_pack');
  };

  const getTimerBoostCount = (): number => {
    return getItemQuantity('timer_boost');
  };

  const getPrecisionCount = (): number => {
    const item = inventory.find(i => i.itemId === 'precision_pack');
    if (!item) return 0;
    
    // Returns total number of USES available
    if (item.usesLeft !== undefined) {
      return item.usesLeft;
    }
    
    // Fallback for old items: 3 uses per item
    return item.quantity * 3;
  };

  const getPrecisionItemCount = (): number => {
    // Returns number of PACKS (not uses)
    return getItemQuantity('precision_pack');
  };

  const getExtraPlaysCount = (): number => {
    return getItemQuantity('extra_plays');
  };

  const useTNT = (): boolean => {
    console.log('💥 Attempting to use TNT');
    return useItem('tnt_pack');
  };

  const useTimerBoost = (): boolean => {
    console.log('⏱️ Attempting to use Timer Boost');
    return useItem('timer_boost');
  };

  const useExtraPlay = (): boolean => {
    console.log('🔄 Attempting to use Extra Play');
    return useItem('extra_plays');
  };

  const activatePrecision = (): boolean => {
    console.log('🎯 Attempting to activate Precision');
    const success = useItem('precision_pack');
    if (success) {
      // Activate precision for 20 seconds
      const newPowerUp: ActivePowerUp = {
        type: 'precision',
        expiresAt: Date.now() + 20000 // 20 seconds
      };
      setActivePowerUps(prev => [...prev, newPowerUp]);
      console.log('✅ Precision activated for 20 seconds');
      return true;
    }
    console.log('❌ Failed to activate Precision');
    return false;
  };

  const hasActivePrecision = (): boolean => {
    const now = Date.now();
    const hasActive = activePowerUps.some(p => p.type === 'precision' && p.expiresAt > now);
    console.log(`🎯 Has active precision? ${hasActive}`);
    return hasActive;
  };

  const resetActivePowerUps = () => {
    console.log('🔄 Resetting active power-ups');
    setActivePowerUps(prev => prev.filter(p => p.type !== 'precision'));
  };

  // ✅ PURCHASE ITEM FUNCTION - COM VERIFICAÇÃO BACKEND (OBRIGATÓRIO!)
  const purchaseItem = async (itemId: string): Promise<boolean> => {
    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) {
      console.error(`❌ Item not found: ${itemId}`);
      return false;
    }

    console.log(`🛒 Purchase attempt: ${item.name} for ${item.price} WLD`);

    try {
      // Dynamically import MiniKit ONLY when needed
      const { MiniKit, Tokens, tokenToDecimals } = await import('@worldcoin/minikit-js');
      
      // Check if we're in World App
      const isInWorldApp = window.self !== window.top || 
                          navigator.userAgent.includes('WorldApp');
      
      if (!isInWorldApp) {
        console.log('🌐 Not in World App - using demo mode');
        return processDemoPurchase(itemId, item);
      }

      // Check if MiniKit is available
      if (typeof MiniKit === 'undefined' || typeof MiniKit.commandsAsync === 'undefined') {
        console.warn('⚠️ MiniKit not available - using demo mode');
        return processDemoPurchase(itemId, item);
      }

      // ✅ 1. GERAR REFERÊNCIA ÚNICA (obrigatório)
      const reference = `goldrush_${itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // ✅ 2. FAZER PAGAMENTO WLD REAL
      console.log('💰 Starting real WLD payment...');
      
      const paymentResult = await MiniKit.commandsAsync.pay({
        reference, // ✅ REFERÊNCIA ÚNICA
        to: '0x7dba00d3544b999834b2fb12b46528cad6459d36',
        tokens: [{
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(item.price, Tokens.WLD).toString()
        }],
        description: `Gold Rush Miner: ${item.name}`
      });

      console.log('💳 Payment result:', paymentResult);

      // ✅ 3. VERIFICAR COM BACKEND (CRÍTICO PARA SEGURANÇA!)
      if (paymentResult.finalPayload?.status === 'success') {
        console.log('✅ Payment initiated, verifying with backend...');
        
        try {
          const verifyResponse = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payload: paymentResult.finalPayload
            })
          });
          
          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.success) {
            console.log('✅ Payment verified! Adding to inventory.');
            processInventoryUpdate(itemId, item);
            return true;
          } else {
            console.error('❌ Payment verification failed:', verifyResult.message);
            return false;
          }
        } catch (error) {
          console.error('❌ Verification error:', error);
          return false;
        }
      } else {
        console.error('❌ Payment failed:', paymentResult.finalPayload?.status);
        return false;
      }

    } catch (error: any) {
      console.error('💥 Purchase error:', error);
      
      // Se não está na WLD ou MiniKit não disponível, usa demo mode
      if (error.message?.includes('MiniKit') || error.message?.includes('verify')) {
        console.log('🔄 MiniKit/Verify error - falling back to demo mode');
        return processDemoPurchase(itemId, item);
      }
      
      return false;
    }
  };

  // Helper: Process demo purchase (for testing/fallback)
  const processDemoPurchase = (itemId: string, item: StoreItem): boolean => {
    console.log(`🎮 Demo purchase: ${item.name}`);
    processInventoryUpdate(itemId, item);
    return true;
  };

  // Helper: Add items to inventory
  const processInventoryUpdate = (itemId: string, item: StoreItem) => {
    if (item.type === 'pack' && item.effects) {
      console.log('📦 Unpacking chest:', item.effects);
      
      if (item.effects.extraPlays) {
        addToInventory('extra_plays', item.effects.extraPlays);
      }
      if (item.effects.tnt) {
        addToInventory('tnt_pack', item.effects.tnt);
      }
      if (item.effects.timer) {
        addToInventory('timer_boost', item.effects.timer);
      }
      if (item.effects.precision) {
        addToInventory('precision_pack', item.effects.precision);
      }
    } else {
      addToInventory(itemId, 1);
    }
  };

  const value: StoreContextType = {
    inventory,
    activePowerUps,
    addToInventory,
    removeFromInventory,
    useItem,
    getItemQuantity,
    storeItems: STORE_ITEMS,
    purchaseItem,
    // New functions
    activatePrecision,
    hasActivePrecision,
    useTNT,
    useTimerBoost,
    useExtraPlay,
    getTNTCount,
    getTimerBoostCount,
    getPrecisionCount,
    getPrecisionItemCount,
    getExtraPlaysCount,
    resetActivePowerUps,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}