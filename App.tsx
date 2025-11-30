import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { GiftForm } from './components/GiftForm';
import { GiftResults } from './components/GiftResults';
import { Loading } from './components/Loading';
import { HistoryModal } from './components/HistoryModal';
import { generateGiftIdeas } from './services/geminiService';
import { GiftIdea, RecipientProfile, AppState } from './types';
import { AlertCircle, ChevronDown, ChevronUp, Key } from 'lucide-react';

const App: React.FC = () => {
  // Start at LANDING page
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [currentProfile, setCurrentProfile] = useState<RecipientProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  // Load History on Mount
  useEffect(() => {
    try {
        const stored = localStorage.getItem('gift_history');
        if (stored) {
            setHistoryItems(JSON.parse(stored));
        }
    } catch (e) {
        console.error("Failed to load history");
    }
  }, []);

  const handleFormSubmit = async (profile: RecipientProfile) => {
    setAppState(AppState.LOADING);
    setCurrentProfile(profile); // Save profile to state
    setErrorMsg(null);
    setShowErrorDetails(false);
    
    try {
      const ideas = await generateGiftIdeas(profile);
      setGiftIdeas(ideas);
      setAppState(AppState.SUCCESS);
      
      saveToLocalHistory(profile, ideas);
      
    } catch (error: any) {
      console.error(error);
      const message = error instanceof Error 
        ? error.message 
        : "We couldn't generate ideas right now. Please try again or check your API key.";
      
      setErrorMsg(message);
      setAppState(AppState.ERROR);
    }
  };

  const saveToLocalHistory = (profile: RecipientProfile, ideas: GiftIdea[]) => {
      try {
          const history = JSON.parse(localStorage.getItem('gift_history') || '[]');
          const newItem = {
              date: new Date().toISOString(),
              profile,
              ideas
          };
          // Keep last 10 items
          const fixedHistory = [newItem, ...history].slice(0, 10);
          localStorage.setItem('gift_history', JSON.stringify(fixedHistory));
          setHistoryItems(fixedHistory);
      } catch (e) {
          console.warn("Failed to save history to local storage");
      }
  };
  
  const handleClearHistory = () => {
      localStorage.removeItem('gift_history');
      setHistoryItems([]);
      setShowHistory(false);
  };
  
  const handleRestoreHistoryItem = (item: any) => {
      setCurrentProfile(item.profile);
      setGiftIdeas(item.ideas);
      setAppState(AppState.SUCCESS);
  };

  const handleReset = () => {
    // Return to IDLE (Form) state when resetting from results
    setAppState(AppState.IDLE);
    setGiftIdeas([]);
    setCurrentProfile(null);
    setErrorMsg(null);
    setShowErrorDetails(false);
  };

  const isParsingError = errorMsg?.includes('PARSING_ERROR');
  const isKeyMissing = errorMsg?.includes('API_KEY_MISSING') || errorMsg?.includes('Access Denied');

  return (
    <div className="min-h-screen bg-joy-bg text-joy-text font-sans selection:bg-joy-accent selection:text-white flex justify-center transition-colors duration-500">
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative">
        
        <Header onOpenHistory={() => setShowHistory(true)} />
        
        <HistoryModal 
            isOpen={showHistory} 
            onClose={() => setShowHistory(false)}
            history={historyItems}
            onSelect={handleRestoreHistoryItem}
            onClear={handleClearHistory}
        />

        <main className="flex-grow flex flex-col px-6 pb-12 pt-4">
            
            {appState === AppState.LANDING && (
                <LandingPage onStart={() => setAppState(AppState.IDLE)} />
            )}
            
            {appState === AppState.IDLE && (
                <GiftForm onSubmit={handleFormSubmit} isLoading={false} />
            )}

            {appState === AppState.LOADING && (
                <Loading />
            )}

            {appState === AppState.ERROR && (
                 <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                    <div className="bg-white border border-red-100 shadow-xl shadow-red-50 rounded-3xl p-8 max-w-sm w-full text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                         {isKeyMissing ? <Key size={24} /> : <AlertCircle size={24} />}
                      </div>
                      
                      <h3 className="font-serif text-xl mb-2 text-joy-text">
                        {isKeyMissing ? "API Key Needed" : (isParsingError ? "Formatting Issue" : "Oops!")}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {isKeyMissing
                          ? "We need your Gemini API Key to generate gift ideas. Please ensure it is configured in your environment."
                          : (isParsingError 
                             ? "The AI generated a response that was too complex or malformed. Please try again." 
                             : (showErrorDetails ? 'See technical details below.' : (errorMsg || 'We encountered an issue.')))
                        }
                      </p>

                      <button 
                        onClick={() => setAppState(AppState.IDLE)}
                        className="bg-joy-accent text-white px-8 py-3 rounded-full font-medium hover:bg-red-600 transition-colors w-full mb-4 shadow-lg shadow-red-200"
                      >
                        Try Again
                      </button>

                      {isParsingError && (
                        <a 
                            href={`mailto:support@thoughtful.app?subject=Report: Parsing Error&body=Error Details: ${encodeURIComponent(errorMsg || '')}`}
                            className="block text-xs text-gray-400 hover:text-joy-accent underline decoration-gray-300 underline-offset-4 mb-4 transition-colors"
                        >
                            Report this issue
                        </a>
                      )}

                      {!isKeyMissing && (
                          <button 
                            onClick={() => setShowErrorDetails(!showErrorDetails)}
                            className="flex items-center justify-center gap-1 w-full text-xs text-gray-400 hover:text-joy-accent transition-colors uppercase tracking-wider font-medium"
                          >
                             {showErrorDetails ? 'Hide Details' : 'View Details'}
                             {showErrorDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                      )}

                      {showErrorDetails && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-left overflow-hidden">
                            <p className="font-mono text-[10px] text-red-500 break-words leading-relaxed">
                                {errorMsg}
                            </p>
                        </div>
                      )}
                    </div>
                 </div>
            )}

            {appState === AppState.SUCCESS && (
              <GiftResults 
                gifts={giftIdeas} 
                onReset={handleReset} 
                profile={currentProfile}
              />
            )}
            
        </main>
      </div>
    </div>
  );
};

export default App;