'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, STORE_ITEMS } from './StoreContext';

export function StorePage() {
  const router = useRouter();
  const { inventory, purchaseItem, getItemQuantity, getPrecisionCount, getPrecisionItemCount } = useStore();
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const handlePurchase = async (itemId: string) => {
    if (isPurchasing) return;
    
    setIsPurchasing(itemId);
    setPurchaseMessage('Processing purchase...');
    
    try {
      const success = await purchaseItem(itemId);
      
      if (success) {
        setPurchaseMessage(`🎉 Purchase successful! Check your inventory.`);
        
        setTimeout(() => {
          setPurchaseMessage('');
        }, 3000);
      } else {
        setPurchaseMessage('❌ Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseMessage('❌ Error processing purchase.');
    } finally {
      setIsPurchasing(null);
    }
  };

  const formatWLD = (amount: number) => {
    return amount.toFixed(3) + ' WLD';
  };

  // Separate items into categories
  const chestItems = STORE_ITEMS.filter(item => item.type === 'pack');
  const individualItems = STORE_ITEMS.filter(item => item.type === 'consumable');

  // Function to get correct display quantity
  const getDisplayQuantity = (itemId: string) => {
    switch (itemId) {
      case 'precision_pack':
        return {
          quantity: getPrecisionItemCount(), // Number of packs
          uses: getPrecisionCount(), // Number of uses
          isPrecision: true
        };
      case 'tnt_pack':
        return {
          quantity: getItemQuantity('tnt_pack'),
          uses: null,
          isPrecision: false
        };
      case 'timer_boost':
        return {
          quantity: getItemQuantity('timer_boost'),
          uses: null,
          isPrecision: false
        };
      case 'extra_plays':
        return {
          quantity: getItemQuantity('extra_plays'),
          uses: null,
          isPrecision: false
        };
      default:
        return {
          quantity: 0,
          uses: null,
          isPrecision: false
        };
    }
  };

  // Touch feedback state
  const [touchedButton, setTouchedButton] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header with back button */}
      <div className="w-full max-w-2xl mb-8">
        {/* Back button aligned with others */}
        <div className="flex items-center mb-4">
          <button 
            onClick={() => router.push('/home')}
            className="text-white text-xl p-2 hover:bg-gray-800 rounded-lg mr-4"
          >
            ↩️
          </button>
          <h1 className="text-2xl font-bold">🛒 GOLD RUSH Store</h1>
        </div>

        {/* Banner */}
        <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6">
          <img 
            src="/game-assets/store-banner.png"
            alt="GOLD RUSH Store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl font-bold">Boost Your Mining!</h1>
            <p className="text-gray-300">Get power-ups for higher scores</p>
          </div>
        </div>

        {/* Purchase message */}
        {purchaseMessage && (
          <div className={`p-4 rounded-xl mb-6 ${purchaseMessage.includes('🎉') ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <p className="text-center">{purchaseMessage}</p>
          </div>
        )}

        {/* Inventory Summary */}
        <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4 text-yellow-300">📦 Your Inventory</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['tnt_pack', 'timer_boost', 'precision_pack', 'extra_plays'].map(itemId => {
              const item = STORE_ITEMS.find(i => i.id === itemId);
              const display = getDisplayQuantity(itemId);
              if (!item) return null;
              
              return (
                <div key={itemId} className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-10 h-10 relative mr-3">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    {display.isPrecision ? (
                      <>
                        <p className="text-2xl font-bold text-yellow-300">{display.uses}</p>
                        <p className="text-xs text-gray-400">uses ({display.quantity} packs)</p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-yellow-300">{display.quantity}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Inventory Details */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Precision Pack: Each pack gives 3 uses of 20 seconds each
            </p>
          </div>
        </div>
      </div>

      {/* CHESTS SECTION */}
      <div className="w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-300">
          💎 Treasure Chests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chestItems.map((item) => (
            <div 
              key={item.id}
              className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-yellow-700/50 hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Best Value Badge */}
              {item.id === 'golden_chest' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ BEST VALUE
                </div>
              )}
              
              <div className="flex flex-col items-center">
                {/* Item Image */}
                <div className="w-24 h-24 mb-4 relative">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Item Info */}
                <h3 className="text-xl font-bold mb-2 text-center">{item.name}</h3>
                <p className="text-gray-300 text-center text-sm mb-4 min-h-[60px]">
                  {item.description}
                </p>
                
                {/* Price */}
                <div className="text-2xl font-bold text-green-400 mb-6">
                  {formatWLD(item.price)}
                </div>
                
                {/* Contents */}
                <div className="w-full mb-6">
                  <p className="text-sm text-gray-400 mb-2">Contains:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.effects?.extraPlays && (
                      <span className="px-3 py-1 bg-blue-900/50 rounded-lg text-sm">
                        {item.effects.extraPlays} Extra Plays
                      </span>
                    )}
                    {item.effects?.tnt && (
                      <span className="px-3 py-1 bg-red-900/50 rounded-lg text-sm">
                        {item.effects.tnt} TNT Packs
                      </span>
                    )}
                    {item.effects?.timer && (
                      <span className="px-3 py-1 bg-purple-900/50 rounded-lg text-sm">
                        {item.effects.timer} Timer Boosts
                      </span>
                    )}
                    {item.effects?.precision && (
                      <span className="px-3 py-1 bg-cyan-900/50 rounded-lg text-sm">
                        {item.effects.precision} Precision Packs
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(item.id)}
                  onTouchStart={() => setTouchedButton(item.id)}
                  onTouchEnd={() => setTouchedButton(null)}
                  onMouseDown={() => setTouchedButton(item.id)}
                  onMouseUp={() => setTouchedButton(null)}
                  onMouseLeave={() => setTouchedButton(null)}
                  disabled={isPurchasing === item.id}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-150 ${
                    isPurchasing === item.id
                      ? 'bg-gray-700 cursor-not-allowed'
                      : touchedButton === item.id
                      ? 'bg-gradient-to-r from-yellow-800 to-orange-800 scale-[0.96] shadow-inner'
                      : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                  }`}
                >
                  {isPurchasing === item.id ? '🔄 Processing...' : '✨ BUY NOW'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INDIVIDUAL ITEMS SECTION */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-300">
          ⚡ Individual Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {individualItems.map((item) => {
            const display = getDisplayQuantity(item.id);
            
            return (
              <div 
                key={item.id}
                className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex flex-col items-center h-full">
                  {/* Item Image */}
                  <div className="w-16 h-16 mb-3">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Item Info */}
                  <h3 className="font-bold mb-1 text-center">{item.name}</h3>
                  <p className="text-gray-300 text-center text-xs mb-4 flex-grow">
                    {item.description}
                  </p>
                  
                  {/* Price & Quantity */}
                  <div className="flex flex-col items-center justify-between w-full mt-auto space-y-2">
                    <div className="text-lg font-bold text-green-400">
                      {formatWLD(item.price)}
                    </div>
                    <div className="text-sm text-center">
                      {display.isPrecision ? (
                        <>
                          <div className="text-gray-400">
                            You have: <span className="font-bold text-yellow-300">{display.uses} uses</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ({display.quantity} packs)
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400">
                          You have: <span className="font-bold text-yellow-300">{display.quantity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(item.id)}
                    onTouchStart={() => setTouchedButton(item.id)}
                    onTouchEnd={() => setTouchedButton(null)}
                    onMouseDown={() => setTouchedButton(item.id)}
                    onMouseUp={() => setTouchedButton(null)}
                    onMouseLeave={() => setTouchedButton(null)}
                    disabled={isPurchasing === item.id}
                    className={`w-full py-2 rounded-lg font-medium mt-3 transition-all duration-150 ${
                      isPurchasing === item.id
                        ? 'bg-gray-700 cursor-not-allowed'
                        : touchedButton === item.id
                        ? 'bg-gradient-to-r from-blue-800 to-cyan-800 scale-[0.96] shadow-inner'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    }`}
                  >
                    {isPurchasing === item.id ? '...' : 'Buy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store Info */}
      <div className="w-full max-w-2xl mt-10 p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-center">ℹ️ How it Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3">
            <div className="text-2xl mb-2">🛒</div>
            <p className="font-medium">1. Purchase Items</p>
            <p className="text-gray-400">Buy chests or individual items</p>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl mb-2">📦</div>
            <p className="font-medium">2. Check Inventory</p>
            <p className="text-gray-400">Items appear in your inventory</p>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl mb-2">🎮</div>
            <p className="font-medium">3. Use in Game</p>
            <p className="text-gray-400">Activate during gameplay</p>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Real WLD payments require World App integration.
        </p>
      </div>

      {/* Bottom padding */}
      <div className="pb-10"></div>
    </div>
  );
}