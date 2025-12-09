import React, { useState, useEffect } from 'react';
import { RecipientProfile } from '../types';
import { ArrowRight, ArrowLeft, HelpCircle, Check } from 'lucide-react';

interface GiftFormProps {
  onSubmit: (profile: RecipientProfile) => void;
  isLoading: boolean;
}

const AGE_GROUPS = [
  'Baby (0-12m)',
  'Toddler (1-3y)',
  'Child (4-9y)',
  'Pre-teen (10-12y)',
  'Teen (13-17y)',
  'Young Adult (18-25y)',
  'Adult (26-49y)',
  'Senior (50+y)'
];

const GENDERS = ['Female', 'Male', 'Non-binary'];
const RELATIONSHIPS = ['Family', 'Parent', 'Friend', 'Sibling', 'Colleague', 'Spouse', 'Child', 'Other'];
const OCCASIONS = [
  'Birthday', 
  'Christmas',
  'Holiday', 
  'Anniversary', 
  "Valentine's",
  'Wedding', 
  "Mother's Day",
  "Father's Day",
  'Graduation', 
  'Retirement', 
  'Eid',
  'Diwali',
  'Hanukkah',
  'Easter',
  'Thanksgiving',
  'Halloween',
  'New Year',
  'Expecting Parents',
  'New Job',
  'Housewarming', 
  'Just Because'
];
const TASTES = [
  'Luxury', 
  'Minimalist', 
  'Tech/Gadget', 
  'Gaming',
  'Fitness',
  'Fashion',
  'Reading',
  'Travel',
  'Music',
  'Outdoors',
  'Arts & Crafts',
  'DIY/Handmade', 
  'Practical', 
  'Sentimental', 
  'Fun/Quirky', 
  'Eco-friendly',
  'Vintage',
  'Bohemian',
  'Artistic',
  'Foodie'
];

type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'CAD';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string, min: number, max: number, step: number, default: number, quick: number[] }> = {
  'NGN': { 
    symbol: '₦', 
    min: 5000, 
    max: 1000000, 
    step: 5000, 
    default: 50000,
    quick: [10000, 50000, 200000]
  },
  'USD': { 
    symbol: '$', 
    min: 20, 
    max: 2000, 
    step: 10, 
    default: 100,
    quick: [50, 150, 500]
  },
  'EUR': { 
    symbol: '€', 
    min: 20, 
    max: 2000, 
    step: 10, 
    default: 100,
    quick: [50, 150, 500]
  },
  'GBP': { 
    symbol: '£', 
    min: 20, 
    max: 2000, 
    step: 10, 
    default: 100,
    quick: [50, 150, 500]
  },
  'CAD': { 
    symbol: 'C$', 
    min: 20, 
    max: 2000, 
    step: 10, 
    default: 100,
    quick: [50, 150, 500]
  }
};

interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ 
  label, 
  selected, 
  onClick,
  className = ''
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
      selected 
        ? 'bg-joy-accent text-white border-transparent shadow-md transform scale-105' 
        : 'bg-white text-gray-600 border border-gray-200 hover:border-joy-accent hover:text-joy-accent'
    } ${className}`}
  >
    {label}
  </button>
);

export const GiftForm: React.FC<GiftFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Currency State
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');
  
  // Local state for the slider value (numeric)
  const [budgetAmount, setBudgetAmount] = useState<number>(CURRENCY_CONFIG['NGN'].default);

  const [formData, setFormData] = useState<RecipientProfile>({
    relation: '',
    customRelation: '',
    age: '',
    gender: '',
    interests: '',
    occasion: '',
    budget: '',
    currency: 'NGN',
    taste: '',
    exclusions: '',
    isAcquaintance: false
  });

  // Sync the slider value to the formData string whenever it changes
  useEffect(() => {
    const config = CURRENCY_CONFIG[currency];
    const formattedBudget = `Around ${config.symbol}${budgetAmount.toLocaleString()}`;
    setFormData(prev => ({ ...prev, budget: formattedBudget, currency: currency }));
  }, [budgetAmount, currency]);

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    // Reset budget amount to the default for the new currency to avoid out-of-range values
    setBudgetAmount(CURRENCY_CONFIG[newCurrency].default);
  };

  const handleChange = (field: keyof RecipientProfile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTaste = (taste: string) => {
    const currentTastes = formData.taste ? formData.taste.split(', ').filter(t => t) : [];
    if (currentTastes.includes(taste)) {
      const newTastes = currentTastes.filter(t => t !== taste);
      handleChange('taste', newTastes.join(', '));
    } else {
      const newTastes = [...currentTastes, taste];
      handleChange('taste', newTastes.join(', '));
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (val: number, curr: CurrencyCode) => {
    // Simple formatter for display
    const config = CURRENCY_CONFIG[curr];
    return `${config.symbol}${val.toLocaleString()}`;
  };

  const formatShortCurrency = (val: number, curr: CurrencyCode) => {
    const config = CURRENCY_CONFIG[curr];
    if (val >= 1000000) return `${config.symbol}${(val/1000000).toFixed(0)}M`;
    if (val >= 1000) return `${config.symbol}${(val/1000).toFixed(0)}k`;
    return `${config.symbol}${val}`;
  };

  // Helper to check if current step is valid to proceed
  const isStepValid = () => {
    switch (step) {
      case 1: 
        // Validate Age, Gender, and Relationship
        const basicValid = formData.age.trim() !== '' && formData.gender !== '';
        if (formData.relation === 'Other') {
            return basicValid && (formData.customRelation?.trim() || '').length > 0;
        }
        return basicValid && formData.relation !== '';
      case 2: return formData.occasion !== '' && formData.taste !== '';
      case 3: return budgetAmount > 0; // Valid as long as there is a value
      case 4: return formData.interests.trim() !== '';
      default: return false;
    }
  };

  const currentConfig = CURRENCY_CONFIG[currency];

  return (
    <div className="w-full max-w-lg mx-auto min-h-[500px] flex flex-col">
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10 px-1">
         <span className="text-[10px] font-bold tracking-widest text-joy-muted uppercase">Step {step}/{totalSteps}</span>
         <div className="flex-1 h-[2px] bg-gray-200 rounded-full">
            <div 
                className="h-full bg-joy-accent rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,90,95,0.5)]" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
            />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        
        {/* Step 1: Who & Relation */}
        {step === 1 && (
          <div className="flex-1 animate-slide-up space-y-8">
            <div className="space-y-4">
                <h2 className="font-serif text-4xl text-joy-text leading-tight">First things first,<br/>tell us about them.</h2>
                
                <div className="space-y-3">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Age Group</p>
                    <div className="flex flex-wrap gap-2">
                        {AGE_GROUPS.map(age => (
                            <Pill
                                key={age}
                                label={age}
                                selected={formData.age === age}
                                onClick={() => handleChange('age', age)}
                                className="px-4 py-2 text-xs"
                            />
                        ))}
                    </div>
                    <input
                        type="text"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        placeholder="Or type specific age (e.g. 25)..."
                        className="w-full bg-transparent border-b border-gray-300 py-2 text-sm text-joy-text placeholder-gray-400 focus:outline-none focus:border-joy-accent transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Gender</p>
                <div className="flex flex-wrap gap-3">
                    {GENDERS.map(g => (
                        <Pill 
                            key={g} 
                            label={g} 
                            selected={formData.gender === g}
                            onClick={() => handleChange('gender', g)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Relationship to you</p>
                <div className="flex flex-wrap gap-3">
                    {RELATIONSHIPS.map(rel => (
                        <Pill 
                            key={rel} 
                            label={rel} 
                            selected={formData.relation === rel}
                            onClick={() => handleChange('relation', rel)}
                        />
                    ))}
                </div>
                
                {/* Custom Relationship Input */}
                {formData.relation === 'Other' && (
                    <div className="animate-fade-in pt-2">
                        <input
                            type="text"
                            value={formData.customRelation}
                            onChange={(e) => handleChange('customRelation', e.target.value)}
                            placeholder="Please specify relationship..."
                            className="w-full bg-transparent border-b border-gray-300 py-2 text-lg text-joy-text placeholder-gray-400 focus:outline-none focus:border-joy-accent transition-colors"
                        />
                    </div>
                )}
            </div>

            {/* Acquaintance Toggle */}
            <div 
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    formData.isAcquaintance 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => handleChange('isAcquaintance', !formData.isAcquaintance)}
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData.isAcquaintance ? 'bg-blue-500 border-blue-500' : 'border-gray-400 bg-white'
                }`}>
                    {formData.isAcquaintance && <Check size={14} className="text-white" />}
                </div>
                <div>
                    <span className="block text-sm font-semibold text-joy-text">I don't know them very well</span>
                    <span className="block text-xs text-gray-500">We'll suggest safer, crowd-pleasing options.</span>
                </div>
            </div>

          </div>
        )}

        {/* Step 2: Occasion & Taste */}
        {step === 2 && (
          <div className="flex-1 animate-slide-up space-y-10">
            <div className="space-y-4">
                <h2 className="font-serif text-4xl text-joy-text leading-tight">What's the<br/>occasion?</h2>
                <div className="flex flex-wrap gap-3">
                    {OCCASIONS.map(occ => (
                        <Pill 
                            key={occ} 
                            label={occ} 
                            selected={formData.occasion === occ}
                            onClick={() => handleChange('occasion', occ)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    {formData.isAcquaintance ? "What is their general vibe?" : "What's their vibe/taste?"} 
                    <span className="text-joy-accent lowercase"> (Select all that apply)</span>
                </p>
                <div className="flex flex-wrap gap-3">
                    {TASTES.map(taste => (
                        <Pill 
                            key={taste} 
                            label={taste} 
                            selected={formData.taste.split(', ').includes(taste)}
                            onClick={() => toggleTaste(taste)}
                        />
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget (Slider) */}
        {step === 3 && (
          <div className="flex-1 animate-slide-up space-y-12">
            <div className="space-y-2">
                <h2 className="font-serif text-4xl text-joy-text leading-tight">What is your<br/>budget?</h2>
                <p className="text-gray-500 text-sm">Select currency and set a target price.</p>
            </div>

            {/* Currency Selector */}
            <div className="flex gap-2 justify-center">
                {(['NGN', 'USD', 'EUR', 'GBP', 'CAD'] as CurrencyCode[]).map(c => (
                     <button
                        key={c}
                        type="button"
                        onClick={() => handleCurrencyChange(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 border shadow-sm ${
                            currency === c
                            ? 'bg-joy-accent text-white border-transparent shadow-md' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-joy-accent hover:text-joy-accent'
                        }`}
                     >
                        {c}
                     </button>
                ))}
            </div>
            
            <div className="py-4">
                <div className="text-center mb-8">
                    <span className="text-5xl font-serif text-joy-text tracking-tight">
                        {formatCurrency(budgetAmount, currency)}
                    </span>
                    <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-medium">Target Amount ({currency})</p>
                </div>

                <div className="relative w-full h-10 flex items-center">
                    <input 
                        type="range" 
                        min={currentConfig.min}
                        max={currentConfig.max}
                        step={currentConfig.step}
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
                        className="w-full z-20"
                    />
                </div>

                <div className="flex justify-between text-gray-400 text-xs font-medium uppercase tracking-widest mt-2">
                    <span>{formatShortCurrency(currentConfig.min, currency)}</span>
                    <span>{formatShortCurrency(currentConfig.max, currency)}+</span>
                </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex justify-center gap-3">
                 {currentConfig.quick.map((amt, idx) => (
                    <button 
                        key={amt} 
                        type="button" 
                        onClick={() => setBudgetAmount(amt)} 
                        className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-500 text-xs hover:border-joy-accent hover:text-joy-accent transition-colors shadow-sm"
                    >
                        {idx === 0 ? 'Low' : idx === 1 ? 'Mid' : 'High'} ({formatShortCurrency(amt, currency)})
                    </button>
                 ))}
            </div>
          </div>
        )}

        {/* Step 4: Interests & Exclusions */}
        {step === 4 && (
          <div className="flex-1 animate-slide-up space-y-8">
             <div className="space-y-2">
                <h2 className="font-serif text-4xl text-joy-text leading-tight">
                    {formData.isAcquaintance ? "Help us narrow it down." : "Finally, tell us what they love."}
                </h2>
                <p className="text-gray-500 text-sm">
                    {formData.isAcquaintance 
                        ? "Since you don't know them well, tell us their job title, or general personality." 
                        : "Hobbies, specific obsessions, favorite shows, etc."}
                </p>
             </div>

             <textarea
                value={formData.interests}
                onChange={(e) => handleChange('interests', e.target.value)}
                placeholder={formData.isAcquaintance 
                    ? "e.g. They work in Marketing, they are a busy dad, they just moved into a new apartment..." 
                    : "e.g. They love cooking Italian food, watching Sci-Fi movies, and collecting vintage vinyls..."
                }
                className="w-full h-32 bg-white border border-gray-200 rounded-2xl p-5 text-lg text-joy-text placeholder-gray-400 focus:outline-none focus:border-joy-accent focus:ring-1 focus:ring-joy-accent transition-all resize-none shadow-sm"
             />

             <div className="space-y-2 pt-2">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Any deal-breakers? (Optional)</p>
                <input
                    type="text"
                    value={formData.exclusions}
                    onChange={(e) => handleChange('exclusions', e.target.value)}
                    placeholder="e.g. No alcohol, avoid clothing, no plastic..."
                    className="w-full bg-transparent border-b border-gray-300 py-3 text-lg text-joy-text placeholder-gray-400 focus:outline-none focus:border-joy-accent transition-colors"
                />
             </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
           {step > 1 ? (
             <button 
                type="button" 
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-joy-text transition-colors px-2 py-2"
             >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
             </button>
           ) : (
             <div></div> 
           )}

           {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-3 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                    isStepValid() 
                    ? 'bg-joy-accent text-white hover:bg-red-500 hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight size={18} />
              </button>
           ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isLoading}
                className={`flex items-center gap-3 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                    (isStepValid() && !isLoading)
                    ? 'bg-joy-accent text-white hover:bg-red-500 hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{isLoading ? 'Thinking...' : 'Find Gifts'}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
           )}
        </div>

      </form>
    </div>
  );
};