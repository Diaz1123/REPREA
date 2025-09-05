
import React from 'react';
import { CitationAnalysis } from '../../types';
import { AlertTriangle, BookCopy, Link2Off } from 'lucide-react';

interface CitationsTabProps {
    analysis: CitationAnalysis | null;
}

const CitationsTab: React.FC<CitationsTabProps> = ({ analysis }) => {
    if (!analysis) {
        return <div className="text-center text-gray-400 py-10">No hay análisis de citas disponible.</div>;
    }

    const { formatting_errors, uncited_references, missing_references } = analysis;
    const hasIssues = formatting_errors.length > 0 || uncited_references.length > 0 || missing_references.length > 0;

    return (
        <div className="space-y-6">
            {!hasIssues ? (
                <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 text-center text-green-400">
                    ¡Excelente! No se encontraron problemas en las citas.
                </div>
            ) : (
                <>
                    {formatting_errors.length > 0 && (
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-400 mb-3"><AlertTriangle size={20} /> Errores de Formato</h3>
                            <ul className="space-y-2 list-disc list-inside text-gray-300">
                                {formatting_errors.map((err, i) => (
                                    <li key={i}><span className="font-semibold">{err.location}:</span> {err.issue}. <span className="text-green-400">Sugerencia: {err.suggestion}</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {uncited_references.length > 0 && (
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-3"><Link2Off size={20} /> Referencias no Citadas</h3>
                            <p className="text-sm text-gray-400 mb-2">Las siguientes referencias están en la bibliografía pero no se citan en el texto:</p>
                            <ul className="space-y-1 list-disc list-inside text-gray-300">
                                {uncited_references.map((ref, i) => <li key={i}>{ref}</li>)}
                            </ul>
                        </div>
                    )}
                    {missing_references.length > 0 && (
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-3"><BookCopy size={20} /> Citas sin Referencia</h3>
                            <p className="text-sm text-gray-400 mb-2">Las siguientes citas aparecen en el texto pero faltan en la bibliografía:</p>
                            <ul className="space-y-1 list-disc list-inside text-gray-300">
                                {missing_references.map((ref, i) => <li key={i}>{ref}</li>)}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CitationsTab;
