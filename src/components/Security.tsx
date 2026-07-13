import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Fingerprint, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

const mockAuditLogs = [
  { id: 1, action: 'ADMIN_LOGIN', resource: 'System', ip: '192.168.1.10', time: '10 mins ago', status: 'success' },
  { id: 2, action: 'UPDATE_NODE', resource: 'Node: Frankfurt-01', ip: '192.168.1.10', time: '1 hour ago', status: 'success' },
  { id: 3, action: 'FAILED_LOGIN', resource: 'System', ip: '45.33.22.11', time: '2 hours ago', status: 'failed' },
  { id: 4, action: 'DELETE_SUBSCRIPTION', resource: 'Sub: ID-4029', ip: '192.168.1.10', time: '5 hours ago', status: 'success' },
];

export const Security = () => {
  const [wafEnabled, setWafEnabled] = useState(true);
  const [rateLimit, setRateLimit] = useState(true);
  const [ddosProtection, setDdosProtection] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Security & Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Cluster protection, access control, and audit trails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               Edge Protection
             </h3>
             
             <div className="space-y-4 relative z-10">
               <Toggle setting="Web Application Firewall (WAF)" active={wafEnabled} onClick={() => setWafEnabled(!wafEnabled)} desc="Block SQLi, XSS, and known malicious payloads at the edge." />
               <Toggle setting="API Rate Limiting" active={rateLimit} onClick={() => setRateLimit(!rateLimit)} desc="Throttle brute-force attempts on auth and subscription endpoints." />
               <Toggle setting="L4/L7 DDoS Mitigation" active={ddosProtection} onClick={() => setDdosProtection(!ddosProtection)} desc="Automatically scrub traffic spikes and drop malformed packets." />
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-6 border dark:border-white/10 shadow-lg h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-indigo-500" />
                Audit Trail
              </h3>
              <button className="text-sm text-gray-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <RefreshCcw className="w-4 h-4" /> Refresh
              </button>
            </div>
            
            <div className="space-y-3">
              {mockAuditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-transparent dark:hover:border-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {log.status === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {log.action}
                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {log.resource}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">IP: {log.ip}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{log.time}</div>
                </div>
              ))}
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
    <div className={`w-10 h-6 flex-shrink-0 rounded-full p-1 transition-colors ${active ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <motion.div 
        layout
        className="w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ x: active ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </div>
);
