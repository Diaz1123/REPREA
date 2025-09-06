import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

import EditorPanel from './components/EditorPanel.tsx';
import ResultsPanel from './components/ResultsPanel.tsx';
import ResultsDashboard from './components/modals/ResultsDashboard.tsx';
import ReportModal from './components/modals/ReportModal.tsx';
import StructureTab from './components/tabs/StructureTab.tsx';
import CitationsTab from './components/tabs/CitationsTab.tsx';
import MethodologyTab from './components/tabs/MethodologyTab.tsx';

import { 
  analyzeTextForSuggestions, 
  analyzeTextStructure, 
  analyzeTextCitations, 
  analyzeTextMethodology,
  changeTextTone,
  getExpertReview
} from './services/geminiService.ts';
import { SAMPLE_TEXT, CITATION_STYLES } from './constants.ts';
import type { 
  Suggestion, 
  StructuralAnalysisSection, 
  CitationAnalysis, 
  MethodologyAnalysis, 
  LoadingStates,
  AnalysisType,
  ExpertReview
} from './types.ts';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [structuralAnalysis, setStructuralAnalysis] = useState<StructuralAnalysisSection[]>([]);
  const [citationAnalysis, setCitationAnalysis] = useState<CitationAnalysis | null>(null);
  const [methodologyAnalysis, setMethodologyAnalysis] = useState<MethodologyAnalysis | null>(null);
  const [expertReview, setExpertReview] = useState<ExpertReview | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingStates>({});
  const [selectedTone, setSelectedTone] = useState('academico');
  const [citationStyle, setCitationStyle] = useState('APA');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('corrections');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showResultsDashboard, setShowResultsDashboard] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [completedAnalyses, setCompletedAnalyses] = useState<Set<AnalysisType>>(new Set());
  const [isGdocImportVisible, setIsGdocImportVisible] = useState(false);
  const [gdocUrl, setGdocUrl] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
    }
  }, []);

  const setLoadingState = (key: keyof LoadingStates, value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  const updateContent = useCallback(() => {
    if (editorRef.current) {
        const temp = document.createElement('div');
        temp.innerHTML = editorRef.current.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        temp.querySelectorAll('mark').forEach(m => {
            const textNode = document.createTextNode(m.textContent || '');
            m.parentNode?.replaceChild(textNode, m);
        });
        setText(temp.textContent || '');
    }
  }, []);

  const loadSampleText = useCallback(() => {
    if (editorRef.current) {
        editorRef.current.innerHTML = SAMPLE_TEXT.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('');
        updateContent();
        setSuggestions([]);
        setStructuralAnalysis([]);
        setCitationAnalysis(null);
        setMethodologyAnalysis(null);
        setCompletedAnalyses(new Set());
        setExpertReview(null);
        setError('');
    }
  }, [updateContent]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editorRef.current) return;

    setUploadedFileName(file.name);
    setIsProcessingFile(true);
    setError('');

    try {
        let fileContent = '';
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.pdf')) {
            if (!window.pdfjsLib) throw new Error("La librería PDF.js no está disponible.");
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            const pagesText = [];
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                pagesText.push(pageText);
            }
            fileContent = pagesText.join('\n\n');
        } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
             if (!window.mammoth) throw new Error("La librería Mammoth.js no está disponible.");
             const arrayBuffer = await file.arrayBuffer();
             const result = await window.mammoth.extractRawText({ arrayBuffer });
             fileContent = result.value;
        } else {
            fileContent = await file.text();
        }

        editorRef.current.innerHTML = fileContent.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('');
        updateContent();

    } catch (err) {
        setError(`Error procesando el archivo: ${err instanceof Error ? err.message : String(err)}.`);
        editorRef.current.innerHTML = '';
        updateContent();
    } finally {
        setIsProcessingFile(false);
        if (event.target) {
            event.target.value = '';
        }
    }
  };

  const handleGdocImport = async () => {
    if (!gdocUrl.trim() || !editorRef.current) {
        setError('Por favor, ingresa una URL de Google Doc válida.');
        return;
    }
    
    if (!gdocUrl.includes('docs.google.com/document/d/') || !gdocUrl.endsWith('/pub')) {
         setError('URL inválida. Asegúrate de que es un enlace "Publicado en la web" que termina en /pub.');
         return;
    }

    setIsProcessingFile(true);
    setError('');
    setUploadedFileName('Google Doc');
    
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(gdocUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Error al acceder a la URL. Código: ${response.status}`);
        
        const data = await response.json();
        const htmlContent = data.contents;
        
        if (!htmlContent) throw new Error("No se pudo obtener contenido de la URL.");

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const contentElement = doc.getElementById('contents');
        const extractedText = contentElement ? contentElement.innerText : doc.body.innerText;
        
        if (!extractedText.trim()) throw new Error("No se pudo extraer texto del documento.");

        editorRef.current.innerHTML = extractedText.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('');
        updateContent();
        setIsGdocImportVisible(false);
        setGdocUrl('');

    } catch (err) {
        setError(`Error importando Google Doc: ${err instanceof Error ? err.message : String(err)}.`);
    } finally {
        setIsProcessingFile(false);
    }
  };


  const triggerFileUpload = () => fileInputRef.current?.click();

  const runAnalysis = async <T,>(
    analysisFn: () => Promise<T>, 
    stateSetter: (data: T) => void, 
    type: AnalysisType
  ) => {
    if (!text.trim()) {
      setError('Por favor, ingresa texto para analizar.');
      return;
    }
    setLoadingState(type, true);
    setError('');
    setExpertReview(null); // Reset expert review when a new analysis is run
    try {
      const result = await analysisFn();
      stateSetter(result);
      setActiveTab(type);
      setCompletedAnalyses(prev => new Set(prev).add(type));
      if (Array.isArray(result) && result.length === 0) {
        setError(`Análisis de ${type} completo. No se encontraron problemas.`);
      }
    } catch (err) {
      setError(`Falló el análisis de ${type}: ${err instanceof Error ? err.message : String(err)}.`);
    } finally {
      setLoadingState(type, false);
    }
  };

  const handleAnalyzeText = () => runAnalysis(() => analyzeTextForSuggestions(text), setSuggestions, 'corrections');
  const handleAnalyzeStructure = () => runAnalysis(() => analyzeTextStructure(text), setStructuralAnalysis, 'structure');
  const handleAnalyzeCitations = () => runAnalysis(() => analyzeTextCitations(text, citationStyle), setCitationAnalysis, 'citations');
  const handleAnalyzeMethodology = () => runAnalysis(() => analyzeTextMethodology(text), setMethodologyAnalysis, 'methodology');

  const handleOpenDashboard = async () => {
    setLoadingState('expertReview', true);
    setError('');
    try {
      const avgStructureScore = structuralAnalysis.length > 0
        ? Math.round(structuralAnalysis.reduce((acc, s) => acc + s.section_score, 0) / structuralAnalysis.length)
        : 0;
      const citationIssues = citationAnalysis ? citationAnalysis.formatting_errors.length + citationAnalysis.missing_references.length + citationAnalysis.uncited_references.length : 0;
      const methodologyScore = methodologyAnalysis?.puntaje_general || 0;

      const review = await getExpertReview({
        suggestionsCount: suggestions.length,
        avgStructureScore,
        citationIssues,
        methodologyScore
      });
      setExpertReview(review);
      setShowResultsDashboard(true);
    } catch(err) {
      setError(`No se pudo obtener el veredicto del editor: ${err instanceof Error ? err.message : String(err)}.`);
    } finally {
      setLoadingState('expertReview', false);
    }
  };

  const handleChangeTone = async () => {
    if (!text.trim()) return;
    setLoadingState('tone', true);
    setError('');
    try {
      const newText = await changeTextTone(text, selectedTone);
      if (editorRef.current) {
          editorRef.current.innerHTML = `<p>${newText.replace(/\n/g, '</p><p>')}</p>`;
      }
      updateContent();
      setSuggestions([]);
    } catch (err) {
      setError(`No se pudo cambiar el tono: ${err instanceof Error ? err.message : String(err)}.`);
    } finally {
      setLoadingState('tone', false);
    }
  };

  const saveSelection = (): Range | null => {
    if (window.getSelection) {
        const sel = window.getSelection();
        if (sel && sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range && window.getSelection) {
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
  };

  const applyHighlights = useCallback(() => {
    if (!editorRef.current || suggestions.length === 0) return;
    const selection = saveSelection();
    let content = editorRef.current.innerHTML;
    content = content.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1');
    const colorMap: { [key: string]: string } = {
        grammar: 'rgba(59,130,246,0.3)', spelling: 'rgba(239,68,68,0.3)',
        punctuation: 'rgba(245,158,11,0.3)', style: 'rgba(34,197,94,0.3)',
        clarity: 'rgba(99,102,241,0.3)'
    };
    suggestions.forEach(s => {
        const color = colorMap[s.category.toLowerCase()] || 'rgba(147,51,234,0.3)';
        const regex = new RegExp(`(?<!<[^>]*)${s.issue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![^<]*>)`, 'g');
        content = content.replace(regex, match => `<mark data-issue="${encodeURIComponent(s.issue)}" style="background-color:${color};padding:2px 0;border-radius:2px;cursor:pointer;">${match}</mark>`);
    });
    editorRef.current.innerHTML = content;
    restoreSelection(selection);
  }, [suggestions]);

  useEffect(() => {
    applyHighlights();
  }, [suggestions, applyHighlights]);

  const applySuggestion = (suggestion: Suggestion) => {
    if (!editorRef.current) return;
    let content = editorRef.current.innerHTML;
    const regex = new RegExp(`<mark[^>]*data-issue="${encodeURIComponent(suggestion.issue)}"[^>]*>(.*?)</mark>`, 'g');
    content = content.replace(regex, suggestion.suggestion);
    editorRef.current.innerHTML = content;
    updateContent();
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };
  
  const applyAllSuggestions = () => {
    if (!editorRef.current || suggestions.length === 0) return;
    let content = editorRef.current.innerHTML;
    suggestions.forEach(s => {
      const regex = new RegExp(`(<mark[^>]*>)?${s.issue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(</mark>)?`, 'g');
      content = content.replace(regex, s.suggestion);
    });
    editorRef.current.innerHTML = content;
    updateContent();
    setSuggestions([]);
  };

  const handleDownloadReport = () => {
    if (!window.jspdf || !window.html2canvas) {
        setError("Las librerías de PDF no están cargadas. Intente de nuevo.");
        return;
    }
    const input = reportRef.current;
    if (!input) return;

    const { jsPDF } = window.jspdf;
    window.html2canvas(input, { scale: 2, backgroundColor: '#ffffff' })
      .then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let newImgWidth = pdfWidth - 20;
        let newImgHeight = newImgWidth / ratio;
        let position = 10;

        if (newImgHeight > pdfHeight - 20) {
            newImgHeight = pdfHeight - 20;
            newImgWidth = newImgHeight * ratio;
        }

        pdf.addImage(imgData, 'PNG', 10, position, newImgWidth, newImgHeight);
        pdf.save("reporte-preliminar-reprea.pdf");
      });
  };


  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <style>{`
        [contenteditable][data-placeholder]:empty:before{
          content: attr(data-placeholder);
          pointer-events: none;
          display: block;
          color: #6b7280;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
      `}</style>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">REPREA</h1>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} title="Cambiar modo" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </header>

        {error && 
          <div className="my-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        }

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditorPanel
            editorRef={editorRef}
            textLength={text.length}
            uploadedFileName={uploadedFileName}
            onTextUpdate={updateContent}
            onLoadSample={loadSampleText}
            onFileUpload={handleFileChange}
            triggerFileUpload={triggerFileUpload}
            fileInputRef={fileInputRef}
            isGdocImportVisible={isGdocImportVisible}
            setIsGdocImportVisible={setIsGdocImportVisible}
            gdocUrl={gdocUrl}
            setGdocUrl={setGdocUrl}
            handleGdocImport={handleGdocImport}
            isProcessingFile={isProcessingFile}
          />
          <ResultsPanel
            isLoading={isLoading}
            text={text}
            selectedTone={selectedTone}
            setSelectedTone={setSelectedTone}
            handleChangeTone={handleChangeTone}
            handleAnalyzeText={handleAnalyzeText}
            handleAnalyzeStructure={handleAnalyzeStructure}
            handleAnalyzeCitations={handleAnalyzeCitations}
            handleAnalyzeMethodology={handleAnalyzeMethodology}
            handleOpenDashboard={handleOpenDashboard}
            setShowReportModal={setShowReportModal}
            analysesCompleted={completedAnalyses.size}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            suggestions={suggestions}
            applySuggestion={applySuggestion}
            applyAllSuggestions={applyAllSuggestions}
            structuralAnalysis={structuralAnalysis}
            citationAnalysis={citationAnalysis}
            methodologyAnalysis={methodologyAnalysis}
          />
        </main>
        {showResultsDashboard && 
            <ResultsDashboard 
                onClose={() => setShowResultsDashboard(false)}
                suggestions={suggestions}
                structuralAnalysis={structuralAnalysis}
                citationAnalysis={citationAnalysis}
                methodologyAnalysis={methodologyAnalysis}
                expertReview={expertReview}
            />}
        {showReportModal && 
            <ReportModal 
                onClose={() => setShowReportModal(false)} 
                onDownload={handleDownloadReport}
                reportRef={reportRef}
            >
              <div className="space-y-8">
                <h1 className="text-3xl font-bold text-center">Reporte de Análisis Preliminar</h1>
                <p className="text-sm text-gray-600 text-center">Generado por REPREA - {new Date().toLocaleString()}</p>
                <div className="p-4 border-t border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Análisis Estructural</h2>
                  <StructureTab analysis={structuralAnalysis} />
                </div>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4 text-teal-700">Verificación de Citas</h2>
                  <CitationsTab analysis={citationAnalysis} />
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-700">Comprobación Metodológica</h2>
                  <MethodologyTab analysis={methodologyAnalysis} />
                </div>
              </div>
            </ReportModal>
        }
      </div>
    </div>
  );
};

export default App;