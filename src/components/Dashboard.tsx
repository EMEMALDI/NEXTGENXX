import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Server, Users, ArrowUpRight, ArrowDownRight, Zap, Cpu, MemoryStick } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTraffic = [
  { time: '00:00', traffic: 120, cpu: 45, ram: 60 },
  { time: '04:00', traffic: 300, cpu: 65, ram: 72 },
  { time: '08:00', traffic: 250, cpu: 55, ram: 68 },
  { time: '12:00', traffic: 500, cpu: 85, ram: 88 },
  { time: '16:00', traffic: 450, cpu: 75, ram: 82 },
  { time: '20:00', traffic: 600, cpu: 92, ram: 90 },
  { time: '24:00', traffic: 350, cpu: 50, ram: 65 },
];

export const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 1245,
    nodes: 24,
    bandwidth: 8.4, // TB
    activeConns: 8432,
    avgPing: 42,
    packetLoss: 0.1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-[Space_Grotesk] font-bold tracking-tight">Dashboard overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Live metrics from your VPN network.</p>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={stats.users.toLocaleString()} icon={Users} trend="+12%" up={true} color="from-blue-500 to-cyan-400" />
        <MetricCard title="Active Nodes" value={stats.nodes} icon={Server} trend="All Healthy" up={true} color="from-emerald-500 to-teal-400" />
        <MetricCard title="Network Traffic" value={`${stats.bandwidth} TB`} icon={Activity} trend="+4.2%" up={true} color="from-purple-500 to-indigo-500" />
        <MetricCard title="Live Connections" value={stats.activeConns.toLocaleString()} icon={Zap} trend="-2%" up={false} color="from-orange-500 to-pink-500" />
      </div>

      {/* Network Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <MiniMetric title="Average Global Ping" value={`${stats.avgPing}ms`} icon={Activity} color="text-emerald-500" />
        <MiniMetric title="Global Packet Loss" value={`${stats.packetLoss}%`} icon={Activity} color="text-emerald-500" />
        <MiniMetric title="Average Jitter" value="2.4ms" icon={Activity} color="text-yellow-500" />
      </div>

      {/* Charts & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl dark:border-white/10 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-500" />
               Global Traffic (24h)
             </h3>
             <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="traffic" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl dark:border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                Cluster CPU Load
              </h3>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTraffic}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl dark:border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MemoryStick className="w-5 h-5 text-purple-500" />
                Cluster RAM Usage
              </h3>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTraffic}>
                    <defs>
                      <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none' }} />
                    <Area type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl dark:border-white/10 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Top Nodes by Score</h3>
          <div className="space-y-4 flex-1">
            <NodeListItem name="Frankfurt-01" flag="🇩🇪" protocol="VLESS-XTLS" usage={98} />
            <NodeListItem name="Singapore-03" flag="🇸🇬" protocol="Trojan" usage={95} />
            <NodeListItem name="Tokyo-02" flag="🇯🇵" protocol="Shadowsocks" usage={91} />
            <NodeListItem name="London-01" flag="🇬🇧" protocol="Hysteria2" usage={88} />
            <NodeListItem name="US-West-05" flag="🇺🇸" protocol="VMess" usage={84} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniMetric = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass-panel p-4 rounded-xl dark:border-white/10 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
    </div>
  </div>
);

const MetricCard = ({ title, value, icon: Icon, trend, up, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-6 rounded-2xl dark:border-white/10 shadow-lg relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
        <h4 className="text-3xl font-[Space_Grotesk] font-bold">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`flex items-center text-sm font-medium ${up ? 'text-emerald-500' : 'text-red-500'}`}>
        {up ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {trend}
      </span>
      <span className="text-sm text-gray-400">vs last week</span>
    </div>
  </motion.div>
);

const NodeListItem = ({ name, flag, protocol, usage }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent dark:hover:border-white/5">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{flag}</span>
      <div>
        <h5 className="font-medium text-sm">{name}</h5>
        <p className="text-xs text-gray-500 font-mono">{protocol}</p>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-sm font-bold mb-1 font-mono text-indigo-400">{usage}/100</span>
      <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${usage}%` }} />
      </div>
    </div>
  </div>
);
