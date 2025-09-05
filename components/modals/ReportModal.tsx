
import React from 'react';
import { Download, X } from 'lucide-react';

interface ReportModalProps {
    onClose: () => void;
    onDownload: () => void;
    reportRef: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onDownload, reportRef, children }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white">Reporte Preliminar</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={onDownload} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <Download size={16} /> Descargar PDF
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto flex-1 bg-white text-gray-800">
                    <div ref={reportRef}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReportModal;
