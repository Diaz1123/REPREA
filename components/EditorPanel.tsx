
import React from 'react';
import { FileText, UploadCloud, FileJson2 } from 'lucide-react';
import Card from './ui/Card.tsx';

interface EditorPanelProps {
    editorRef: React.RefObject<HTMLDivElement>;
    textLength: number;
    uploadedFileName: string;
    onTextUpdate: () => void;
    onLoadSample: () => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    triggerFileUpload: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isGdocImportVisible: boolean;
    setIsGdocImportVisible: (visible: boolean) => void;
    gdocUrl: string;
    setGdocUrl: (url: string) => void;
    handleGdocImport: () => void;
    isProcessingFile: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    editorRef,
    textLength,
    uploadedFileName,
    onTextUpdate,
    onLoadSample,
    onFileUpload,
    triggerFileUpload,
    fileInputRef,
    isGdocImportVisible,
    setIsGdocImportVisible,
    gdocUrl,
    setGdocUrl,
    handleGdocImport,
    isProcessingFile,
}) => {
    return (
        <Card className="relative">
            {isProcessingFile && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-white font-semibold">Procesando archivo...</p>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Tu Documento</h2>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileUpload}
                        accept=".txt,.md,.pdf,.doc,.docx"
                        className="hidden"
                    />
                    <button
                        onClick={triggerFileUpload}
                        className="px-3 py-1 text-sm rounded-lg flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Cargar Archivo
                    </button>
                     <button
                        onClick={() => setIsGdocImportVisible(true)}
                        className="px-3 py-1 text-sm rounded-lg flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        <FileJson2 className="w-4 h-4" />
                        Google Doc
                    </button>
                    <button
                        onClick={onLoadSample}
                        className="px-3 py-1 text-sm rounded-lg flex items-center gap-1 bg-gray-700 hover:bg-gray-600"
                    >
                        <FileText className="w-4 h-4" />
                        Ejemplo
                    </button>
                </div>
            </div>
            {isGdocImportVisible && (
                <div className="p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">
                        En Google Docs, ve a <span className="font-semibold text-yellow-400">Archivo &gt; Compartir &gt; Publicar en la web</span>, haz clic en "Publicar" y pega el enlace aquí.
                    </p>
                    <div className="flex gap-2">
                        <input 
                            type="url"
                            value={gdocUrl}
                            onChange={(e) => setGdocUrl(e.target.value)}
                            placeholder="https://docs.google.com/document/d/.../pub"
                            className="flex-grow w-full px-2 py-1.5 text-sm rounded-lg border bg-gray-800 border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                        />
                         <button onClick={handleGdocImport} className="px-3 py-1 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white">Cargar</button>
                         <button onClick={() => setIsGdocImportVisible(false)} className="px-3 py-1 text-sm rounded-lg bg-gray-600 hover:bg-gray-500 text-white">Cancelar</button>
                    </div>
                </div>
            )}
            {uploadedFileName && (
                <div className="mb-2 text-sm text-gray-400">
                    Archivo cargado: <span className="font-semibold">{uploadedFileName}</span>
                </div>
            )}
            <div
                ref={editorRef}
                contentEditable
                onInput={onTextUpdate}
                className="w-full h-96 p-4 rounded-lg border overflow-y-auto focus:outline-none focus:ring-2 bg-gray-900 border-gray-700 text-white focus:ring-purple-500"
                style={{ minHeight: '24rem' }}
                data-placeholder="Empieza a escribir, pega tu texto o carga un archivo..."
            />
            <div className="mt-4">
                <span className="text-sm text-gray-400">{textLength} caracteres</span>
            </div>
        </Card>
    );
};

export default EditorPanel;