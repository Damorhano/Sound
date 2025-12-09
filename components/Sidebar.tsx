import React from 'react';
import { LayoutDashboard, Music, UploadCloud, Settings, LogOut, BarChart3 } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'releases', label: 'My Releases', icon: Music },
    { id: 'upload', label: 'New Distribution', icon: UploadCloud },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20 hidden md:flex">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Music className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          SoundBridge
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600/20 text-indigo-400 shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-slate-400 font-medium">Settings</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-900/20 cursor-pointer transition-colors mt-1 group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
          <span className="text-slate-400 font-medium group-hover:text-red-400">Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;