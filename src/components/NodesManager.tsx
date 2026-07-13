import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Server, Plus, Search, Activity, Globe, Shield, Play, Square, MoreVertical, Cloud, Signal, X } from 'lucide-react';
import { fetchWithAuth } from '../lib/api';

export const NodesManager = () => {
  const [search, setSearch] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    port: 443,
    country: 'Germany',
    region: 'EU-Central',
    provider: 'Hetzner',
    protocol: 'VLESS',
  });

  const loadNodes = async () => {
    try {
      const data = await fetchWithAuth('/api/nodes');
      setNodes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetchWithAuth('/api/nodes', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      loadNodes();
    } catch (e) {
      alert("Error saving node: " + e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this node?')) return;
    try {
      await fetchWithAuth(`/api/nodes/${id}`, { method: 'DELETE' });
      loadNodes();
    } catch (e) {
      alert('Error deleting node: ' + e);
    }
  };

  const filteredNodes = nodes.filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.ipAddress.includes(search));

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
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/30 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Deploy Node</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Deploy New Node</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleDeploy} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Node Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="EU-Central-1" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">IP Address</label>
                <input required type="text" value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="192.168.1.1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Port</label>
                  <input required type="number" value={formData.port} onChange={e => setFormData({...formData, port: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Protocol</label>
                  <select value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500">
                    <option>VLESS</option>
                    <option>Trojan</option>
                    <option>VMess</option>
                    <option>Shadowsocks</option>
                    <option>Reality</option>
                    <option>Hysteria2</option>
                    <option>TUIC</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Region</label>
                  <input required type="text" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Country</label>
                  <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl mt-4 disabled:opacity-50">
                {isLoading ? 'Deploying...' : 'Deploy Node'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNodes.map((node) => (
          <NodeCard key={node.id} node={node} onDelete={() => handleDelete(node.id)} />
        ))}
        {filteredNodes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No nodes found. Deploy your first node to get started.
          </div>
        )}
      </div>
    </div>
  );
};

const NodeCard = ({ node, onDelete }: any) => {
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
              <span>{node.ipAddress}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10">
                {node.protocol}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold font-mono text-indigo-500">{node.score || 0}</div>
          <div className="text-[10px] uppercase text-gray-500 font-bold">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel rounded-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-xs">Location</span>
          </div>
          <p className="font-medium text-sm truncate">{node.country} ({node.region})</p>
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
          <span className="text-xs text-gray-500 font-medium ml-2">{node.users || 0} active</span>
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
          <button onClick={onDelete} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
