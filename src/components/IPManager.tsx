import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Globe, Plus, X, Server } from 'lucide-react';

export const IPManager = () => {
  const [ips, setIps] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ address: '', type: 'ipv4', nodeId: '' });

  const loadData = async () => {
    try {
      // Just mock for now, implement APIs next
      const nodesData = await fetchWithAuth('/api/nodes');
      setNodes(nodesData);
      
      const ipsData = await fetchWithAuth('/api/ips');
      setIps(ipsData);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/api/ips', {
        method: 'POST',
        body: JSON.stringify({ ...formData, nodeId: parseInt(formData.nodeId) })
      });
      setShowModal(false);
      loadData();
    } catch (e) {
      alert("Error saving IP: " + e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this IP?')) return;
    try {
      await fetchWithAuth(`/api/ips/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">IP Management</h1>
          <p className="text-gray-500 mt-1">Manage server IPs and domain names.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add IP/Domain
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border dark:border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Address</th>
              <th className="p-4 font-medium text-gray-400">Type</th>
              <th className="p-4 font-medium text-gray-400">Assigned Node</th>
              <th className="p-4 font-medium text-gray-400">Status</th>
              <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ips.map(ip => (
              <tr key={ip.id} className="hover:bg-white/5">
                <td className="p-4 font-mono">{ip.address}</td>
                <td className="p-4"><span className="uppercase text-xs font-bold px-2 py-1 bg-white/5 rounded-md">{ip.type}</span></td>
                <td className="p-4">
                  {nodes.find(n => n.id === ip.nodeId)?.name || 'Unassigned'}
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-2 text-xs font-medium ${ip.active ? 'text-emerald-500' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${ip.active ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                    {ip.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(ip.id)} className="text-red-500 hover:text-red-400 p-2"><X className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {ips.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No IPs registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add IP or Domain</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="192.168.1.1 or vpn.example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white">
                  <option value="ipv4">IPv4</option>
                  <option value="ipv6">IPv6</option>
                  <option value="domain">Domain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign to Node (Optional)</label>
                <select value={formData.nodeId} onChange={e => setFormData({...formData, nodeId: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white">
                  <option value="">Unassigned</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
