'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Award, CheckCircle2, Zap, Shield, AlertCircle, Cpu } from 'lucide-react';
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

  async function loadShopData() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('eduverse_token');
      if (token) {
        const userId = localStorage.getItem('eduverse_user_id');
        if (userId) {
          const profile = await api.getUserProfile(Number(userId));
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
      
      const data = await api.getShopItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load shop details:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadShopData();
  }, []);

  const handleBuy = async (itemId: string) => {
    setIsProcessing(itemId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const updatedUser = await api.buyShopItem(itemId);
      setCurrentUser(updatedUser);
      setSuccessMsg("Purchase verified! Item added to inventory.");
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to purchase item.");
      setTimeout(() => setErrorMsg(''), 4500);
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
      setSuccessMsg(`Cosmetic theme set to: ${itemId}`);
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
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-mono-code text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-2">
          <Cpu className="h-8 w-8 animate-spin text-indigo-400" />
          <span>Accessing Virtual Coder Depot...</span>
        </div>
      </div>
    );
  }

  const unlocked = currentUser.unlocked_items || [];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full font-mono-code text-xs">
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-emerald-500/20 border border-emerald-500/40 rounded p-3 text-emerald-400 flex items-center gap-2 shadow-2xl backdrop-blur-md"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p>{successMsg}</p>
              </motion.div>
            )}
            
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-rose-500/20 border border-rose-500/40 rounded p-3 text-rose-400 flex items-center gap-2 shadow-2xl backdrop-blur-md"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="edu-panel p-6 bg-[#0d111a] border-[#1e2638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-code">
          <div className="space-y-1">
            <span className="edu-badge edu-badge-cyan flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" /> VIRTUAL CODER DEPOT
            </span>
            <h1 className="text-2xl font-extrabold text-white">Developer Workspace Cosmetics & Utilities</h1>
            <p className="text-slate-400 text-xs font-sans">
              Exchange earned XP for IDE visual themes, avatar frames, and streak freeze protections.
            </p>
          </div>

          <div className="edu-panel p-3.5 bg-[#07090e] border-[#1e2638] text-right shrink-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">XP Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-xl font-extrabold text-white">{currentUser.xp}</span>
              <span className="text-xs text-slate-400">XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4 font-mono-code">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-[#1e2638] pb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Workspace Consumables
            </h3>
            
            {items.filter(i => i.category === 'consumable').map(item => (
              <div key={item.id} className="edu-panel p-4 bg-[#0d111a] border-[#1e2638] space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <span className="edu-badge edu-badge-indigo">Owned: {currentUser.streak_freezes}</span>
                </div>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-[#1e2638]">
                  <span className="text-amber-400 font-bold text-xs">{item.cost} XP</span>
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={isProcessing === item.id || currentUser.xp < item.cost}
                    className="edu-btn edu-btn-primary text-xs"
                  >
                    {isProcessing === item.id ? "Processing..." : "Acquire Utility"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 md:col-span-2 font-mono-code">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-[#1e2638] pb-2 flex items-center gap-2">
              <Award className="h-4 w-4" /> IDE Themes & Holographic Frames
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.filter(i => i.category !== 'consumable').map(item => {
                const isUnlocked = unlocked.includes(item.id);
                const isActive = item.category === 'frame' 
                  ? currentUser.active_frame === item.id
                  : currentUser.active_theme === item.id;
                  
                return (
                  <div key={item.id} className="edu-panel p-4 bg-[#0d111a] border-[#1e2638] flex flex-col justify-between space-y-4 hover:border-[#2d3852] transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white font-sans">{item.name}</h4>
                        <span className="edu-badge edu-badge-cyan">{item.category}</span>
                      </div>
                      
                      <div className="py-2">
                        <div className={`w-full h-8 rounded border flex items-center justify-center text-[10px] font-bold tracking-wider ${
                          item.id === 'theme_cyberpunk' ? 'bg-[#050811] border-cyan-500 text-cyan-400' :
                          item.id === 'theme_matrix'    ? 'bg-[#020b04] border-emerald-500 text-emerald-400' :
                          item.id === 'theme_aurora'    ? 'bg-[#070614] border-purple-500 text-purple-300' :
                          'bg-[#07090e] border-[#1e2638] text-slate-400'
                        }`}>
                          {item.name}
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs font-sans leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e2638]">
                      {!isUnlocked ? (
                        <span className="text-amber-400 font-bold text-xs">{item.cost} XP</span>
                      ) : <span />}

                      <div>
                        {isUnlocked ? (
                          isActive ? (
                            <span className="edu-badge edu-badge-emerald">Active Theme</span>
                          ) : (
                            <button
                              onClick={() => handleActivate(item.id, item.category)}
                              disabled={isProcessing === item.id}
                              className="edu-btn edu-btn-secondary text-xs"
                            >
                              Activate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleBuy(item.id)}
                            disabled={isProcessing === item.id || currentUser.xp < item.cost}
                            className="edu-btn edu-btn-primary text-xs"
                          >
                            Unlock
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
