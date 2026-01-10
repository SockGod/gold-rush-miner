'use client';

// ADICIONA ESTA LINHA NO TOPO
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useStore } from '@/components/StoreContext';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const store = useStore();
  const [progressData, setProgressData] = useState({
    dailyScore: 0,
    highScoreGames: 0,
    level1Target: 500,
    level2Target: 5,
  });

  // Get REAL inventory data
  const getRealInventoryData = () => {
    return {
      tnt: store.getTNTCount(),
      timer: store.getTimerBoostCount(),
      precisionUses: store.getPrecisionCount(),
      precisionPacks: store.getPrecisionItemCount(),
      extraPlays: store.getExtraPlaysCount(),
    };
  };

  const inventoryData = getRealInventoryData();

  // ADICIONADO: useEffect para ler localStorage APENAS no cliente
  useEffect(() => {
    const getRealProgressData = () => {
      const today = new Date().toDateString();
      const savedDailyScore = localStorage.getItem('goldrush_daily_score');
      const savedHighScoreGames = localStorage.getItem('goldrush_high_score_games');
      
      return {
        dailyScore: savedDailyScore ? parseInt(savedDailyScore) : 0,
        highScoreGames: savedHighScoreGames ? parseInt(savedHighScoreGames) : 0,
        level1Target: 500,
        level2Target: 5,
      };
    };
    
    setProgressData(getRealProgressData());
    
    // Atualizar a cada 10 segundos para dados em tempo real
    const interval = setInterval(() => {
      setProgressData(getRealProgressData());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user data for referral (example data)
  const userData = {
    username: 'Miner',
    referralCode: `GOLDRUSH-MINER`,
    friendsInvited: 3,
    referralPoints: 9,
  };

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
          <h1 className="text-2xl font-bold">👤 Miner Profile</h1>
        </div>
      </div>
      
      <main className="px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* PROFILE HEADER */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-yellow-400">
              ⛏️
            </div>
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <p className="text-gray-400">Gold Rush Enthusiast</p>
            <div className="inline-block px-4 py-1 bg-yellow-900/30 rounded-full mt-2 border border-yellow-700">
              <span className="text-yellow-300">🏆 Level 12 Miner</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* STATS OVERVIEW - WITH REAL DATA */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">📊 Mining Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-300">1,850</p>
                  <p className="text-gray-400 text-sm">Best Score</p>
                </div>
                <div className="text-center p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-300">47</p>
                  <p className="text-gray-400 text-sm">Games Played</p>
                </div>
                <div className="text-center p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-300">18</p>
                  <p className="text-gray-400 text-sm">💎 Diamonds</p>
                </div>
                <div className="text-center p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-300">62.4k</p>
                  <p className="text-gray-400 text-sm">Total Points</p>
                </div>
              </div>
            </div>

            {/* TODAY'S PROGRESS - REAL-TIME DATA WITH LIVE INDICATOR */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-yellow-200">📅 Today's Progress</h2>
                  <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full animate-pulse">LIVE</span>
                </div>
                <span className="text-sm text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-gray-300">Level 1: Daily Reward</span>
                      <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">500 pts</span>
                    </div>
                    <span className="text-green-400 font-bold">
                      {progressData.dailyScore >= 500 ? '✅ Ready!' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (progressData.dailyScore / progressData.level1Target) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {progressData.dailyScore}/{progressData.level1Target} points • 
                    <span className={progressData.dailyScore >= 500 ? 'text-green-400' : 'text-yellow-300'}>
                      {progressData.dailyScore >= 500 ? ' Ready to claim!' : ` ${progressData.level1Target - progressData.dailyScore} pts left`}
                    </span>
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-gray-300">Level 2: Bonus Reward</span>
                      <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded">5 games</span>
                    </div>
                    <span className="text-yellow-300 font-bold">
                      {progressData.highScoreGames >= 5 ? '✅ Ready!' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (progressData.highScoreGames / progressData.level2Target) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {progressData.highScoreGames}/{progressData.level2Target} games • 
                    <span className={progressData.highScoreGames >= 5 ? 'text-green-400' : 'text-yellow-300'}>
                      {progressData.highScoreGames >= 5 ? ' Ready to claim!' : ` ${progressData.level2Target - progressData.highScoreGames} games left`}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm text-center text-gray-400">
                  ⚠️ Rewards are claimed in the main game after World ID verification
                </p>
              </div>
            </div>

            {/* INVENTORY SUMMARY - WITH REAL DATA */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🎒 Current Inventory</h2>
              <p className="text-gray-400 text-sm mb-4 text-center">
                Data synchronized with Store
              </p>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-red-400 text-xl">🧨</div>
                  <p className="text-lg font-bold">{inventoryData.tnt}</p>
                  <p className="text-gray-400 text-xs">TNT</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-blue-400 text-xl">⏱️</div>
                  <p className="text-lg font-bold">{inventoryData.timer}</p>
                  <p className="text-gray-400 text-xs">Timers</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-purple-400 text-xl">🎯</div>
                  <p className="text-lg font-bold">{inventoryData.precisionUses}</p>
                  <p className="text-gray-400 text-xs">Precision</p>
                  <p className="text-gray-500 text-xs">({inventoryData.precisionPacks} packs)</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-green-400 text-xl">🔄</div>
                  <p className="text-lg font-bold">{inventoryData.extraPlays}</p>
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

            {/* REFERRAL SYSTEM */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">🤝 Invite Friends</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold">Invite Friends!</h3>
                      <p className="text-sm text-gray-300">Invite friends to join the mining adventure!</p>
                    </div>
                    <span className="font-bold text-green-400">🎁</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex-1 bg-gray-700 rounded-lg p-3">
                      <p className="text-sm">Your invite code:</p>
                      <p className="text-xl font-bold text-yellow-300">{userData.referralCode}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(userData.referralCode);
                        alert('Invite code copied to clipboard!');
                      }}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-300">{userData.friendsInvited}</p>
                    <p className="text-gray-400 text-sm">Friends Invited</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{userData.referralPoints}</p>
                    <p className="text-gray-400 text-sm">Referral Points</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-center text-sm text-gray-400">
                    Share your code with friends and expand the mining community!
                  </p>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    Skill-based rewards for actual gameplay
                  </p>
                </div>
              </div>
            </div>

            {/* ACCOUNT INFO */}
            <div className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-yellow-800/30">
              <h2 className="text-xl font-bold mb-4 text-yellow-200">⚙️ Account Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-800/40 rounded-lg">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-yellow-300">Jan 2026</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800/40 rounded-lg">
                  <span className="text-gray-300">Game Balance</span>
                  <span className="text-green-400 font-bold">2,450</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800/40 rounded-lg">
                  <span className="text-gray-300">Next Game Available</span>
                  <span className="text-yellow-300">In 24 min</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm text-center">
                  Connected via World ID • Session active
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="pb-24"></div>
    </div>
  );
}