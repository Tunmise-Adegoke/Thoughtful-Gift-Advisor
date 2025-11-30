import React from 'react';
import { X, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { GiftIdea, RecipientProfile } from '../types';

interface HistoryItem {
    date: string;
    profile: RecipientProfile;
    ideas: GiftIdea[];
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-joy-bg">
                    <div className="flex items-center gap-2 text-joy-text">
                        <Clock size={20} className="text-joy-accent" />
                        <h2 className="font-serif text-xl font-bold">Recent Finds</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No recent searches yet.</p>
                            <p className="text-xs mt-2 uppercase tracking-widest">Start gifting!</p>
                        </div>
                    ) : (
                        history.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                                className="w-full text-left bg-white border border-gray-100 hover:border-joy-accent/50 hover:shadow-md p-4 rounded-2xl transition-all group group-hover:bg-orange-50"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-serif font-bold text-joy-text text-lg">
                                        {item.profile.relation}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-3">
                                    For {item.profile.occasion} • {item.profile.budget}
                                </div>
                                <div className="flex items-center text-xs font-bold text-joy-accent uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                                    View Ideas <ArrowRight size={12} />
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <button 
                            onClick={onClear}
                            className="flex items-center justify-center gap-2 w-full text-gray-400 hover:text-red-500 text-xs font-medium uppercase tracking-widest transition-colors py-2"
                        >
                            <Trash2 size={14} />
                            Clear History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
