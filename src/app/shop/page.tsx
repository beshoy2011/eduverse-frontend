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
      <div className="min-h-screen bg-black text-white flex flex-col font-mono-code text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-2">
          <Cpu className="h-8 w-8 animate-spin text-[#8052ff]" />
          <span>Accessing Virtual Coder Depot...</span>
        </div>
      </div>
    );
  }

  const unlocked = currentUser.unlocked_items || [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 space-y-10">
        
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full font-mono-code text-xs">
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#15846e]/20 border border-[#15846e]/40 p-3 text-[#15846e] flex items-center gap-2 shadow-2xl backdrop-blur-md"
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
                className="bg-rose-500/20 border border-rose-500/40 p-3 text-rose-400 flex items-center gap-2 shadow-2xl backdrop-blur-md"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border border-white/10 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-code">
          <div className="space-y-1">
            <span className="text-[11px] text-[#ffb829] font-bold flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" /> CODER DEPOT // ARTIFACT EXCHANGE
            </span>
            <h1 className="text-2xl font-extrabold text-white">Developer Workspace Cosmetics & Utilities</h1>
            <p className="text-[#9a9a9a] text-xs font-sans">
              Exchange earned XP for IDE visual themes, avatar frames, and streak freeze protections.
            </p>
          </div>

          <div className="p-3.5 border border-white/10 bg-black text-right shrink-0">
            <span className="text-[10px] text-[#9a9a9a] font-bold uppercase tracking-wider block">XP Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="h-5 w-5 text-[#ffb829] fill-[#ffb829]" />
              <span className="text-xl font-extrabold text-white">{currentUser.xp}</span>
              <span className="text-xs text-[#9a9a9a]">XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4 font-mono-code">
            <h3 className="text-xs font-bold text-[#8052ff] uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Workspace Consumables
            </h3>
            
            {items.filter(i => i.category === 'consumable').map(item => (
              <div key={item.id} className="p-4 border border-white/10 bg-black space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <span className="text-[10px] text-[#8052ff] border border-[#8052ff]/30 px-2 py-0.5">Owned: {currentUser.streak_freezes}</span>
                </div>
                <p className="text-[#9a9a9a] text-xs font-sans leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[#ffb829] font-bold text-xs">{item.cost} XP</span>
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
            <h3 className="text-xs font-bold text-[#15846e] uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
              <Award className="h-4 w-4" /> IDE Themes & Holographic Frames
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.filter(i => i.category !== 'consumable').map(item => {
                const isUnlocked = unlocked.includes(item.id);
                const isActive = item.category === 'frame' 
                  ? currentUser.active_frame === item.id
                  : currentUser.active_theme === item.id;
                  
                return (
                  <div key={item.id} className="p-4 border border-white/10 bg-black flex flex-col justify-between space-y-4 hover:border-white/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white font-sans">{item.name}</h4>
                        <span className="text-[10px] text-[#9a9a9a] uppercase border border-white/10 px-2 py-0.5">{item.category}</span>
                      </div>
                      
                      <div className="py-2">
                        <div className="w-full h-8 border border-white/15 bg-black flex items-center justify-center text-[10px] font-bold tracking-wider text-[#bdbdbd]">
                          {item.name}
                        </div>
                      </div>

                      <p className="text-[#9a9a9a] text-xs font-sans leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      {!isUnlocked ? (
                        <span className="text-[#ffb829] font-bold text-xs">{item.cost} XP</span>
                      ) : <span />}

                      <div>
                        {isUnlocked ? (
                          isActive ? (
                            <span className="text-[10px] text-[#15846e] border border-[#15846e]/40 px-2 py-0.5">Active Theme</span>
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
