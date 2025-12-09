import React, { useState, useEffect } from 'react';
import { TrackMetadata, Platform, ReleaseStatus, Release } from '../types';
import { Upload, Mic2, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Music2 } from 'lucide-react';
import { generateTrackDescription, analyzeReleaseStrategy } from '../services/geminiService';

interface WizardProps {
  onComplete: (release: Release) => void;
  onCancel: () => void;
}

const steps = ['Upload', 'Metadata', 'AI Assistant', 'Platforms', 'Review'];

const DistributionWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStrategy, setAiStrategy] = useState<string>('');
  
  // Form State
  const [metadata, setMetadata] = useState<TrackMetadata>({
    title: '',
    artist: 'Damorhano',
    producer: 'Damorhano',
    genre: 'Afro-Pop',
    releaseDate: new Date().toISOString().split('T')[0],
    description: '',
    explicit: false,
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.SPOTIFY, Platform.APPLE_MUSIC, Platform.YOUTUBE_MUSIC
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'audio') setAudioFile(e.target.files[0]);
      else setArtworkFile(e.target.files[0]);
    }
  };

  const generateAIContent = async () => {
    if (!metadata.title) return;
    setIsGenerating(true);
    try {
      const desc = await generateTrackDescription(metadata.title, metadata.artist, metadata.genre, 'Energetic and soulful');
      setMetadata(prev => ({ ...prev, description: desc }));
      
      const strategy = await analyzeReleaseStrategy(metadata.genre);
      setAiStrategy(strategy);
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleSubmit = () => {
    // Simulate upload delay
    setIsGenerating(true);
    setTimeout(() => {
        const newRelease: Release = {
        id: Math.random().toString(36).substr(2, 9),
        coverArtUrl: artworkFile ? URL.createObjectURL(artworkFile) : 'https://picsum.photos/400',
        metadata: metadata,
        status: ReleaseStatus.PROCESSING,
        platforms: selectedPlatforms,
        uploadDate: new Date().toLocaleDateString(),
        streams: 0
        };
        onComplete(newRelease);
        setIsGenerating(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Upload
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white">Upload Your Tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Upload */}
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-colors bg-slate-800/30">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                  <Music2 className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Audio File</h3>
                <p className="text-sm text-slate-400 mb-4">WAV or FLAC (16-bit / 44.1kHz or higher)</p>
                <input 
                  type="file" 
                  accept=".wav,.flac,.mp3" 
                  onChange={(e) => handleFileChange(e, 'audio')} 
                  className="hidden" 
                  id="audio-upload" 
                />
                <label 
                  htmlFor="audio-upload" 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  {audioFile ? 'Change File' : 'Select Audio'}
                </label>
                {audioFile && <p className="mt-3 text-green-400 text-sm flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> {audioFile.name}</p>}
              </div>

              {/* Artwork Upload */}
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-colors bg-slate-800/30">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Cover Art</h3>
                <p className="text-sm text-slate-400 mb-4">3000x3000px JPG or PNG</p>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  onChange={(e) => handleFileChange(e, 'image')} 
                  className="hidden" 
                  id="art-upload" 
                />
                <label 
                  htmlFor="art-upload" 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  {artworkFile ? 'Change Image' : 'Select Image'}
                </label>
                {artworkFile && (
                  <div className="mt-4 relative w-24 h-24 rounded-lg overflow-hidden shadow-lg">
                     <img src={URL.createObjectURL(artworkFile)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 1: // Metadata
        return (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Track Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Track Title</label>
                <input 
                  type="text" 
                  value={metadata.title} 
                  onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Summer Vibes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Main Artist</label>
                  <input 
                    type="text" 
                    value={metadata.artist} 
                    readOnly
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 cursor-not-allowed"
                  />
                  <p className="text-xs text-indigo-400 mt-1">Locked to account owner</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Producer</label>
                  <input 
                    type="text" 
                    value={metadata.producer}
                    onChange={(e) => setMetadata({...metadata, producer: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Genre</label>
                    <select 
                      value={metadata.genre}
                      onChange={(e) => setMetadata({...metadata, genre: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="Afro-Pop">Afro-Pop</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="R&B">R&B</option>
                        <option value="Dance">Dance</option>
                        <option value="Alternative">Alternative</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Release Date</label>
                  <input 
                    type="date" 
                    value={metadata.releaseDate} 
                    onChange={(e) => setMetadata({...metadata, releaseDate: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // AI
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                <div className="flex items-center space-x-2 text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Powered by Gemini</span>
                </div>
             </div>
             
             <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Generate Marketing Copy</h3>
                <p className="text-slate-300 text-sm mb-6">Let Damorhano's AI assistant write your Spotify Bio and Press Release description based on your track details.</p>
                
                {isGenerating ? (
                    <div className="flex items-center space-x-3 text-indigo-300">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing track properties...</span>
                    </div>
                ) : (
                    <button 
                        onClick={generateAIContent}
                        className="bg-white text-indigo-900 hover:bg-indigo-50 px-5 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate with AI</span>
                    </button>
                )}
             </div>

             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Track Description / Bio</label>
                    <textarea 
                        value={metadata.description}
                        onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white h-32 focus:outline-none focus:border-indigo-500"
                        placeholder="Generated description will appear here..."
                    ></textarea>
                </div>
                {aiStrategy && (
                     <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-400"/> Release Strategy Tips</h4>
                        <div className="text-slate-300 text-sm whitespace-pre-wrap">{aiStrategy}</div>
                     </div>
                )}
             </div>
          </div>
        );

      case 3: // Platforms
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white">Select Stores</h2>
            <p className="text-slate-400">Where do you want to distribute "{metadata.title || 'your track'}"?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(Platform).map((platform) => (
                    <div 
                        key={platform}
                        onClick={() => handleTogglePlatform(platform)}
                        className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all ${
                            selectedPlatforms.includes(platform) 
                            ? 'bg-indigo-600/20 border-indigo-500' 
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <span className={`font-medium ${selectedPlatforms.includes(platform) ? 'text-white' : 'text-slate-300'}`}>{platform}</span>
                        {selectedPlatforms.includes(platform) && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={() => setSelectedPlatforms(Object.values(Platform))}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                    Select All
                </button>
            </div>
          </div>
        );

      case 4: // Review
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white">Review & Distribute</h2>
                
                <div className="flex flex-col md:flex-row gap-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <div className="w-full md:w-1/3">
                        <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                            {artworkFile ? (
                                <img src={URL.createObjectURL(artworkFile)} className="w-full h-full object-cover" alt="Art" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">No Art</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <h3 className="text-white font-bold text-lg truncate">{metadata.title}</h3>
                                <p className="text-slate-300 text-sm">{metadata.artist}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-slate-500">Artist</span>
                                <span className="text-white font-medium">{metadata.artist}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500">Producer</span>
                                <span className="text-white font-medium">{metadata.producer}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500">Release Date</span>
                                <span className="text-white font-medium">{metadata.releaseDate}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500">Genre</span>
                                <span className="text-white font-medium">{metadata.genre}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-slate-500">Stores</span>
                                <span className="text-white font-medium">{selectedPlatforms.length} selected</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-slate-500">Description</span>
                                <p className="text-slate-300 text-xs mt-1 line-clamp-3">{metadata.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start space-x-3">
                    <div className="mt-1"><Sparkles className="w-5 h-5 text-yellow-500" /></div>
                    <div className="text-sm text-yellow-200">
                        <p className="font-semibold">Ready to release?</p>
                        <p className="opacity-80">Once distributed, delivery to stores takes 2-5 business days. You cannot edit the audio file after submission.</p>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10"></div>
        {steps.map((step, index) => (
          <div key={index} className={`flex flex-col items-center z-10 ${index <= currentStep ? 'text-indigo-400' : 'text-slate-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                index <= currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {index + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{step}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 min-h-[500px] flex flex-col justify-between shadow-2xl">
        {renderStepContent()}

        <div className="flex justify-between pt-8 border-t border-slate-800 mt-8">
            <button 
                onClick={currentStep === 0 ? onCancel : () => setCurrentStep(curr => curr - 1)}
                className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center"
            >
                {currentStep === 0 ? 'Cancel' : <><ChevronLeft className="w-4 h-4 mr-2" /> Back</>}
            </button>
            
            <button 
                onClick={currentStep === steps.length - 1 ? handleSubmit : () => setCurrentStep(curr => curr + 1)}
                disabled={currentStep === 0 && (!audioFile || !artworkFile)}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center shadow-lg ${
                    currentStep === 0 && (!audioFile || !artworkFile) 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                }`}
            >
                {isGenerating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Processing</>
                ) : (
                    currentStep === steps.length - 1 ? 'Distribute Release' : <>{currentStep === 0 ? 'Next' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DistributionWizard;