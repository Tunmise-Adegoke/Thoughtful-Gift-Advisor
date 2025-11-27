import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { GiftForm } from './components/GiftForm';
import { GiftResults } from './components/GiftResults';
import { Loading } from './components/Loading';
import { generateGiftIdeas } from './services/geminiService';
import { GiftIdea, RecipientProfile, AppState } from './types';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const App: React.FC = () => {
  // Start at LANDING page
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const handleFormSubmit = async (profile: RecipientProfile) => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    setShowErrorDetails(false);
    
    try {
      const ideas = await generateGiftIdeas(profile);
      setGiftIdeas(ideas);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      const message = error instanceof Error 
        ? error.message 
        : "We couldn't generate ideas right now. Please try again or check your API key.";
      
      setErrorMsg(message);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    // Return to IDLE (Form) state when resetting from results
    setAppState(AppState.IDLE);
    setGiftIdeas([]);
    setErrorMsg(null);
    setShowErrorDetails(false);
  };

  const isParsingError = errorMsg?.includes('PARSING_ERROR');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex justify-center">
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative">
        
        <Header />

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
                    <div className="bg-[#111] border border-red-900/30 rounded-3xl p-8 max-w-sm w-full text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/20 text-red-500 mb-4">
                         <AlertCircle size={24} />
                      </div>
                      
                      <h3 className="font-serif text-xl mb-2 text-white">
                        {isParsingError ? "Formatting Issue" : "Something went wrong"}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {isParsingError 
                           ? "The AI generated a response that was too complex or malformed to read. This usually happens if the generated text is too long." 
                           : (showErrorDetails ? 'See technical details below.' : 'We encountered an issue while generating your gift ideas.')}
                      </p>
                      
                      <button 
                        onClick={() => setAppState(AppState.IDLE)}
                        className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors w-full mb-4"
                      >
                        Try Again
                      </button>

                      {isParsingError && (
                        <a 
                            href={`mailto:support@thoughtful.app?subject=Report: Parsing Error&body=Error Details: ${encodeURIComponent(errorMsg || '')}`}
                            className="block text-xs text-gray-500 hover:text-white underline decoration-gray-700 underline-offset-4 mb-4 transition-colors"
                        >
                            Report this issue
                        </a>
                      )}

                      <button 
                        onClick={() => setShowErrorDetails(!showErrorDetails)}
                        className="flex items-center justify-center gap-1 w-full text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider font-medium"
                      >
                         {showErrorDetails ? 'Hide Details' : 'View Details'}
                         {showErrorDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {showErrorDetails && (
                        <div className="mt-4 p-3 bg-black border border-gray-800 rounded-lg text-left overflow-hidden">
                            <p className="font-mono text-[10px] text-red-400 break-words leading-relaxed">
                                {errorMsg}
                            </p>
                        </div>
                      )}
                    </div>
                 </div>
            )}

            {appState === AppState.SUCCESS && (
              <GiftResults gifts={giftIdeas} onReset={handleReset} />
            )}
            
        </main>
      </div>
    </div>
  );
};

export default App;