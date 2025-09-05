
import React from 'react';
import { MethodologyAnalysis } from '../../types';
import ScoreGauge from '../ui/ScoreGauge';
import ProgressBar from '../ui/ProgressBar';
import { Check, X, ShieldAlert, ShieldX } from 'lucide-react';

interface MethodologyTabProps {
    analysis: MethodologyAnalysis | null;
}

const MethodologyTab: React.FC<MethodologyTabProps> = ({ analysis }) => {
    if (!analysis) {
        return <div className="text-center text-gray-400 py-10">No hay análisis metodológico disponible.</div>;
    }

    const { puntaje_general, comentario_resumen, verificaciones_especificas, inconsistencias, evaluacion_reproducibilidad } = analysis;

    return (
        <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 flex flex-col md:flex-row items-center gap-6">
                <ScoreGauge score={puntaje_general} />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Evaluación Metodológica General</h3>
                    <p className="text-sm text-gray-300">{comentario_resumen}</p>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Coherencia Interna</h3>
                <div className="space-y-2">
                    {verificaciones_especificas.map((v, i) => (
                        <div key={i} className="flex gap-3 p-2 rounded-md bg-gray-800/50">
                            {v.es_coherente ? <Check className="w-5 h-5 text-green-500 shrink-0" /> : <X className="w-5 h-5 text-red-500 shrink-0" />}
                            <div>
                                <p className="font-semibold text-sm text-gray-300">{v.verificacion}</p>
                                <p className="text-xs text-gray-400">{v.comentario}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {inconsistencias.length > 0 &&
                <div className="p-4 rounded-lg bg-gray-900 border border-red-500/30">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-3"><ShieldAlert size={20}/>Inconsistencias Detectadas</h3>
                    <div className="space-y-3">
                        {inconsistencias.map((inc, i) => (
                            <div key={i} className="border-l-4 border-red-500 pl-4 py-2">
                                <p className="text-sm text-gray-300"><span className="font-bold">{inc.seccion_a} vs {inc.seccion_b}:</span> {inc.descripcion}</p>
                                <p className="text-xs text-yellow-400 mt-1"><span className="font-semibold">Sugerencia:</span> {inc.sugerencia}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
            
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Evaluación de Reproducibilidad</h3>
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-32">
                        <ProgressBar score={evaluacion_reproducibilidad.puntaje_completitud} />
                    </div>
                    <span className="text-sm font-bold">{evaluacion_reproducibilidad.puntaje_completitud}/100</span>
                </div>
                 {evaluacion_reproducibilidad.informacion_faltante.length > 0 &&
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-2"><ShieldX size={16}/>Información Faltante Crítica:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {evaluacion_reproducibilidad.informacion_faltante.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>
                 }
            </div>
        </div>
    );
};

export default MethodologyTab;
