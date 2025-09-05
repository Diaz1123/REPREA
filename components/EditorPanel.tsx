
import React from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import Card from './ui/Card';

interface EditorPanelProps {
    editorRef: React.RefObject<HTMLDivElement>;
    textLength: number;
    uploadedFileName: string;
    onTextUpdate: () => void;
    onLoadSample: () => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    triggerFileUpload: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
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
}) => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Tu Documento</h2>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileUpload}
                        accept=".txt,.md"
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
                        onClick={onLoadSample}
                        className="px-3 py-1 text-sm rounded-lg flex items-center gap-1 bg-gray-700 hover:bg-gray-600"
                    >
                        <FileText className="w-4 h-4" />
                        Ejemplo
                    </button>
                </div>
            </div>
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
