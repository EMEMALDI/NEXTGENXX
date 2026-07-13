import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitMerge, MapPin, Zap, RefreshCw, Network, Signal } from 'lucide-react';

const regions = [
  { id: 'uae', name: 'UAE (Dubai)', priority: 1, ping: 12 },
  { id: 'bahrain', name: 'Bahrain', priority: 2, ping: 18 },
  { id: 'turkey', name: 'Turkey', priority: 3, ping: 45 },
  { id: 'germany', name: 'Germany', priority: 4, ping: 80 },
  { id: 'netherlands', name: 'Netherlands', priority: 5, ping: 85 },
  { id: 'singapore', name: 'Singapore', priority: 6, ping: 120 },
  { id: 'us-west', name: 'US West (California)', priority: 7, ping: 150 }
];

export const SmartRouting = () => {
  const [autoRoute, setAutoRoute] = useState(true);
  const [stickySession, setStickySession] = useState(true);
  const [failover, setFailover] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">Smart Routing Engine</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure intelligent node selection and traffic steering.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/30">
          <RefreshCw className="w-5 h-5" />
          Apply Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
             <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                 <GitMerge className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold">Region Priorities</h3>
             </div>
             
             <div className="space-y-3 relative z-10">
               {regions.map((region, index) => (
                 <div key={region.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-transparent dark:hover:border-white/5 transition-colors">
                   <div className="flex items-center gap-4">
                     <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold font-mono text-sm">
                       {index + 1}
                     </span>
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-gray-400" />
                       <span className="font-medium">{region.name}</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-sm text-emerald-500">
                       <Signal className="w-4 h-4" />
                       {region.ping}ms
                     </div>
                     <button className="text-gray-400 hover:text-white transition-colors">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-500" />
              Engine Behavior
            </h3>
            
            <div className="space-y-4">
              <Toggle setting="Auto Best Node Selection" active={autoRoute} onClick={() => setAutoRoute(!autoRoute)} desc="Automatically choose the lowest latency node based on live metrics." />
              <Toggle setting="Sticky Sessions" active={stickySession} onClick={() => setStickySession(!stickySession)} desc="Maintain client connection to the same node to prevent session resets." />
              <Toggle setting="Automatic Failover" active={failover} onClick={() => setFailover(!failover)} desc="Seamlessly migrate connections to a backup node upon failure." />
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Smart Node Scoring
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Nodes are continuously evaluated and ranked based on a composite score.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Latency Weight</span>
                <span className="font-mono text-indigo-400">40%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Packet Loss Weight</span>
                <span className="font-mono text-indigo-400">30%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Jitter Weight</span>
                <span className="font-mono text-indigo-400">20%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Uptime History</span>
                <span className="font-mono text-indigo-400">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ setting, active, onClick, desc }: any) => (
  <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={onClick}>
    <div>
      <p className="font-medium text-sm">{setting}</p>
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
