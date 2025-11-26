import React, { useState, useEffect } from 'react';
import { RecipientProfile } from '../types';
import { ArrowRight, ArrowLeft, Check, Minus, Plus } from 'lucide-react';

interface GiftFormProps {
  onSubmit: (profile: RecipientProfile) => void;
  isLoading: boolean;
}

const RELATIONSHIPS = ['Family', 'Parent', 'Friend', 'Sibling', 'Colleague', 'Spouse', 'Child', 'Other'];
const OCCASIONS = [
  'Birthday', 
  'Holiday', 
  'Anniversary', 
  'Wedding', 
  'Graduation', 
  'Retirement', 
  'Expecting Parents',
  'New Job',
  'Housewarming', 
  'Just Because', 
  "Valentine's"
];
const TASTES = [
  'Luxury', 
  'Minimalist', 
  'DIY/Handmade', 
  'Tech/Gadget', 
  'Practical', 
  'Sentimental', 
  'Fun/Quirky', 
  'Eco-friendly',
  'Vintage',
  'Bohemian',
  'Artistic',
  'Foodie'
];

interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ 
  label, 
  selected, 
  onClick 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
      selected 
        ? 'bg-white text-black border-white' 
        : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export const GiftForm: React.FC<GiftFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Local state for the slider value (numeric)
  const [budgetAmount, setBudgetAmount] = useState<number>(25000);

  const [formData, setFormData] = useState<RecipientProfile>({
    relation: '',
    customRelation: '',
    age: '',
    interests: '',
    occasion: '',
    budget: '',
    taste: '',
    exclusions: ''
  });

  // Sync the slider value to the formData string whenever it changes
  useEffect(() => {
    const formattedBudget = `Around ₦${budgetAmount.toLocaleString()}`;
    setFormData(prev => ({ ...prev, budget: formattedBudget }));
  }, [budgetAmount]);

  const handleChange = (field: keyof RecipientProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  // Helper to check if current step is valid to proceed
  const isStepValid = () => {
    switch (step) {
      case 1: 
        if (formData.relation === 'Other') {
            return formData.age.trim() !== '' && (formData.customRelation?.trim() || '').length > 0;
        }
        return formData.age.trim() !== '' && formData.relation !== '';
      case 2: return formData.occasion !== '' && formData.taste !== '';
      case 3: return budgetAmount > 0; // Valid as long as there is a value
      case 4: return formData.interests.trim() !== '';
      default: return false;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-[500px] flex flex-col">
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10 px-1">
         <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Step {step}/{totalSteps}</span>
         <div className="flex-1 h-[1px] bg-gray-900">
            <div 
                className="h-full bg-white transition-all duration-500 ease-out" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
            />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        
        {/* Step 1: Who & Relation */}
        {step === 1 && (
          <div className="flex-1 animate-slide-up space-y-10">
            <div className="space-y-4">
                <h2 className="font-serif text-4xl text-white leading-tight">First things first,<br/>who is this for?</h2>
                <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. My 25 year old sister..."
                    className="w-full bg-transparent border-b border-gray-800 py-4 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                    autoFocus
                />
            </div>

            <div className="space-y-4">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Relationship to you</p>
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
                            className="w-full bg-transparent border-b border-gray-800 py-2 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                            autoFocus
                        />
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Step 2: Occasion & Taste */}
        {step === 2 && (
          <div className="flex-1 animate-slide-up space-y-10">
            <div className="space-y-4">
                <h2 className="font-serif text-4xl text-white leading-tight">What's the<br/>occasion?</h2>
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
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">What's their vibe/taste?</p>
                <div className="flex flex-wrap gap-3">
                    {TASTES.map(taste => (
                        <Pill 
                            key={taste} 
                            label={taste} 
                            selected={formData.taste === taste}
                            onClick={() => handleChange('taste', taste)}
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
                <h2 className="font-serif text-4xl text-white leading-tight">What is your<br/>budget?</h2>
                <p className="text-gray-500 text-sm">Use the slider to set a target price.</p>
            </div>
            
            <div className="py-8">
                <div className="text-center mb-8">
                    <span className="text-5xl font-serif text-white tracking-tight">
                        {formatCurrency(budgetAmount)}
                    </span>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-medium">Target Amount</p>
                </div>

                <div className="relative w-full h-10 flex items-center">
                    <input 
                        type="range" 
                        min="5000" 
                        max="500000" 
                        step="5000"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
                        className="w-full z-20"
                    />
                    {/* Visual Track Overlay for better customization potential if needed, though CSS covers basics */}
                </div>

                <div className="flex justify-between text-gray-600 text-xs font-medium uppercase tracking-widest mt-2">
                    <span>₦5k</span>
                    <span>₦500k+</span>
                </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex justify-center gap-3">
                 <button type="button" onClick={() => setBudgetAmount(10000)} className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 text-xs hover:text-white hover:border-gray-600 transition-colors">Low (10k)</button>
                 <button type="button" onClick={() => setBudgetAmount(50000)} className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 text-xs hover:text-white hover:border-gray-600 transition-colors">Mid (50k)</button>
                 <button type="button" onClick={() => setBudgetAmount(150000)} className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 text-xs hover:text-white hover:border-gray-600 transition-colors">High (150k)</button>
            </div>
          </div>
        )}

        {/* Step 4: Interests & Exclusions */}
        {step === 4 && (
          <div className="flex-1 animate-slide-up space-y-8">
             <div className="space-y-2">
                <h2 className="font-serif text-4xl text-white leading-tight">Finally,<br/>tell us what they love.</h2>
                <p className="text-gray-500 text-sm">Hobbies, specific obsessions, favorite shows, etc.</p>
             </div>

             <textarea
                value={formData.interests}
                onChange={(e) => handleChange('interests', e.target.value)}
                placeholder="e.g. They love cooking Italian food, watching Sci-Fi movies, and collecting vintage vinyls..."
                className="w-full h-32 bg-[#111] border border-gray-800 rounded-2xl p-5 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors resize-none"
             />

             <div className="space-y-2 pt-2">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Any deal-breakers? (Optional)</p>
                <input
                    type="text"
                    value={formData.exclusions}
                    onChange={(e) => handleChange('exclusions', e.target.value)}
                    placeholder="e.g. No alcohol, avoid clothing, no plastic..."
                    className="w-full bg-transparent border-b border-gray-800 py-3 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                />
             </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-900">
           {step > 1 ? (
             <button 
                type="button" 
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors px-2 py-2"
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
                className={`flex items-center gap-3 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                    isStepValid() 
                    ? 'bg-white text-black hover:scale-105' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight size={18} />
              </button>
           ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isLoading}
                className={`flex items-center gap-3 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                    (isStepValid() && !isLoading)
                    ? 'bg-white text-black hover:scale-105' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
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