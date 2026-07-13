import React, { useState } from 'react';
import { Key, Plus, Copy, Trash2, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const mockKeys = [
  { id: 1, name: 'Production Dashboard App', key: 'nx_live_8f92j3n4v8d7...', createdAt: '2026-07-10', lastUsed: '2 mins ago' },
  { id: 2, name: 'Billing Service Bot', key: 'nx_test_4m5n6b7v8c9x...', createdAt: '2026-07-12', lastUsed: 'Never' },
];

export const APIKeys = () => {
  const [keys, setKeys] = useState(mockKeys);
  const [showKey, setShowKey] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (id: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">API Keys</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage programmatic access to your NextGen X cluster.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/30 whitespace-nowrap">
          <Plus className="w-5 h-5" />
          Generate New Key
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Shield className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Your API keys carry the same privileges as your user account. Keep them secure and never expose them in client-side code or public repositories.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Secret Key</th>
                <th className="py-3 px-4 font-medium">Created</th>
                <th className="py-3 px-4 font-medium">Last Used</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-sm">{k.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 dark:bg-black/40 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-300">
                        {showKey === k.id ? k.key : '••••••••••••••••••••••••••••'}
                      </code>
                      <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
                        {showKey === k.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleCopy(k.id, k.key)} className="text-gray-400 hover:text-indigo-500 p-1 relative">
                        {copied === k.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{k.createdAt}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{k.lastUsed}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
