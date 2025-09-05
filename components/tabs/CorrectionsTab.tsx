
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Suggestion, Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface CorrectionsTabProps {
    suggestions: Suggestion[];
    applySuggestion: (suggestion: Suggestion) => void;
    applyAllSuggestions: () => void;
}

const getCategoryUIData = (catId: string): Partial<Category> => 
    CATEGORIES.find(c => c.id === catId.toLowerCase()) || {};

const getSubCategoryLabel = (subCatId: string): string => {
    for (const cat of CATEGORIES) {
        if (cat.subcategories) {
            const subcat = cat.subcategories.find(sc => sc.id === subCatId.toLowerCase());
            if (subcat) return subcat.label;
        }
    }
    return subCatId.charAt(0).toUpperCase() + subCatId.slice(1);
};


const CorrectionsTab: React.FC<CorrectionsTabProps> = ({ suggestions, applySuggestion, applyAllSuggestions }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    
    const handleCategoryClick = (catId: string) => {
        setActiveCategory(catId);
        setActiveSubCategory(null);
        setExpandedCategory(expandedCategory === catId ? null : catId);
    };

    const handleSubCategoryClick = (e: React.MouseEvent, subId: string) => {
        e.stopPropagation();
        setActiveSubCategory(subId);
        setActiveCategory(CATEGORIES.find(c => c.subcategories?.some(s => s.id === subId))?.id || 'all');
    };

    const filteredSuggestions = suggestions.filter(s => {
        if (activeCategory === 'all') return true;
        if (activeSubCategory) return s.subcategory.toLowerCase() === activeSubCategory;
        return s.category.toLowerCase() === activeCategory;
    });

    if (suggestions.length === 0) {
        return <div className="text-center text-gray-400 py-10">No hay sugerencias. ¡El texto parece estar bien o puedes ejecutar un análisis!</div>;
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <div key={cat.id}>
                            <button onClick={() => handleCategoryClick(cat.id)} className={`px-3 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all ${activeCategory === cat.id && !activeSubCategory ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''} ${cat.color} text-white`}>
                                {cat.label}
                                {cat.subcategories && <ChevronDown size={14} className={`transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />}
                            </button>
                            {expandedCategory === cat.id && cat.subcategories && (
                                <div className="mt-2 flex flex-col items-start pl-2">
                                    {cat.subcategories.map(sub => (
                                        <button key={sub.id} onClick={(e) => handleSubCategoryClick(e, sub.id)} className={`text-xs py-0.5 px-2 rounded ${activeSubCategory === sub.id ? 'bg-gray-600 font-bold' : 'bg-transparent'} text-gray-300 hover:bg-gray-700`}>
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                 <button onClick={applyAllSuggestions} disabled={filteredSuggestions.length === 0} className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                    <Check size={16}/> Aplicar Todo
                </button>
            </div>
            
            <div className="space-y-3">
                {filteredSuggestions.map((s, index) => {
                    const categoryUI = getCategoryUIData(s.category);
                    return (
                        <div key={index} className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                            <div className="flex items-center gap-2 text-xs mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-white ${categoryUI.color}`}>{categoryUI.label}</span>
                                <span className="text-gray-400">&gt;</span>
                                <span className="text-gray-300">{getSubCategoryLabel(s.subcategory)}</span>
                            </div>
                            <p className="text-sm text-gray-400 line-through">"{s.issue}"</p>
                            <p className="text-sm text-green-400">"{s.suggestion}"</p>
                            <p className="text-xs text-gray-500 mt-2">{s.explanation}</p>
                            <button onClick={() => applySuggestion(s)} className="mt-3 text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                                Aplicar esta sugerencia
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CorrectionsTab;
