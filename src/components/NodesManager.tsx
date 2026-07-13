import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Server, Plus, Search, Activity, Globe, Shield, Play, Square, MoreVertical, Cloud, Signal } from 'lucide-react';

const mockNodes = [
  { id: 1, name: 'EU-Central-1', ip: '45.132.89.11', region: 'Germany', provider: 'Hetzner', protocol: 'VLESS-XTLS', status: 'online', latency: 24, jitter: 1.2, packetLoss: 0.0, score: 98, users: 432 },
  { id: 2, name: 'AP-East-3', ip: '192.241.15.99', region: 'Singapore', provider: 'DigitalOcean', protocol: 'Trojan', status: 'online', latency: 45, jitter: 2.1, packetLoss: 0.1, score: 92, users: 890 },
  { id: 3, name: 'US-West-2', ip: '143.198.22.8', region: 'US West', provider: 'AWS', protocol: 'Hysteria2', status: 'offline', latency: 0, jitter: 0, packetLoss: 100, score: 0, users: 0 },
  { id: 4, name: 'Gaming-LowPing', ip: '104.28.11.20', region: 'UAE (Dubai)', provider: 'Oracle Cloud', protocol: 'Shadowsocks', status: 'online', latency: 12, jitter: 0.5, packetLoss: 0.0, score: 99, users: 156 },
];

export const NodesManager = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">Nodes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor VPN servers across regions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative glass-panel rounded-xl flex items-center px-3 py-2 w-full md:w-64">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 w-full text-sm"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/30 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Deploy Node</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockNodes.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};

const NodeCard = ({ node }: any) => {
  const isOnline = node.status === 'online';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-panel rounded-2xl p-6 relative group overflow-hidden border dark:border-white/10"
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{node.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
              <span>{node.ip}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10">
                {node.protocol}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold font-mono text-indigo-500">{node.score}</div>
          <div className="text-[10px] uppercase text-gray-500 font-bold">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel rounded-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-xs">Location</span>
          </div>
          <p className="font-medium text-sm truncate">{node.region}</p>
        </div>
        <div className="glass-panel rounded-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Cloud className="w-4 h-4 text-orange-500" />
            <span className="text-xs">Provider</span>
          </div>
          <p className="font-medium text-sm truncate">{node.provider}</p>
        </div>
        
        <div className="glass-panel rounded-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs">Ping / Jitter</span>
          </div>
          <p className="font-medium text-sm font-mono">{isOnline ? `${node.latency}ms / ${node.jitter}ms` : '---'}</p>
        </div>
        <div className="glass-panel rounded-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Signal className="w-4 h-4 text-purple-500" />
            <span className="text-xs">Packet Loss</span>
          </div>
          <p className="font-medium text-sm font-mono">{isOnline ? `${node.packetLoss}%` : '---'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
               <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white dark:border-gray-900" />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium ml-2">{node.users} active</span>
        </div>
        
        <div className="flex gap-2">
          {isOnline ? (
            <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Stop Node">
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
             <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors" title="Start Node">
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}
          <button className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors">
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
