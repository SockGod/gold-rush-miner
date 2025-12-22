'use client';

import { useRouter } from 'next/navigation';

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Custom TopBar with consistent back button */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/home')}
            className="text-white text-xl p-2 hover:bg-gray-800 rounded-lg mr-4"
          >
            ↩️
          </button>
          <h1 className="text-2xl font-bold">📖 Game Guide</h1>
        </div>
      </div>
      
      <main className="px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-yellow-300">
            ⛏️ GOLD RUSH Guide
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Master the mine and maximize your rewards!
          </p>

          <div className="space-y-6">
            {/* BASIC RULES */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🎯 Basic Rules</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="font-bold">+10</span>
                  </div>
                  <div>
                    <p className="font-medium">Gold Coins</p>
                    <p className="text-gray-400 text-sm">Click to collect. Your main source of points.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="font-bold">+50</span>
                  </div>
                  <div>
                    <p className="font-medium">💎 Diamonds (Rare!)</p>
                    <p className="text-gray-400 text-sm">Only 2 appear per game. Big bonus points!</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="font-bold">-5</span>
                  </div>
                  <div>
                    <p className="font-medium">Rocks</p>
                    <p className="text-gray-400 text-sm">Avoid clicking. They reduce your score.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* STRATEGY TIPS */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🏆 Pro Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-yellow-400 mr-3">1.</div>
                  <p className="text-gray-300">Prioritize diamonds! They're rare but worth 5x gold coins.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-yellow-400 mr-3">2.</div>
                  <p className="text-gray-300">Watch for rock patterns - they often come in groups.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-yellow-400 mr-3">3.</div>
                  <p className="text-gray-300">Use TNT from the Store to clear rocks automatically.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-yellow-400 mr-3">4.</div>
                  <p className="text-gray-300">Timer Boosts give you +30 seconds for higher scores.</p>
                </div>
              </div>
            </div>

            {/* DAILY REWARDS INFO */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🎁 Daily Rewards System</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 rounded-lg border border-green-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Level 1 Reward</h3>
                    <span className="font-bold text-green-400">0.002 WLD</span>
                  </div>
                  <p className="text-gray-300 text-sm">Reach 500 points in one day</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Level 2 Reward</h3>
                    <span className="font-bold text-yellow-300">0.010 WLD</span>
                  </div>
                  <p className="text-gray-300 text-sm">Complete 5 games with 1500+ points each</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* STORE ITEMS */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🛒 Store Power-Ups</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-red-400 text-lg">🧨</div>
                  <p className="font-medium text-sm">TNT Pack</p>
                  <p className="text-gray-400 text-xs">Clears all rocks instantly</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-blue-400 text-lg">⏱️</div>
                  <p className="font-medium text-sm">Timer Boost</p>
                  <p className="text-gray-400 text-xs">Adds +30 seconds to timer</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-purple-400 text-lg">🎯</div>
                  <p className="font-medium text-sm">Precision Pack</p>
                  <p className="text-gray-400 text-xs">+50% click area for 20s (3 uses)</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-green-400 text-lg">🔄</div>
                  <p className="font-medium text-sm">Extra Plays</p>
                  <p className="text-gray-400 text-xs">Additional games beyond daily limit</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/store')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-bold hover:opacity-90"
              >
                Visit Store
              </button>
            </div>
          </div>
        </div>
      </main>
      <div className="pb-24"></div>
    </div>
  );
}