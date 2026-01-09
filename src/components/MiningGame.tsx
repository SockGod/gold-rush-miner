'use client';

import { useEffect, useRef, useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useStore } from '@/components/StoreContext';

type GameImages = {
  background: HTMLImageElement | null;
  goldCoin: HTMLImageElement | null;
  rock: HTMLImageElement | null;
  diamond: HTMLImageElement | null;
  explosion: HTMLImageElement[];
};

type ExplosionAnimation = {
  x: number;
  y: number;
  currentFrame: number;
  maxFrames: number;
};

export function MiningGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<GameImages>({
    background: null,
    goldCoin: null,
    rock: null,
    diamond: null,
    explosion: []
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [explosions, setExplosions] = useState<ExplosionAnimation[]>([]);
  
  // Store Context for power-ups
  const store = useStore();
  
  // Refs for diamonds control
  const diamondsSpawnedRef = useRef(0);
  const lastDiamondTimeRef = useRef(0);
  
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [items, setItems] = useState<Array<{
    id: number;
    x: number;
    y: number;
    type: 'gold' | 'rock' | 'diamond';
    speed: number;
    width: number;
    height: number;
  }>>([]);
  
  // Daily Claim System
  const [dailyScore, setDailyScore] = useState(0);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [gamesWithHighScore, setGamesWithHighScore] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [canClaimLevel1, setCanClaimLevel1] = useState(false);
  const [canClaimLevel2, setCanClaimLevel2] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimedLevel1, setClaimedLevel1] = useState(false);
  const [claimedLevel2, setClaimedLevel2] = useState(false);
  
  // Power-ups states
  const [showPowerUpButtons, setShowPowerUpButtons] = useState(false);
  const [tntCount, setTntCount] = useState(0);
  const [timerBoostCount, setTimerBoostCount] = useState(0);
  const [precisionActive, setPrecisionActive] = useState(false);
  const [precisionTimeLeft, setPrecisionTimeLeft] = useState(0);
  const [extraPlaysCount, setExtraPlaysCount] = useState(0);
  const [usingTNT, setUsingTNT] = useState(false);
  const [usingTimerBoost, setUsingTimerBoost] = useState(false);
  
  // Audio state (only sound effects, no music)
  const [isMuted, setIsMuted] = useState(false);

  // Login streak state
  const [loginStreak, setLoginStreak] = useState(3); // Example: 3-day streak
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);

  // Game cooldown timer
  const [nextGameTime, setNextGameTime] = useState<number | null>(null);
  const [cooldownTimer, setCooldownTimer] = useState<string>('00:00');

  // Fixed item dimensions
  const ITEM_SIZES = {
    gold: { width: 40, height: 40 },
    rock: { width: 40, height: 40 },
    diamond: { width: 50, height: 50 }
  };

  // Calculate streak bonus
  const streakBonus = Math.min(loginStreak, 5) * 10; // +10% per day, max +50%
  const scoreMultiplier = 1 + (streakBonus / 100);

  // 🔈 SIMPLE AUDIO SYSTEM (NO BACKGROUND MUSIC)
  const playSound = (type: 'coin' | 'diamond' | 'rock' | 'tnt' | 'timer') => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(`/game-sounds/${type}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Load ALL images
  useEffect(() => {
    const loadImages = () => {
      const totalImages = 6;
      let loadedCount = 0;
      
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      
      // Background
      const bgImg = new Image();
      bgImg.onload = checkAllLoaded;
      bgImg.onerror = () => {
        console.error('Error loading background');
        checkAllLoaded();
      };
      bgImg.src = '/game-assets/mine-background.png';
      imagesRef.current.background = bgImg;
      
      // Gold coin
      const coinImg = new Image();
      coinImg.onload = checkAllLoaded;
      coinImg.onerror = () => {
        console.error('Error loading coin');
        checkAllLoaded();
      };
      coinImg.src = '/game-assets/moeda01.png';
      imagesRef.current.goldCoin = coinImg;
      
      // Rock
      const rockImg = new Image();
      rockImg.onload = checkAllLoaded;
      rockImg.onerror = () => {
        console.error('Error loading rock');
        checkAllLoaded();
      };
      rockImg.src = '/game-assets/rocha01.png';
      imagesRef.current.rock = rockImg;
      
      // Diamond
      const diamondImg = new Image();
      diamondImg.onload = checkAllLoaded;
      diamondImg.onerror = () => {
        console.error('Error loading diamond, using fallback');
        diamondImg.src = '/game-assets/moeda02.png';
        checkAllLoaded();
      };
      diamondImg.src = '/game-assets/diamond.png';
      imagesRef.current.diamond = diamondImg;
      
      // Explosions
      const explosionFrames = ['explosao01', 'explosao02', 'explosao03'];
      imagesRef.current.explosion = [];
      
      explosionFrames.forEach((frameName, index) => {
        const frameImg = new Image();
        frameImg.onload = checkAllLoaded;
        frameImg.onerror = () => {
          console.error(`Error loading frame ${frameName}`);
          checkAllLoaded();
        };
        frameImg.src = `/game-assets/${frameName}.png`;
        imagesRef.current.explosion[index] = frameImg;
      });
    };
    
    loadImages();
    
    return () => {
      imagesRef.current.background = null;
      imagesRef.current.goldCoin = null;
      imagesRef.current.rock = null;
      imagesRef.current.diamond = null;
      imagesRef.current.explosion = [];
    };
  }, []);

  // Initialize Daily Claim system and check login streak
  useEffect(() => {
    if (!isVerified) return;
    
    const today = new Date().toDateString();
    
    // Load from localStorage
    const savedLastClaim = localStorage.getItem('goldrush_last_claim');
    const savedDailyScore = localStorage.getItem('goldrush_daily_score');
    const savedGamesPlayed = localStorage.getItem('goldrush_games_played');
    const savedHighScoreGames = localStorage.getItem('goldrush_high_score_games');
    const savedClaimedLevel1 = localStorage.getItem('goldrush_claimed_level1');
    const savedClaimedLevel2 = localStorage.getItem('goldrush_claimed_level2');
    const savedLastLogin = localStorage.getItem('goldrush_last_login');
    const savedLoginStreak = localStorage.getItem('goldrush_login_streak');
    const savedNextGameTime = localStorage.getItem('goldrush_next_game_time');
    
    // Check login streak
    if (savedLastLogin === today) {
      // Already logged in today
      if (savedLoginStreak) setLoginStreak(parseInt(savedLoginStreak));
    } else {
      // New day - check if streak continues
      if (savedLastLogin) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (savedLastLogin === yesterday.toDateString()) {
          // Streak continues
          const newStreak = savedLoginStreak ? parseInt(savedLoginStreak) + 1 : 1;
          setLoginStreak(newStreak);
          localStorage.setItem('goldrush_login_streak', newStreak.toString());
        } else {
          // Streak broken
          setLoginStreak(1);
          localStorage.setItem('goldrush_login_streak', '1');
        }
      } else {
        // First login
        setLoginStreak(1);
        localStorage.setItem('goldrush_login_streak', '1');
      }
      localStorage.setItem('goldrush_last_login', today);
      setLastLoginDate(today);
    }
    
    // Check if new day for daily rewards
    if (savedLastClaim !== today) {
      // NEW DAY: Reset everything
      localStorage.setItem('goldrush_daily_score', '0');
      localStorage.setItem('goldrush_games_played', '0');
      localStorage.setItem('goldrush_high_score_games', '0');
      localStorage.removeItem('goldrush_claimed_level1');
      localStorage.removeItem('goldrush_claimed_level2');
      
      setDailyScore(0);
      setGamesPlayedToday(0);
      setGamesWithHighScore(0);
      setClaimedLevel1(false);
      setClaimedLevel2(false);
    } else {
      // SAME DAY: Load values
      if (savedDailyScore) setDailyScore(parseInt(savedDailyScore));
      if (savedGamesPlayed) setGamesPlayedToday(parseInt(savedGamesPlayed));
      if (savedHighScoreGames) setGamesWithHighScore(parseInt(savedHighScoreGames));
      if (savedClaimedLevel1) setClaimedLevel1(savedClaimedLevel1 === 'true');
      if (savedClaimedLevel2) setClaimedLevel2(savedClaimedLevel2 === 'true');
    }
    
    // Load next game time
    if (savedNextGameTime) {
      const nextTime = parseInt(savedNextGameTime);
      const now = Date.now();
      if (nextTime > now) {
        setNextGameTime(nextTime);
      } else {
        setNextGameTime(null);
      }
    }
    
    if (savedLastClaim) setLastClaimDate(savedLastClaim);
    if (savedLastLogin) setLastLoginDate(savedLastLogin);
    
    checkClaimConditions();
  }, [isVerified]);

  // Update power-ups counts from Store
  useEffect(() => {
    if (!isVerified) return;
    
    setTntCount(store.getTNTCount());
    setTimerBoostCount(store.getTimerBoostCount());
    setExtraPlaysCount(store.getExtraPlaysCount());
    
    // Check if precision is active
    const isPrecisionActive = store.hasActivePrecision();
    setPrecisionActive(isPrecisionActive);
    
    if (isPrecisionActive) {
      setPrecisionTimeLeft(20);
    }
  }, [isVerified, store]);

  // Timer for precision power-up
  useEffect(() => {
    if (!precisionActive) return;
    
    const interval = setInterval(() => {
      setPrecisionTimeLeft(prev => {
        if (prev <= 1) {
          setPrecisionActive(false);
          store.resetActivePowerUps();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [precisionActive, store]);

  // Cooldown timer for next free game
  useEffect(() => {
    if (!nextGameTime || extraPlaysCount > 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = nextGameTime - now;
      
      if (timeRemaining <= 0) {
        setNextGameTime(null);
        localStorage.removeItem('goldrush_next_game_time');
        setCooldownTimer('00:00');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        setCooldownTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [nextGameTime, extraPlaysCount]);

  // Check claim conditions for 2 levels
  const checkClaimConditions = () => {
    if (!isVerified) {
      setCanClaimLevel1(false);
      setCanClaimLevel2(false);
      return;
    }
    
    const today = new Date().toDateString();
    const hasClaimedToday = lastClaimDate === today;
    
    // LEVEL 1: 500 points
    const canClaimL1 = !claimedLevel1 && dailyScore >= 500;
    setCanClaimLevel1(canClaimL1);
    
    // LEVEL 2: 5 games with 1500+ points each
    const canClaimL2 = !claimedLevel2 && gamesWithHighScore >= 5;
    setCanClaimLevel2(canClaimL2);
    
    // Messages
    if (hasClaimedToday && (claimedLevel1 && claimedLevel2)) {
      setClaimMessage('🎉 You already claimed everything today! Come back tomorrow.');
    } else if (canClaimL1 || canClaimL2) {
      setClaimMessage('You have rewards available!');
    } else {
      setClaimMessage(
        `Progress: ${dailyScore}/500 points • ${gamesWithHighScore}/5 games of 1500+`
      );
    }
  };

  // Process Daily Claim
  const handleDailyClaim = async (level: 1 | 2) => {
    if ((level === 1 && !canClaimLevel1) || (level === 2 && !canClaimLevel2)) return;
    if (isClaiming) return;
    
    setIsClaiming(true);
    setClaimMessage('Verifying World ID...');
    
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: 'play-gold-rush',
        signal: username,
      });
      
      if (finalPayload.status === 'success') {
        const today = new Date().toDateString();
        localStorage.setItem('goldrush_last_claim', today);
        setLastClaimDate(today);
        
        if (level === 1) {
          localStorage.setItem('goldrush_claimed_level1', 'true');
          setClaimedLevel1(true);
          setCanClaimLevel1(false);
          setClaimMessage('🎉 Daily Reward Unlocked! (Level 1)'); // ✅ CORRIGIDO
        } else {
          localStorage.setItem('goldrush_claimed_level2', 'true');
          setClaimedLevel2(true);
          setCanClaimLevel2(false);
          setClaimMessage('🎉 Bonus Reward Unlocked! (Level 2)'); // ✅ CORRIGIDO
        }
        
        setTimeout(() => {
          checkClaimConditions();
        }, 3000);
      }
    } catch (error) {
      console.error('Daily Claim error:', error);
      setClaimMessage('Error processing. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  // Update statistics when game ends (with streak bonus)
  useEffect(() => {
    if (!isPlaying && timeLeft === 0 && score > 0) {
      const today = new Date().toDateString();
      
      // Apply streak bonus to score
      const finalScore = Math.floor(score * scoreMultiplier);
      
      const newDailyScore = dailyScore + finalScore;
      setDailyScore(newDailyScore);
      localStorage.setItem('goldrush_daily_score', newDailyScore.toString());
      
      const newGamesPlayed = gamesPlayedToday + 1;
      setGamesPlayedToday(newGamesPlayed);
      localStorage.setItem('goldrush_games_played', newGamesPlayed.toString());
      
      if (finalScore >= 1500) {
        const newHighScoreGames = gamesWithHighScore + 1;
        setGamesWithHighScore(newHighScoreGames);
        localStorage.setItem('goldrush_high_score_games', newHighScoreGames.toString());
      }
      
      // Set cooldown for next free game (1 hour)
      if (extraPlaysCount <= 0) {
        const nextGame = Date.now() + 60 * 60 * 1000; // 1 hour
        setNextGameTime(nextGame);
        localStorage.setItem('goldrush_next_game_time', nextGame.toString());
      }
      
      checkClaimConditions();
      
      // Reset active power-ups
      setUsingTNT(false);
      setUsingTimerBoost(false);
    }
  }, [isPlaying, timeLeft, score]);

  // ANIMATION LOOP
  useEffect(() => {
    if (explosions.length === 0 || !isPlaying) return;
    
    const animationInterval = setInterval(() => {
      setExplosions(prev => {
        const updated = prev.map(exp => ({
          ...exp,
          currentFrame: exp.currentFrame + 1
        }));
        
        return updated.filter(exp => exp.currentFrame < exp.maxFrames);
      });
    }, 100);
    
    return () => clearInterval(animationInterval);
  }, [explosions.length, isPlaying]);

  // Verify World ID - ✅ CORRIGIDO (removida verificação MiniKit.isInstalled)
  const handleVerify = async () => {
    // ✅ REMOVIDO O CHECK DO MiniKit.isInstalled() que causa erro na World App
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: 'play-gold-rush',
        signal: '',
      });

      if (finalPayload.status === 'success') {
        setIsVerified(true);
        
        const walletAuth = await MiniKit.commandsAsync.walletAuth({
          nonce: Date.now().toString(),
          expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notBefore: new Date(Date.now()),
        });

        if (walletAuth.finalPayload) {
          const user = walletAuth.finalPayload as any;
          setUsername(user?.username || 'Player');
        }
      }
    } catch (error) {
      console.error('Verify error:', error);
    }
  };

  // 🔥 POWER-UP FUNCTIONS 🔥

  // Use TNT
  const handleUseTNT = () => {
    if (!isPlaying || tntCount <= 0 || usingTNT) return;
    
    const success = store.useTNT();
    if (success) {
      setUsingTNT(true);
      setTntCount(prev => prev - 1);
      
      // Remove ALL rocks
      setItems(prev => prev.filter(item => item.type !== 'rock'));
      
      // Visual explosion effect
      const newExplosions: ExplosionAnimation[] = [];
      for (let i = 0; i < 5; i++) {
        newExplosions.push({
          x: Math.random() * 300 + 50,
          y: Math.random() * 400 + 50,
          currentFrame: 0,
          maxFrames: 3
        });
      }
      setExplosions(prev => [...prev, ...newExplosions]);
      
      // Play sound
      playSound('tnt');
      
      // Reset after 1.5 seconds
      setTimeout(() => setUsingTNT(false), 1500);
    }
  };

  // Use Timer Boost
  const handleUseTimerBoost = () => {
    if (!isPlaying || timerBoostCount <= 0 || usingTimerBoost) return;
    
    const success = store.useTimerBoost();
    if (success) {
      setUsingTimerBoost(true);
      setTimerBoostCount(prev => prev - 1);
      
      // Add 30 seconds
      setTimeLeft(prev => prev + 30);
      
      // Visual effect
      setExplosions(prev => [
        ...prev,
        {
          x: 187.5, // canvas center
          y: 250,
          currentFrame: 0,
          maxFrames: 3
        }
      ]);
      
      // Play sound
      playSound('timer');
      
      // Reset after 1 second
      setTimeout(() => setUsingTimerBoost(false), 1000);
    }
  };

  // Activate Precision Pack
  const handleActivatePrecision = () => {
    if (!isPlaying || store.getPrecisionCount() <= 0 || precisionActive) return;
    
    const success = store.activatePrecision();
    if (success) {
      setPrecisionActive(true);
      setPrecisionTimeLeft(20);
    }
  };

  // Start game with power-ups
  const startGame = () => {
    // Check if can play (has extra plays OR no cooldown)
    if (extraPlaysCount <= 0 && nextGameTime && nextGameTime > Date.now()) {
      alert(`Please wait ${cooldownTimer} for next free game or use Extra Plays!`);
      return;
    }
    
    diamondsSpawnedRef.current = 0;
    lastDiamondTimeRef.current = 0;
    
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setItems([]);
    setExplosions([]);
    setShowPowerUpButtons(true);
    
    // Use one extra play if available
    if (extraPlaysCount > 0) {
      store.useExtraPlay();
      setExtraPlaysCount(prev => prev - 1);
    }
    
    // Activate Precision automatically if available
    if (store.getPrecisionCount() > 0) {
      setTimeout(() => {
        handleActivatePrecision();
      }, 500);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setShowPowerUpButtons(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // SPAWN ITEMS
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const currentTime = Date.now();
      const random = Math.random();
      let type: 'gold' | 'rock' | 'diamond' = 'gold';
      
      const maxDiamondsPerGame = 2;
      const minDiamondInterval = 20000;
      const diamondChance = 0.025;
      
      const canSpawnDiamond = 
        diamondsSpawnedRef.current < maxDiamondsPerGame && 
        (currentTime - lastDiamondTimeRef.current) > minDiamondInterval &&
        random < diamondChance;
      
      if (canSpawnDiamond) {
        type = 'diamond';
        diamondsSpawnedRef.current++;
        lastDiamondTimeRef.current = currentTime;
      } else if (random < 0.7) {
        type = 'gold';
      } else {
        type = 'rock';
      }
      
      const size = ITEM_SIZES[type];
      const newItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * (375 - size.width),
        y: -size.height,
        type: type,
        speed: type === 'diamond' ? 1.5 : 2 + Math.random() * 2,
        width: size.width,
        height: size.height
      };
      setItems((prev) => [...prev, newItem]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  // Move items
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setItems((prev) => {
        const updated = prev.map((item) => ({
          ...item,
          y: item.y + item.speed,
        }));
        return updated.filter((item) => item.y < 500);
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isPlaying]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (imagesRef.current.background && imagesLoaded) {
      ctx.drawImage(imagesRef.current.background, 0, 0, canvas.width, canvas.height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a192f');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (!isPlaying) {
      ctx.fillStyle = '#00ff88';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Ready to mine?', canvas.width / 2, 200);
      ctx.font = '18px Arial';
      ctx.fillText('Click "START MINING"!', canvas.width / 2, 240);
      return;
    }

    // Draw all items
    items.forEach((item) => {
      let imgToDraw: HTMLImageElement | null = null;
      
      if (item.type === 'gold' && imagesRef.current.goldCoin) {
        imgToDraw = imagesRef.current.goldCoin;
      } else if (item.type === 'rock' && imagesRef.current.rock) {
        imgToDraw = imagesRef.current.rock;
      } else if (item.type === 'diamond' && imagesRef.current.diamond) {
        imgToDraw = imagesRef.current.diamond;
      }
      
      if (imgToDraw) {
        ctx.drawImage(imgToDraw, item.x, item.y, item.width, item.height);
      } else {
        // Visual fallback
        if (item.type === 'diamond') {
          ctx.fillStyle = '#2eb9ff';
          ctx.beginPath();
          ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = item.type === 'gold' ? '#FFD700' : '#555555';
          ctx.beginPath();
          ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    
    // Explosion animations
    explosions.forEach((explosion) => {
      if (imagesRef.current.explosion[explosion.currentFrame]) {
        const explosionImg = imagesRef.current.explosion[explosion.currentFrame];
        ctx.drawImage(explosionImg, explosion.x - 30, explosion.y - 30, 60, 60);
      }
    });
    
    // Precision Active visual effect
    if (precisionActive && isPlaying) {
      // Draw glow around clickable area
      ctx.fillStyle = 'rgba(147, 51, 234, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text indicating precision active
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`🎯 PRECISION: ${precisionTimeLeft}s`, canvas.width / 2, 30);
    }
    
    if (!imagesLoaded && isPlaying) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading graphics...', canvas.width / 2, canvas.height / 2);
    }
  }, [isPlaying, items, imagesLoaded, explosions, precisionActive, precisionTimeLeft]);

  // Handle click - WITH PRECISION BOOST AND SOUNDS
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    setItems((prev) => {
      return prev.filter((item) => {
        // LARGER HITBOX with Precision Pack active
        const hitboxMultiplier = precisionActive ? 1.5 : 1.0;
        
        const baseHitbox = 10;
        const effectiveHitbox = baseHitbox * hitboxMultiplier;
        
        const isHit = 
          clickX >= item.x - effectiveHitbox &&
          clickX <= item.x + item.width + effectiveHitbox &&
          clickY >= item.y - effectiveHitbox &&
          clickY <= item.y + item.height + effectiveHitbox;

        if (isHit) {
          // IMMEDIATE VISUAL FEEDBACK
          const ctx = canvas.getContext('2d');
          if (ctx) {
            let color = item.type === 'gold' ? 'rgba(255, 215, 0, 0.6)' : 
                       item.type === 'diamond' ? 'rgba(46, 185, 255, 0.6)' : 
                       'rgba(255, 50, 50, 0.6)';
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(item.x + item.width/2, item.y + item.height/2, 35, 0, Math.PI * 2);
            ctx.fill();
            
            // Score text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 26px Arial';
            ctx.textAlign = 'center';
            const points = item.type === 'diamond' ? '+50' : item.type === 'gold' ? '+10' : '-5';
            ctx.fillText(points, item.x + item.width/2, item.y + item.height/2 - 25);
          }

          // PLAY SOUND
          if (item.type === 'gold') {
            playSound('coin');
          } else if (item.type === 'diamond') {
            playSound('diamond');
          } else if (item.type === 'rock') {
            playSound('rock');
          }

          // ANIMATION
          if (item.type === 'gold' || item.type === 'diamond') {
            setExplosions(prevExplosions => [
              ...prevExplosions,
              {
                x: item.x + item.width/2,
                y: item.y + item.height/2,
                currentFrame: 0,
                maxFrames: 3
              }
            ]);
            
            setScore((s) => s + (item.type === 'diamond' ? 50 : 10));
          } else {
            // ROCKS: penalty but WITH FEEDBACK
            setExplosions(prevExplosions => [
              ...prevExplosions,
              {
                x: item.x + item.width/2,
                y: item.y + item.height/2,
                currentFrame: 0,
                maxFrames: 3
              }
            ]);
            setScore((s) => Math.max(0, s - 5));
          }
          return false;
        }
        return true;
      });
    });
  };

  // Reset when game ends
  useEffect(() => {
    if (!isPlaying && timeLeft === 0) {
      setItems([]);
      setExplosions([]);
      setShowPowerUpButtons(false);
    }
  }, [isPlaying, timeLeft]);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* TÍTULO MELHOR ALINHADO */}
      <div className="text-center pt-6 pb-8">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">⛏️</span>
          <h1 className="text-3xl font-bold">GOLD RUSH</h1>
        </div>
      </div>

      {/* Only sound toggle button (no music button) */}
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleMute}
          className={`px-6 py-2 rounded-lg flex items-center ${isMuted ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'}`}
        >
          {isMuted ? '🔇 Sound OFF' : '🔊 Sound ON'}
        </button>
      </div>

      {!isVerified ? (
        <div className="flex flex-col items-center w-full max-w-md p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <p className="text-center text-lg mb-6">
            Verify World ID to play!
          </p>
          <button
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg mb-4"
          >
            Verify World ID
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          {/* Greeting */}
          <div className="w-full p-4 mb-6 bg-gray-800/30 rounded-xl text-center">
            <p className="text-lg">
              Hello, <span className="font-bold text-yellow-300">{username}</span>!
            </p>
            <p className="text-gray-300 mt-1">Find rare diamonds! 💎</p>
            
            {/* Available Power-Ups Display */}
            {(tntCount > 0 || timerBoostCount > 0 || store.getPrecisionCount() > 0 || extraPlaysCount > 0) && (
              <div className="mt-3 flex justify-center space-x-4 flex-wrap">
                {tntCount > 0 && (
                  <div className="flex items-center bg-red-900/30 px-3 py-1 rounded-lg">
                    <span className="mr-2">🧨</span>
                    <span className="font-bold">{tntCount}</span>
                  </div>
                )}
                {timerBoostCount > 0 && (
                  <div className="flex items-center bg-blue-900/30 px-3 py-1 rounded-lg">
                    <span className="mr-2">⏱️</span>
                    <span className="font-bold">{timerBoostCount}</span>
                  </div>
                )}
                {store.getPrecisionCount() > 0 && (
                  <div className="flex items-center bg-purple-900/30 px-3 py-1 rounded-lg">
                    <span className="mr-2">🎯</span>
                    <span className="font-bold">{store.getPrecisionCount()} uses</span>
                  </div>
                )}
                {extraPlaysCount > 0 && (
                  <div className="flex items-center bg-green-900/30 px-3 py-1 rounded-lg">
                    <span className="mr-2">🔄</span>
                    <span className="font-bold">{extraPlaysCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isPlaying ? (
            /* Start Screen */
            <div className="flex flex-col items-center w-full">
              <div className="w-full p-6 bg-gray-800/50 rounded-2xl border border-gray-700 mb-6">
                <p className="text-4xl font-bold mb-2 text-yellow-300">{score}</p>
                <p className="text-gray-300 mb-2">Last Score</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-sm text-gray-300">TODAY'S POINTS</p>
                    <p className="text-2xl font-bold">{dailyScore}/500</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-sm text-gray-300">1500+ GAMES</p>
                    <p className="text-2xl font-bold">{gamesWithHighScore}/5</p>
                  </div>
                </div>
                
                {/* Game Availability Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                  {extraPlaysCount > 0 ? (
                    <div className="text-center">
                      <p className="text-green-400 font-bold mb-1">
                        🎮 {extraPlaysCount} Extra Play{extraPlaysCount > 1 ? 's' : ''} Available
                      </p>
                      <p className="text-gray-400 text-sm">
                        Use Extra Plays to bypass cooldown
                      </p>
                    </div>
                  ) : nextGameTime && nextGameTime > Date.now() ? (
                    <div className="text-center">
                      <p className="text-yellow-300 font-bold mb-1">
                        ⏳ Next Free Game In: {cooldownTimer}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Or buy Extra Plays in the Store
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-green-400 font-bold mb-1">
                        ✅ Ready to Play!
                      </p>
                      <p className="text-gray-400 text-sm">
                        1 free game available (1 hour cooldown)
                      </p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={startGame}
                  disabled={extraPlaysCount <= 0 && nextGameTime !== null && nextGameTime > Date.now()}
                  className={`w-full py-5 rounded-xl font-bold text-xl shadow-lg ${
                    extraPlaysCount <= 0 && nextGameTime !== null && nextGameTime > Date.now()
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                  }`}
                >
                  {extraPlaysCount <= 0 && nextGameTime && nextGameTime > Date.now()
                    ? `⏳ WAIT ${cooldownTimer}`
                    : '⛏️ START MINING'}
                </button>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Power-ups activate automatically when available!
                </p>
              </div>

              {/* LOGIN STREAK */}
              <div className="w-full p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl border border-blue-700 mb-6">
                <h3 className="text-xl font-bold text-center mb-4 text-yellow-300">
                  🔥 LOGIN STREAK
                </h3>
                
                <div className="flex justify-between mb-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div 
                      key={day} 
                      className={`flex flex-col items-center ${day <= loginStreak ? 'opacity-100' : 'opacity-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                        ${day <= loginStreak ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-700'}`}
                      >
                        {day <= loginStreak ? '🔥' : day}
                      </div>
                      <span className="text-xs">
                        {day === loginStreak ? `+${Math.min(day, 5) * 10}%` : `Day ${day}`}
                      </span>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-sm text-gray-300 mb-3">
                  Streak: <span className="font-bold text-yellow-300">{loginStreak} days</span> • Bonus: <span className="font-bold text-green-400">+{streakBonus}% points</span>
                </p>
                
                <p className="text-center text-xs text-gray-400">
                  Login daily to increase your point multiplier (max +50%)
                </p>
              </div>

              {/* DAILY CLAIM */}
              <div className="w-full p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-700">
                <h3 className="text-xl font-bold text-center mb-6 text-yellow-300">
                  🎁 DAILY REWARDS
                </h3>
                
                <div className="space-y-6">
                  {/* LEVEL 1 */}
                  <div className={`p-4 rounded-xl border ${canClaimLevel1 && !claimedLevel1 ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800/30'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold">Level 1</h4>
                        <p className="text-sm text-gray-300">500 points today</p>
                      </div>
                      <span className="font-bold text-green-400">0.002 WLD</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (dailyScore / 500) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm">{dailyScore}/500</span>
                    </div>
                    
                    <button
                      onClick={() => handleDailyClaim(1)}
                      disabled={!canClaimLevel1 || claimedLevel1 || isClaiming}
                      className={`w-full py-3 rounded-lg font-bold ${
                        canClaimLevel1 && !claimedLevel1
                          ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-700'
                          : claimedLevel1
                          ? 'bg-gray-800 text-gray-400 cursor-default'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {claimedLevel1 ? '✅ ALREADY CLAIMED' : 
                       canClaimLevel1 ? '🎯 CLAIM REWARD' :  // ✅ CORRIGIDO
                       '⏳ IN PROGRESS'}
                    </button>
                  </div>
                  
                  {/* LEVEL 2 */}
                  <div className={`p-4 rounded-xl border ${canClaimLevel2 && !claimedLevel2 ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-600 bg-gray-800/30'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold">Level 2</h4>
                        <p className="text-sm text-gray-300">5 games with 1500+ points each</p>
                      </div>
                      <span className="font-bold text-yellow-300">0.010 WLD</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (gamesWithHighScore / 5) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm">{gamesWithHighScore}/5</span>
                    </div>
                    
                    <button
                      onClick={() => handleDailyClaim(2)}
                      disabled={!canClaimLevel2 || claimedLevel2 || isClaiming}
                      className={`w-full py-3 rounded-lg font-bold ${
                        canClaimLevel2 && !claimedLevel2
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                          : claimedLevel2
                          ? 'bg-gray-800 text-gray-400 cursor-default'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {claimedLevel2 ? '✅ ALREADY CLAIMED' : 
                       canClaimLevel2 ? '🏆 CLAIM BONUS' :  // ✅ CORRIGIDO
                       '⏳ IN PROGRESS'}
                    </button>
                  </div>
                  
                  {/* STATUS */}
                  <div className="pt-4 border-t border-gray-600">
                    <p className="text-center text-sm mb-2">
                      {claimMessage || 'Check your progress above'}
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      {lastClaimDate 
                        ? `Last claim: ${lastClaimDate}` 
                        : 'No claims yet today'}
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      {gamesPlayedToday} games played today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Game Screen WITH POWER-UPS */
            <>
              {/* STATS BAR WITH POWER-UP BUTTONS */}
              <div className="flex justify-between w-full px-2 mb-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-300">TIME</p>
                  <p className="text-2xl font-bold">⏱️ {timeLeft}s</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-300">SCORE</p>
                  <p className="text-2xl font-bold">💰 {score}</p>
                </div>
              </div>

              {/* STREAK BONUS INDICATOR DURING GAME */}
              {streakBonus > 0 && (
                <div className="w-full px-6 mb-2">
                  <div className="p-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg text-center">
                    <p className="text-sm text-yellow-300">
                      🔥 STREAK BONUS: +{streakBonus}% points (Day {loginStreak})
                    </p>
                  </div>
                </div>
              )}

              {/* POWER-UP BUTTONS DURING GAME */}
              {showPowerUpButtons && (tntCount > 0 || timerBoostCount > 0) && (
                <div className="flex justify-center space-x-4 mb-4 w-full px-6">
                  {tntCount > 0 && (
                    <button
                      onClick={handleUseTNT}
                      disabled={usingTNT}
                      className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold transition-all ${
                        usingTNT
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                      }`}
                    >
                      <span className="text-xl mr-2">🧨</span>
                      <div className="text-left">
                        <div className="text-sm">TNT</div>
                        <div className="text-xs">({tntCount})</div>
                      </div>
                    </button>
                  )}
                  
                  {timerBoostCount > 0 && (
                    <button
                      onClick={handleUseTimerBoost}
                      disabled={usingTimerBoost}
                      className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold transition-all ${
                        usingTimerBoost
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      }`}
                    >
                      <span className="text-xl mr-2">⏱️</span>
                      <div className="text-left">
                        <div className="text-sm">+30s</div>
                        <div className="text-xs">({timerBoostCount})</div>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* GAME CANVAS */}
              <div className="relative w-full">
                <canvas
                  ref={canvasRef}
                  width={375}
                  height={500}
                  className="w-full border-4 border-gray-700 rounded-2xl shadow-xl cursor-crosshair"
                  onClick={handleCanvasClick}
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    backgroundColor: 'transparent'
                  }}
                />
                
                {/* PRECISION ACTIVE OVERLAY */}
                {precisionActive && (
                  <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-r from-purple-900/70 to-purple-700/70 rounded-t-2xl text-center">
                    <p className="text-white font-bold">
                      🎯 PRECISION ACTIVE: Hitbox +50% ({precisionTimeLeft}s)
                    </p>
                  </div>
                )}
                
                {items.length === 0 && !imagesLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white" style={{ zIndex: 1 }}>
                    <p className="text-xl font-bold mb-2">Items falling!</p>
                    <p>💛 Gold = +10 • 💎 Diamond = +50 • 🪨 Rock = -5</p>
                  </div>
                )}
              </div>

              {/* LEGEND */}
              <div className="flex justify-between w-full mt-6 text-sm px-6">
                <div className="flex flex-col items-center">
                  <img src="/game-assets/moeda01.png" className="w-8 h-8 mb-1" alt="Gold" />
                  <span className="text-yellow-400 font-bold">+10</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/game-assets/diamond.png" className="w-8 h-8 mb-1" alt="Diamond" />
                  <span className="text-blue-400 font-bold">+50</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/game-assets/rocha01.png" className="w-8 h-8 mb-1" alt="Rock" />
                  <span className="text-red-400 font-bold">-5</span>
                </div>
              </div>
              
              {/* POWER-UP INSTRUCTION */}
              {(tntCount > 0 || timerBoostCount > 0) && (
                <div className="mt-4 text-center text-sm text-gray-300">
                  <p>Use buttons above to activate power-ups during the game!</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <div className="pb-6"></div>
    </div>
  );
}