import React from 'react';
import { Sparkles, Loader2, PenLine, LayoutList, BookMarked, Beaker, Award, Download } from 'lucide-react';
import Card from './ui/Card';
import { TONES } from '../constants';
import type { LoadingStates, Suggestion, StructuralAnalysisSection, CitationAnalysis, MethodologyAnalysis } from '../types';

import CorrectionsTab from './tabs/CorrectionsTab';
import StructureTab from './tabs/StructureTab';
import CitationsTab from './tabs/CitationsTab';
import MethodologyTab from './tabs/MethodologyTab';

interface ResultsPanelProps {
  isLoading: LoadingStates;
  text: string;
  selectedTone: string;
  setSelectedTone: (tone: string) => void;
  handleChangeTone: () => void;
  handleAnalyzeText: () => void;
  handleAnalyzeStructure: () => void;
  handleAnalyzeCitations: () => void;
  handleAnalyzeMethodology: () => void;
  handleOpenDashboard: () => void;
  setShowReportModal: (show: boolean) => void;
  analysesCompleted: number;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;

  suggestions: Suggestion[];
  applySuggestion: (suggestion: Suggestion) => void;
  applyAllSuggestions: () => void;
  structuralAnalysis: StructuralAnalysisSection[];
  citationAnalysis: CitationAnalysis | null;
  methodologyAnalysis: MethodologyAnalysis | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = (props) => {
    const {
        isLoading, text, selectedTone, setSelectedTone, handleChangeTone, handleAnalyzeText,
        handleAnalyzeStructure, handleAnalyzeCitations, handleAnalyzeMethodology,
        handleOpenDashboard, setShowReportModal, analysesCompleted,
        activeTab, setActiveTab, suggestions, applySuggestion, applyAllSuggestions,
        structuralAnalysis, citationAnalysis, methodologyAnalysis
    } = props;
    
    const allAnalysesDone = analysesCompleted === 4;

    return (
        <Card className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-white">Herramientas de IA</h2>
            <div className="p-4 rounded-lg border mb-6 bg-gray-900 border-gray-700">
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                            <PenLine size={16}/>Ajustar Tono
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={selectedTone}
                                onChange={(e) => setSelectedTone(e.target.value)}
                                disabled={isLoading.tone}
                                className="flex-grow w-full px-2 py-2 text-sm rounded-lg border bg-gray-800 border-gray-600"
                            >
                                {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                            <button
                                onClick={handleChangeTone}
                                disabled={isLoading.tone || !text.trim()}
                                className="px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
                            >
                                {isLoading.tone ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                                Reescribir
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                            <Beaker size={16}/>Análisis de Contenido
                        </label>
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                            <button onClick={handleAnalyzeText} disabled={isLoading.corrections||!text.trim()} className="px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">{isLoading.corrections?<Loader2 className="w-4 h-4 animate-spin"/>:<PenLine size={16}/>}Revisión</button>
                            <button onClick={handleAnalyzeStructure} disabled={isLoading.structure||!text.trim()} className="px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">{isLoading.structure?<Loader2 className="w-4 h-4 animate-spin"/>:<LayoutList size={16}/>}Estructura</button>
                            <button onClick={handleAnalyzeCitations} disabled={isLoading.citations||!text.trim()} className="px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50">{isLoading.citations ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookMarked size={16} />}Citas</button>
                            <button onClick={handleAnalyzeMethodology} disabled={isLoading.methodology||!text.trim()} className="px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">{isLoading.methodology?<Loader2 className="w-4 h-4 animate-spin"/>:<Beaker size={16}/>}Metodología</button>
                        </div>
                    </div>
                     <div className="pt-4 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button onClick={handleOpenDashboard} disabled={!allAnalysesDone || isLoading.expertReview} className="w-full px-4 py-2 text-md font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                            {isLoading.expertReview ? <Loader2 className="w-5 h-5 animate-spin"/> : <Award size={20}/>}
                            Resultados
                        </button>
                        <button onClick={() => setShowReportModal(true)} disabled={!allAnalysesDone} className="w-full px-4 py-2 text-md font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                            <Download size={20}/> Descargar
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-700 flex-wrap">
                <button onClick={()=>setActiveTab('corrections')} className={`px-3 py-2 text-sm font-medium ${activeTab==='corrections'?'border-b-2 border-purple-500 text-purple-400':'text-gray-500 hover:text-gray-300'}`}>Revisión ({suggestions.length})</button>
                <button onClick={()=>setActiveTab('structure')} className={`px-3 py-2 text-sm font-medium ${activeTab==='structure'?'border-b-2 border-indigo-500 text-indigo-400':'text-gray-500 hover:text-gray-300'}`}>Estructura ({structuralAnalysis.length})</button>
                <button onClick={()=>setActiveTab('citations')} className={`px-3 py-2 text-sm font-medium ${activeTab==='citations'?'border-b-2 border-teal-500 text-teal-400':'text-gray-500 hover:text-gray-300'}`}>Citas</button>
                <button onClick={()=>setActiveTab('methodology')} className={`px-3 py-2 text-sm font-medium ${activeTab==='methodology'?'border-b-2 border-blue-500 text-blue-400':'text-gray-500 hover:text-gray-300'}`}>Metodología</button>
            </div>

            <div className="flex-grow flex flex-col min-h-0 pt-4 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'corrections' && <CorrectionsTab suggestions={suggestions} applySuggestion={applySuggestion} applyAllSuggestions={applyAllSuggestions} />}
                {activeTab === 'structure' && <StructureTab analysis={structuralAnalysis} />}
                {activeTab === 'citations' && <CitationsTab analysis={citationAnalysis} />}
                {activeTab === 'methodology' && <MethodologyTab analysis={methodologyAnalysis} />}
            </div>
        </Card>
    );
};

export default ResultsPanel;