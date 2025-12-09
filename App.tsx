import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DistributionWizard from './components/DistributionWizard';
import { Release, ReleaseStatus } from './types';
import { CheckCircle, Music } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [releases, setReleases] = useState<Release[]>([
    {
      id: '1',
      coverArtUrl: 'https://picsum.photos/400?random=1',
      metadata: {
        title: 'Midnight in Lagos',
        artist: 'Damorhano',
        producer: 'Damorhano',
        genre: 'Afro-Pop',
        releaseDate: '2024-12-10',
        description: 'A smooth vibe.',
        explicit: false
      },
      status: ReleaseStatus.DISTRIBUTED,
      platforms: [],
      uploadDate: '2024-11-20',
      streams: 45000
    },
    {
      id: '2',
      coverArtUrl: 'https://picsum.photos/400?random=2',
      metadata: {
        title: 'Heartbeat (Remix)',
        artist: 'Damorhano',
        producer: 'Damorhano',
        genre: 'Dance',
        releaseDate: '2025-01-15',
        description: 'Club banger.',
        explicit: true
      },
      status: ReleaseStatus.PROCESSING,
      platforms: [],
      uploadDate: '2025-01-10',
      streams: 0
    }
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDistributionComplete = (newRelease: Release) => {
    setReleases([newRelease, ...releases]);
    setCurrentView('dashboard');
    setShowSuccessModal(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 md:ml-64 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
        
        {currentView === 'dashboard' && (
          <Dashboard 
            releases={releases} 
            onUploadClick={() => setCurrentView('upload')} 
          />
        )}
        
        {currentView === 'upload' && (
          <DistributionWizard 
            onComplete={handleDistributionComplete} 
            onCancel={() => setCurrentView('dashboard')} 
          />
        )}
        
        {/* Placeholder for other views */}
        {(currentView === 'releases' || currentView === 'analytics') && (
           <div className="p-10 flex flex-col items-center justify-center h-full text-slate-500">
              <Music className="w-16 h-16 mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p>The {currentView} module is currently under development.</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 text-indigo-400 hover:text-indigo-300 underline"
              >
                Return to Dashboard
              </button>
           </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-green-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5"></div>
            <div className="relative z-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Distribution Started!</h2>
                <p className="text-slate-400 mb-8">
                    Your track has been successfully submitted to the queue. Damorhano, expect to see it on stores within 3-5 business days.
                </p>
                <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-xl transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;