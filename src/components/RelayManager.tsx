import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Server, Plus, Shield, X, Activity } from 'lucide-react';

export const RelayManager = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', type: 'relay', ipAddress: '', port: 443, country: '', region: '', provider: '', protocol: 'VLESS', status: 'online'
  });

  const loadNodes = async () => {
    try {
      const data = await fetchWithAuth('/api/nodes?type=relay');
      setNodes(data.filter((n: any) => n.type === 'relay' || n.type === 'proxy'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadNodes(); }, []);

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
    if (!confirm('Delete this relay?')) return;
    try {
      await fetchWithAuth(`/api/nodes/${id}`, { method: 'DELETE' });
      loadNodes();
    } catch (e) {
      alert('Error deleting: ' + e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">Relay & Proxy Manager</h1>
          <p className="text-gray-500 mt-1">Manage intermediate proxy nodes and relay infrastructure.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" /> Deploy Relay
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div key={node.id} className="glass-panel p-6 rounded-2xl border dark:border-white/10 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                   <Server className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold">{node.name}</h3>
                   <span className="text-xs text-gray-500 font-mono">{node.ipAddress}</span>
                 </div>
               </div>
               <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium uppercase text-gray-400">{node.type}</span>
             </div>
             
             <div className="space-y-2 mb-4">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Location</span>
                 <span className="font-medium">{node.country} ({node.region})</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Protocol</span>
                 <span className="font-medium">{node.protocol}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Health</span>
                 <span className="text-emerald-500 font-medium">{node.health}%</span>
               </div>
             </div>

             <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
               <button onClick={() => handleDelete(node.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                 <X className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Deploy New Relay</h2>
            <form onSubmit={handleDeploy} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Relay Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">IP Address</label>
                <input required value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white">
                    <option value="relay">Relay</option>
                    <option value="proxy">Proxy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Protocol</label>
                  <select value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white">
                    <option>VLESS</option>
                    <option>Trojan</option>
                    <option>Shadowsocks</option>
                    <option>WireGuard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Country</label>
                  <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Region</label>
                  <input required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">Deploy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
