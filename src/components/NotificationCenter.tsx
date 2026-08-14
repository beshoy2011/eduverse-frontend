'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Achievement Unlocked', message: 'You earned the "7-Day Streak" badge!', read: false, time: '2m ago' },
    { id: 2, title: 'Course Update', message: 'New lesson added to Advanced Python.', read: false, time: '1h ago' },
    { id: 3, title: 'Reminder', message: 'Complete your weekly task.', read: true, time: '2d ago' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-gray-950">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="flex flex-col">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
