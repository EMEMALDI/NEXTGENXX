import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Server, Users, Settings, LogOut, Menu, Moon, Sun, Activity, ShieldCheck, Key, Gamepad2, GitMerge } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Server, label: 'Nodes', path: '/nodes' },
  { icon: GitMerge, label: 'Smart Routing', path: '/routing' },
  { icon: Gamepad2, label: 'Gaming Optimizer', path: '/gaming' },
  { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Activity, label: 'Live Monitoring', path: '/monitoring' },
  { icon: Key, label: 'API Keys', path: '/apikeys' },
  { icon: ShieldCheck, label: 'Security & Logs', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme, user, setUser, setDbUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = async () => {
    localStorage.removeItem('admin_login');
    await signOut(auth);
    setUser(null);
    setDbUser(null);
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 flex overflow-hidden font-sans`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="h-screen flex-shrink-0 glass-panel border-r dark:border-white/10 flex flex-col relative z-20"
      >
        <div className="p-6 flex items-center gap-4 border-b border-gray-200 dark:border-white/10 h-[80px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            N
          </div>
          <AnimatePresence mode="popLayout">
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-[Space_Grotesk] font-bold text-xl whitespace-nowrap tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-400"
              >
                NextGen X
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative group
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                )}
                <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2">
           <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-500 hover:text-red-600"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-[80px] glass-panel border-b dark:border-white/10 flex items-center justify-between px-6 z-10 sticky top-0">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 overflow-hidden shadow-inner">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-white font-bold">{user?.email?.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.displayName || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
           {/* Abstract Background Elements */}
           <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
           <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
           <div className="relative z-10 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
};
