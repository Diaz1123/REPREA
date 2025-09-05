
// Allow access to globally loaded libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export interface Suggestion {
  category: string;
  subcategory: string;
  issue: string;
  suggestion: string;
  explanation: string;
}

export interface StructuralAnalysisSection {
  section_name: string;
  section_score: number;
  general_comment: string;
  checklist: {
    item_description: string;
    status: 'cumplido' | 'parcial' | 'no_encontrado';
    suggestion: string;
  }[];
}

export interface CitationAnalysis {
  formatting_errors: {
    location: string;
    issue: string;
    suggestion: string;
  }[];
  uncited_references: string[];
  missing_references: string[];
}

export interface MethodologyAnalysis {
    puntaje_general: number;
    comentario_resumen: string;
    verificaciones_especificas: {
        verificacion: string;
        es_coherente: boolean;
        comentario: string;
    }[];
    inconsistencias: {
        seccion_a: string;
        seccion_b: string;
        descripcion: string;
        sugerencia: string;
    }[];
    evaluacion_reproducibilidad: {
        puntaje_completitud: number;
        informacion_faltante: string[];
    };
}

export type AnalysisType = 'corrections' | 'structure' | 'citations' | 'methodology';
export type LoadingStates = {
  [key in AnalysisType | 'tone' | 'refGenerator']?: boolean;
};

export interface Category {
  id: string;
  label: string;
  color: string;
  subcategories?: { id: string; label: string }[];
}
