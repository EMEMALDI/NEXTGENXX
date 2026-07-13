import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Settings, Plus, X, Server, Layers } from 'lucide-react';
import { ProtocolRegistry } from '../lib/protocols';

export const ProtocolEngineComponent = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', protocol: 'wireguard', isDefault: false });
  const [advancedParams, setAdvancedParams] = useState<string>('{}');

  const availableProtocols = ProtocolRegistry.list();

  const loadData = async () => {
    try {
      const data = await fetchWithAuth('/api/protocols/profiles');
      setProfiles(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let settings = {};
      try {
        settings = JSON.parse(advancedParams);
      } catch (err) {
        alert('Advanced parameters must be valid JSON');
        return;
      }
      
      const engine = ProtocolRegistry.get(formData.protocol);
      // Optional: use engine.generate(settings) to validate/normalize
      const validatedConfig = engine.generate(settings);

      await fetchWithAuth('/api/protocols/profiles', {
        method: 'POST',
        body: JSON.stringify({ ...formData, settings: validatedConfig })
      });
      setShowModal(false);
      loadData();
    } catch (e) {
      alert("Error saving profile: " + e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await fetchWithAuth(`/api/protocols/profiles/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">Protocol Engine</h1>
          <p className="text-gray-500 mt-1">Manage modular protocols and reusable configuration templates.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className="glass-panel p-6 rounded-2xl border dark:border-white/10 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                   <Layers className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold">{profile.name}</h3>
                   <span className="text-xs text-gray-500 font-mono uppercase">{profile.protocol}</span>
                 </div>
               </div>
               {profile.isDefault && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-xs font-medium uppercase">Default</span>}
             </div>
             
             <div className="bg-black/20 p-3 rounded-lg overflow-x-auto text-xs font-mono text-gray-400 mb-4 h-32 whitespace-pre">
               {JSON.stringify(profile.settings, null, 2)}
             </div>

             <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
               <button onClick={() => handleDelete(profile.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                 <X className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Protocol Profile</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Profile Name (e.g., Gaming, Streaming)</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Protocol Module</label>
                <select value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})} className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-white uppercase">
                  {availableProtocols.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Advanced Parameters (JSON)</label>
                <textarea rows={5} value={advancedParams} onChange={e => setAdvancedParams(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-xs" placeholder='{"mtu": 1420}' />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4" />
                <label className="text-sm text-gray-400">Set as default template</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
