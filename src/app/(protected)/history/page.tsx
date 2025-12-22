'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/components/StoreContext';

export default function HistoryPage() {
  const router = useRouter();
  const store = useStore();

  // Calculate inventory counts for display
  const getInventoryCounts = () => {
    return {
      tnt: store.getTNTCount(),
      timer: store.getTimerBoostCount(),
      precision: store.getPrecisionCount(),
      precisionPacks: store.getPrecisionItemCount(),
      extraPlays: store.getExtraPlaysCount(),
    };
  };

  const counts = getInventoryCounts();

  // Simulated data for history
  const recentGames = [
    { date: 'Today 15:30', score: 1420, diamonds: 1, status: 'completed' },
    { date: 'Today 14:15', score: 1850, diamonds: 2, status: 'completed' },
    { date: 'Today 13:00', score: 920, diamonds: 0, status: 'completed' },
    { date: 'Yesterday', score: 1100, diamonds: 1, status: 'completed' },
  ];

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
          <h1 className="text-2xl font-bold">📜 Mining History</h1>
        </div>
      </div>
      
      <main className="px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-yellow-300">
            Your Mining Journey
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Track your progress, scores, and achievements
          </p>

          <div className="space-y-6">
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30 text-center">
                <p className="text-gray-300 text-sm">Total Games</p>
                <p className="text-3xl font-bold text-yellow-300">47</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30 text-center">
                <p className="text-gray-300 text-sm">Best Score</p>
                <p className="text-3xl font-bold text-yellow-300">1,850</p>
              </div>
            </div>

            {/* DAILY REWARDS INFO (NOT CLAIMABLE HERE) */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🎁 Daily Rewards Info</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-600 bg-gray-800/30">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold">Level 1</h4>
                      <p className="text-sm text-gray-300">500 points today</p>
                    </div>
                    <span className="font-bold text-green-400">0.002 WLD</span>
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Claim in the game after verification
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border border-gray-600 bg-gray-800/30">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold">Level 2</h4>
                      <p className="text-sm text-gray-300">5 games with 1500+ points each</p>
                    </div>
                    <span className="font-bold text-yellow-300">0.010 WLD</span>
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Claim in the game after verification
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-600">
                  <p className="text-center text-sm text-gray-400">
                    ⚠️ Rewards are claimed in the main game after World ID verification
                  </p>
                  <button 
                    onClick={() => router.push('/home')}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-sm"
                  >
                    Go to Main Game
                  </button>
                </div>
              </div>
            </div>

            {/* RECENT GAMES */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">Recent Games</h2>
              <div className="space-y-3">
                {recentGames.map((game, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="font-medium">{game.date}</p>
                      <p className="text-sm text-gray-400">{game.diamonds} 💎 collected</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-300">{game.score.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DIAMOND HISTORY */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">💎 Diamond Collection</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-gray-400">Total diamonds found</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-400">Perfect games (2 diamonds)</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">Diamond finding rate: 65%</p>
            </div>

            {/* INVENTORY SUMMARY */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🎒 Current Inventory</h2>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-red-400 text-xl">🧨</div>
                  <p className="text-lg font-bold">{counts.tnt}</p>
                  <p className="text-gray-400 text-xs">TNT</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-blue-400 text-xl">⏱️</div>
                  <p className="text-lg font-bold">{counts.timer}</p>
                  <p className="text-gray-400 text-xs">Timers</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-purple-400 text-xl">🎯</div>
                  <p className="text-lg font-bold">{counts.precision}</p>
                  <p className="text-gray-400 text-xs">Precision</p>
                  <p className="text-gray-500 text-xs">({counts.precisionPacks} packs)</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-green-400 text-xl">🔄</div>
                  <p className="text-lg font-bold">{counts.extraPlays}</p>
                  <p className="text-gray-400 text-xs">Plays</p>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/store')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-bold hover:opacity-90 flex items-center justify-center"
              >
                <span className="mr-2">🛒</span>
                Visit Store to Restock
              </button>
            </div>

            {/* NOTE */}
            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                🚧 Full game history integration coming soon with backend sync
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="pb-24"></div>
    </div>
  );
}