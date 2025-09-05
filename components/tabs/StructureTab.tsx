
import React from 'react';
import { StructuralAnalysisSection } from '../../types';
import ProgressBar from '../ui/ProgressBar';
import ChecklistIcon from '../ui/ChecklistIcon';

interface StructureTabProps {
    analysis: StructuralAnalysisSection[];
}

const StructureTab: React.FC<StructureTabProps> = ({ analysis }) => {
    if (!analysis || analysis.length === 0) {
        return <div className="text-center text-gray-400 py-10">No hay análisis estructural disponible.</div>;
    }
    
    return (
        <div className="space-y-6">
            {analysis.map((section, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-indigo-400">{section.section_name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{section.section_score}/100</span>
                            <div className="w-24">
                                <ProgressBar score={section.section_score} />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 italic mb-4">"{section.general_comment}"</p>
                    <div className="space-y-2">
                        <h4 className="font-bold text-sm text-gray-300">Checklist de Calidad:</h4>
                        {section.checklist.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-3 items-start p-2 rounded-md bg-gray-800/50">
                                <ChecklistIcon status={item.status} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">{item.item_description}</p>
                                    {(item.status === 'parcial' || item.status === 'no_encontrado') && (
                                         <p className="text-xs text-yellow-400 mt-1">
                                            <span className="font-semibold">Sugerencia:</span> {item.suggestion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StructureTab;
