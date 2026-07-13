import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Zap, Shield, Wifi, Target, ServerCrash, Save } from 'lucide-react';

export const GamingOptimizer = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Gaming Optimizer</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Advanced network tuning for ultra-low latency and minimal packet loss.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-orange-500/30">
          <Save className="w-5 h-5" />
          Save Global Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-500" />
              Game-Specific Profiles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GameProfile name="PUBG Mobile" icon="🔫" active={true} />
              <GameProfile name="Call of Duty Mobile" icon="🪖" active={false} />
              <GameProfile name="Mobile Legends (MLBB)" icon="⚔️" active={false} />
              <GameProfile name="Free Fire" icon="🔥" active={false} />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Advanced Protocol Tuning
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Setting name="UDP Optimization First" desc="Prioritize UDP traffic over TCP for gaming packets." defaultVal={true} />
              <Setting name="TCP NoDelay" desc="Disable Nagle's algorithm for immediate packet transmission." defaultVal={true} />
              <Setting name="Multiplexing" desc="Re-use connections to reduce handshake overhead." defaultVal={true} />
              <Setting name="QUIC Support" desc="Enable HTTP/3 over UDP where supported by endpoints." defaultVal={false} />
              <Setting name="IPv4 Preference" desc="Force IPv4 for better routing compatibility in some regions." defaultVal={true} />
              <Setting name="Smart DNS Selection" desc="Automatically select the lowest-latency DNS resolver." defaultVal={true} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-indigo-500" />
              TCP/IP Stack Config
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>MTU Size (Maximum Transmission Unit)</span>
                  <span className="text-indigo-400 font-mono">1420</span>
                </label>
                <input type="range" min="1280" max="1500" defaultValue="1420" className="w-full accent-indigo-500" />
                <p className="text-xs text-gray-500">Lower MTU can prevent packet fragmentation on unstable networks.</p>
              </div>
              
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium flex justify-between">
                  <span>MSS Clamping</span>
                  <span className="text-indigo-400 font-mono">1380</span>
                </label>
                <input type="range" min="1240" max="1460" defaultValue="1380" className="w-full accent-indigo-500" />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium flex justify-between">
                  <span>KeepAlive Interval (seconds)</span>
                  <span className="text-indigo-400 font-mono">15</span>
                </label>
                <input type="range" min="5" max="60" defaultValue="15" className="w-full accent-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameProfile = ({ name, icon, active }: any) => {
  const [isActive, setIsActive] = useState(active);
  return (
    <div 
      onClick={() => setIsActive(!isActive)}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${
        isActive 
          ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
          : 'bg-white/50 dark:bg-black/20 border-transparent hover:border-white/10'
      } flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-sm">{name}</span>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-orange-500 bg-orange-500' : 'border-gray-400 dark:border-gray-600'}`} />
    </div>
  )
}

const Setting = ({ name, desc, defaultVal }: any) => {
  const [active, setActive] = useState(defaultVal);
  return (
    <div className="flex items-start justify-between gap-4 cursor-pointer group" onClick={() => setActive(!active)}>
      <div>
        <p className="font-medium text-sm group-hover:text-indigo-400 transition-colors">{name}</p>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
      <div className={`w-10 h-6 flex-shrink-0 rounded-full p-1 transition-colors ${active ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
        <motion.div 
          layout
          className="w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: active ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}
