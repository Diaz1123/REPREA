import React from 'react';
import { X, Award, FileCheck, FileX2, ListChecks, BrainCircuit, Activity, BookOpenCheck, ClipboardList } from 'lucide-react';
import { Suggestion, StructuralAnalysisSection, CitationAnalysis, MethodologyAnalysis, ExpertReview } from '../../types.ts';

interface ResultsDashboardProps {
    onClose: () => void;
    suggestions: Suggestion[];
    structuralAnalysis: StructuralAnalysisSection[];
    citationAnalysis: CitationAnalysis | null;
    methodologyAnalysis: MethodologyAnalysis | null;
    expertReview: ExpertReview | null;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
    onClose, suggestions, structuralAnalysis, citationAnalysis, methodologyAnalysis, expertReview
}) => {

    const avgStructureScore = structuralAnalysis.length > 0
        ? Math.round(structuralAnalysis.reduce((acc, s) => acc + s.section_score, 0) / structuralAnalysis.length)
        : 0;
    
    const getVerdictUI = () => {
        if (!expertReview) {
            return {
                icon: <Activity className="w-16 h-16 text-gray-500" />,
                title: "Analizando...",
                description: "El editor experto está evaluando los resultados.",
                bgColor: "bg-gray-700"
            };
        }

        switch (expertReview.decision) {
            case 'Aceptado sin revisión':
                return {
                    icon: <Award className="w-16 h-16 text-green-400" />,
                    title: "Aceptado sin revisión",
                    description: "¡Excelente trabajo! El manuscrito cumple con los más altos estándares de calidad.",
                    bgColor: "bg-green-900/50 border-green-500/30"
                };
            case 'Aceptado para revisión':
                return {
                    icon: <FileCheck className="w-16 h-16 text-blue-400" />,
                    title: "Aceptado para revisión",
                    description: "El manuscrito tiene potencial y pasa a la siguiente fase de revisión por pares.",
                    bgColor: "bg-blue-900/50 border-blue-500/30"
                };
            case 'Rechazado':
                return {
                    icon: <FileX2 className="w-16 h-16 text-red-400" />,
                    title: "Rechazado",
                    description: "El manuscrito presenta áreas críticas que impiden su paso a revisión. Ver plan de acción.",
                    bgColor: "bg-red-900/50 border-red-500/30"
                };
            default:
                return {
                    icon: <Activity className="w-16 h-16 text-gray-500" />,
                    title: "Pendiente",
                    description: "Evaluación en proceso.",
                    bgColor: "bg-gray-700"
                };
        }
    };

    const verdict = getVerdictUI();

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 text-gray-200 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Veredicto del Editor Experto</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto custom-scrollbar">
                    <div className={`flex flex-col md:flex-row gap-6 items-center justify-center mb-8 p-6 rounded-lg border ${verdict.bgColor}`}>
                        {verdict.icon}
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-semibold text-white">{verdict.title}</h3>
                            <p className="text-gray-400 mt-1">
                                {verdict.description}
                            </p>
                        </div>
                    </div>

                    {expertReview?.decision === 'Rechazado' && expertReview.recommendations.length > 0 && (
                        <div className="mb-8 p-6 bg-yellow-900/20 rounded-lg border-2 border-yellow-500/40">
                            <h4 className="font-bold text-xl mb-4 flex items-center gap-3 text-yellow-300">
                                <ClipboardList size={24} />
                                Plan de Acción Sugerido
                            </h4>
                            <p className="text-sm text-yellow-400/80 mb-6">
                                Para mejorar significativamente el manuscrito, el comité editorial recomienda enfocarse en los siguientes puntos clave:
                            </p>
                            <div className="space-y-4">
                                {expertReview.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-md bg-gray-900/60">
                                         <div className="flex-shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-full bg-yellow-500 text-gray-900 font-bold text-sm">
                                            {index + 1}
                                         </div>
                                         <p className="text-gray-300 text-base">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <h4 className="font-bold text-xl mb-4 text-center text-gray-400">Resumen de Métricas</h4>
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
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-teal-400"><BookOpenCheck/>Verificación de Citas</h4>
                            <p><span className="font-bold text-2xl">{citationAnalysis ? citationAnalysis.formatting_errors.length + citationAnalysis.missing_references.length + citationAnalysis.uncited_references.length : 0}</span> problemas totales.</p>
                        </div>
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-400"><Activity/>Comprobación Metodológica</h4>
                            <p><span className="font-bold text-2xl">{methodologyAnalysis?.puntaje_general || 0}</span> puntaje de coherencia.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResultsDashboard;