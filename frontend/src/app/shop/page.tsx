'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Award, CheckCircle, Zap, Shield, HelpCircle, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { api, User } from '../../lib/api';
import Navbar from '../../components/Navbar';

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: 'consumable' | 'frame' | 'theme';
  description: string;
  style_class: string;
}

export default function ShopPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    setIsLoading(true);
    try {
      // Fetch user stats
      const token = localStorage.getItem('eduverse_token');
      if (token) {
        // Load active user from profile endpoint using saved user ID
        const userId = localStorage.getItem('eduverse_user_id');
        if (userId) {
          const profile = await api.getUserProfile(Number(userId));
          // Profile returns detailed stats, construct User object
          setCurrentUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            is_admin: false,
            created_at: '',
            xp: profile.xp,
            level: profile.level,
            rank: profile.rank,
            completed_courses_count: profile.completed_courses_count,
            certificates_count: profile.certificates_count,
            achievements: profile.achievements,
            streak_days: profile.streak_days,
            last_active: '',
            unlocked_items: profile.unlocked_items || [],
            streak_freezes: profile.streak_freezes || 0,
            active_frame: profile.active_frame || 'default',
            active_theme: profile.active_theme || 'default'
          });
        }
      }
      
      // Fetch items catalogue
      const data = await api.getShopItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load shop details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async (itemId: string) => {
    setIsProcessing(itemId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const updatedUser = await api.buyShopItem(itemId);
      setCurrentUser(updatedUser);
      setSuccessMsg("Purchase successful! Item added to your inventory.");
      
      // Clear success alert after 3 seconds
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to purchase item.");
      setTimeout(() => setErrorMsg(''), 4550);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleActivate = async (itemId: string, category: string) => {
    setIsProcessing(itemId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const updatedUser = await api.activateShopItem(itemId, category);
      setCurrentUser(updatedUser);
      setSuccessMsg(`Cosmetic active item set to: ${itemId === 'default' ? 'None' : 'Selected Item'}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to activate cosmetic.");
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xs text-slate-500">Entering Coder Shop...</p>
        </div>
      </div>
    );
  }

  const unlocked = currentUser.unlocked_items || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Visual background blurs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8 relative z-10 select-none">
        
        {/* Alerts Station */}
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full">
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400 flex items-start gap-2 shadow-2xl backdrop-blur-md"
              >
                <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold leading-relaxed">{successMsg}</p>
              </motion.div>
            )}
            
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 flex items-start gap-2 shadow-2xl backdrop-blur-md"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold leading-relaxed">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shop Header banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-indigo-400" /> Virtual Coder Shop
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Exchange your earned XP to customize your dashboard profile frames, unlock matrix visual themes, or acquire streak freezes.
            </p>
          </div>

          {/* XP Ticker Balance */}
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-5 py-3.5 flex flex-col items-end shadow-inner shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-extrabold text-white">{currentUser.xp}</span>
              <span className="text-xs font-bold text-slate-400 font-mono">XP</span>
            </div>
          </div>
        </div>

        {/* Shop Items Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CATEGORY 1: Utility items (Streak Freezes) */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5" /> Consumable Cards
            </h3>
            
            {items.filter(i => i.category === 'consumable').map(item => (
              <div key={item.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700/60 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <span className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                      Owned: {currentUser.streak_freezes}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-0.5 text-xs text-amber-400 font-bold">
                    <Zap className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{item.cost} XP</span>
                  </div>

                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={isProcessing === item.id || currentUser.xp < item.cost}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-xs font-bold transition-all shadow disabled:opacity-50 disabled:bg-slate-850 active:scale-95"
                  >
                    {isProcessing === item.id ? "Purchasing..." : "Purchase Card"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CATEGORY 2: Profile Frames */}
          <div className="space-y-4 md:col-span-2 flex flex-col">
            <h3 className="text-xs font-extrabold text-violet-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
              <Award className="h-4.5 w-4.5" /> Holographic Avatar Frames & Lobby Themes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.filter(i => i.category !== 'consumable').map(item => {
                const isUnlocked = unlocked.includes(item.id);
                const isActive = item.category === 'frame' 
                  ? currentUser.active_frame === item.id
                  : currentUser.active_theme === item.id;
                  
                return (
                  <div key={item.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <span className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Avatar Frame Preview in Shop */}
                      {item.category === 'frame' ? (
                        <div className="flex items-center justify-center py-2 shrink-0">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center p-0.5 transition-all ${
                            item.id === 'frame_neon' ? 'border-2 border-pink-500 shadow-[0_0_10px_#ec4899]' :
                            item.id === 'frame_rainbow' ? 'border-2 border-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-border' :
                            item.id === 'frame_gold' ? 'border-2 border-yellow-500 shadow-[0_0_15px_#f59e0b]' :
                            'border border-slate-650'
                          }`}>
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                              Avatar
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Theme Color bar Preview */
                        <div className="flex items-center justify-center py-1">
                          <div className={`w-full h-8 rounded border flex items-center justify-center text-[9px] font-bold tracking-wider ${
                            item.id === 'theme_cyberpunk' ? 'bg-slate-950 border-cyan-500/30 text-cyan-400 shadow-[inset_0_0_5px_#06b6d4]' :
                            item.id === 'theme_matrix'    ? 'bg-black border-green-500/30 text-green-500 shadow-[inset_0_0_5px_#22c55e]' :
                            item.id === 'theme_aurora'    ? 'border-violet-500/40 text-violet-300 overflow-hidden relative' :
                            'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                            style={item.id === 'theme_aurora' ? {
                              background: 'linear-gradient(135deg, #1e0a3c 0%, #0a1628 30%, #051a16 70%, #2d0a2e 100%)',
                              boxShadow: 'inset 0 0 12px rgba(139,92,246,0.4), inset 0 0 4px rgba(20,184,166,0.3)'
                            } : {}}
                          >
                            {item.id === 'theme_cyberpunk' ? 'CYBERPUNK sunset' :
                             item.id === 'theme_matrix'    ? 'MATRIX rain' :
                             item.id === 'theme_aurora'    ? (
                               <span style={{
                                 background: 'linear-gradient(90deg,#c4b5fd,#93c5fd,#5eead4,#f9a8d4)',
                                 WebkitBackgroundClip: 'text',
                                 WebkitTextFillColor: 'transparent',
                                 fontWeight: 800,
                                 letterSpacing: '0.15em'
                               }}>✦ AURORA GALAXY ✦</span>
                             ) : item.name}
                          </div>
                        </div>
                      )}

                      <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-0.5 text-xs text-amber-400 font-bold">
                        {!isUnlocked && (
                          <>
                            <Zap className="h-3.5 w-3.5 fill-amber-400" />
                            <span>{item.cost} XP</span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {isUnlocked ? (
                          isActive ? (
                            <span className="rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleActivate(item.id, item.category)}
                              disabled={isProcessing === item.id}
                              className="rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95"
                            >
                              Activate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleBuy(item.id)}
                            disabled={isProcessing === item.id || currentUser.xp < item.cost}
                            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-xs font-bold transition-all shadow disabled:opacity-50 disabled:bg-slate-850 active:scale-95"
                          >
                            Buy Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
