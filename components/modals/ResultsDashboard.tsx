
import React from 'react';
import { X, CheckCircle2, AlertTriangle, ListChecks, BrainCircuit, Activity } from 'lucide-react';
import { Suggestion, StructuralAnalysisSection, CitationAnalysis, MethodologyAnalysis } from '../../types';
import ScoreGauge from '../ui/ScoreGauge';

interface ResultsDashboardProps {
    onClose: () => void;
    suggestions: Suggestion[];
    structuralAnalysis: StructuralAnalysisSection[];
    citationAnalysis: CitationAnalysis | null;
    methodologyAnalysis: MethodologyAnalysis | null;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
    onClose, suggestions, structuralAnalysis, citationAnalysis, methodologyAnalysis
}) => {

    const avgStructureScore = structuralAnalysis.length > 0
        ? Math.round(structuralAnalysis.reduce((acc, s) => acc + s.section_score, 0) / structuralAnalysis.length)
        : 0;

    const totalScore = Math.round(
      ( (suggestions.length > 0 ? (100 - suggestions.length*2) : 100) + // Arbitrary penalty for suggestions
        avgStructureScore +
        (methodologyAnalysis?.puntaje_general || 0)
      ) / 3
    );

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 text-gray-200 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Resultados Preliminares</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
                        <ScoreGauge score={totalScore > 0 ? totalScore : 0} />
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-semibold text-white">Puntaje General Estimado</h3>
                            <p className="text-gray-400">
                                Un resumen de la calidad general del documento basado en todos los análisis.
                            </p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-purple-400"><ListChecks/>Revisión de Estilo</h4>
                            <p><span className="font-bold text-2xl">{suggestions.length}</span> sugerencias encontradas.</p>
                        </div>
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-indigo-400"><BrainCircuit/>Análisis Estructural</h4>
                            <p><span className="font-bold text-2xl">{avgStructureScore}</span> puntaje promedio de sección.</p>
                        </div>
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-teal-400"><Activity/>Verificación de Citas</h4>
                            <p><span className="font-bold text-2xl">{citationAnalysis ? citationAnalysis.formatting_errors.length + citationAnalysis.missing_references.length + citationAnalysis.uncited_references.length : 0}</span> problemas totales.</p>
                        </div>
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-400"><ListChecks/>Comprobación Metodológica</h4>
                            <p><span className="font-bold text-2xl">{methodologyAnalysis?.puntaje_general || 0}</span> puntaje de coherencia.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResultsDashboard;

