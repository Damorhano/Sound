import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Play, TrendingUp, DollarSign, Users, ArrowUpRight } from 'lucide-react';
import { Release, ReleaseStatus } from '../types';

const data = [
  { name: 'Mon', streams: 4000 },
  { name: 'Tue', streams: 3000 },
  { name: 'Wed', streams: 2000 },
  { name: 'Thu', streams: 2780 },
  { name: 'Fri', streams: 1890 },
  { name: 'Sat', streams: 2390 },
  { name: 'Sun', streams: 3490 },
];

interface DashboardProps {
  releases: Release[];
  onUploadClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ releases, onUploadClick }) => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Damorhano</h1>
          <p className="text-slate-400 mt-1">Here's how your music is performing today.</p>
        </div>
        <button 
          onClick={onUploadClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/50 flex items-center space-x-2"
        >
          <ArrowUpRight className="w-5 h-5" />
          <span>New Release</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Streams', value: '1.2M', icon: Play, change: '+12%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Revenue', value: '$4,250', icon: DollarSign, change: '+8%', color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Monthly Listeners', value: '85.4k', icon: Users, change: '+24%', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Playlist Adds', value: '342', icon: TrendingUp, change: '+5%', color: 'text-pink-400', bg: 'bg-pink-500/10' },
        ].map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:border-slate-600 transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Streaming Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="streams" stroke="#818cf8" fillOpacity={1} fill="url(#colorStreams)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Releases */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Releases</h2>
          <div className="space-y-4">
            {releases.length === 0 ? (
               <div className="text-center py-10 text-slate-500">
                 No releases yet.
               </div>
            ) : (
              releases.slice(0, 4).map((release) => (
                <div key={release.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-700/50 transition-colors">
                  <img src={release.coverArtUrl} alt={release.metadata.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium truncate">{release.metadata.title}</h4>
                    <p className="text-xs text-slate-400">{release.metadata.releaseDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    release.status === ReleaseStatus.DISTRIBUTED 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;