import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { Suggestion, StructuralAnalysisSection, CitationAnalysis, MethodologyAnalysis, ExpertReview } from '../types';

// FIX: Safely access process.env to prevent "process is not defined" crash in browser environments.
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
const ai = new GoogleGenAI({ apiKey });

// FIX: Updated to the recommended model.
const model = "gemini-2.5-flash";

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

async function callGenerativeModel<T>(prompt: string, responseSchema: any): Promise<T> {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
                // FIX: `safetySettings` must be inside the `config` object.
                safetySettings,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            throw new Error(`Error en la llamada a la API de Gemini: ${error.message}`);
        }
        throw new Error("Error desconocido en la API de Gemini.");
    }
}

export const analyzeTextForSuggestions = async (text: string): Promise<Suggestion[]> => {
    const prompt = `Eres un editor científico profesional y riguroso. Tu tarea es realizar un análisis estricto del siguiente texto en español, apegándote a las mejores prácticas de redacción científica. Analiza el texto y responde con un array JSON de objetos. Cada objeto debe representar una única sugerencia. REGLAS ESTRICTAS: 1. IDIOMA: Toda la respuesta debe estar estrictamente en español. 2. IDs DE CATEGORÍA: Para "category", usa solo: "grammar", "spelling", "punctuation", "style", "clarity". 3. IDs DE SUBCATEGORÍA: Para "subcategory", usa solo: "concordancia", "tiempos_verbales", "lenguaje_vago", "antropomorfismo", "consistencia", "oraciones_complejas", "nominalizacion". Si la categoría es "spelling" o "punctuation", usa su propio ID como subcategoría. 4. No inventes categorías. Texto a analizar: "${text}". Si es impecable, devuelve un array vacío [].`;
    const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, subcategory: { type: Type.STRING }, issue: { type: Type.STRING }, suggestion: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ["category", "subcategory", "issue", "suggestion", "explanation"] } };
    return callGenerativeModel<Suggestion[]>(prompt, schema);
};

export const analyzeTextStructure = async (text: string): Promise<StructuralAnalysisSection[]> => {
    const prompt = `Analiza la estructura del siguiente texto científico. Identifica las secciones (Introducción, Métodos, etc.), proporciona un score de calidad (0-100) para cada una, y un checklist evaluado ('cumplido', 'parcial', 'no_encontrado') con sugerencias accionables para los puntos no cumplidos. IMPORTANTE: Todo el resultado debe estar en español. Texto: "${text}". Responde con un array JSON, un objeto por sección, con "section_name", "section_score", "general_comment" y "checklist" (con "item_description", "status" y "suggestion").`;
    const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { section_name: { type: Type.STRING }, section_score: { type: Type.NUMBER }, general_comment: { type: Type.STRING }, checklist: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item_description: { type: Type.STRING }, status: { type: Type.STRING, enum: ["cumplido", "parcial", "no_encontrado"] }, suggestion: { type: Type.STRING } }, required: ["item_description", "status", "suggestion"] } } }, required: ["section_name", "section_score", "general_comment", "checklist"] } };
    return callGenerativeModel<StructuralAnalysisSection[]>(prompt, schema);
};

export const analyzeTextCitations = async (text: string, citationStyle: string): Promise<CitationAnalysis> => {
    const prompt = `Analiza las citas del siguiente texto, asumiendo el formato "${citationStyle}". Identifica errores de formato, referencias no citadas y citas sin referencia. IMPORTANTE: Todo el resultado debe estar en español. Texto: "${text}". Responde con un objeto JSON con "formatting_errors", "uncited_references", y "missing_references".`;
    const schema = { type: Type.OBJECT, properties: { formatting_errors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { location: { type: Type.STRING }, issue: { type: Type.STRING }, suggestion: { type: Type.STRING } } } }, uncited_references: { type: Type.ARRAY, items: { type: Type.STRING } }, missing_references: { type: Type.ARRAY, items: { type: Type.STRING } } } };
    return callGenerativeModel<CitationAnalysis>(prompt, schema);
};

export const analyzeTextMethodology = async (text: string): Promise<MethodologyAnalysis> => {
    const prompt = `Eres un experto en metodología de investigación. Analiza el siguiente texto para evaluar la coherencia metodológica y la reproducibilidad. Realiza un parser, análisis de coherencia, scoring (0-100), y genera un reporte. IMPORTANTE: Todo el resultado, incluyendo nombres de las claves del JSON y sus valores, debe estar en español. Texto: "${text}". Devuelve un único objeto JSON con "puntaje_general", "comentario_resumen", "verificaciones_especificas" (con "verificacion", "es_coherente", "comentario"), "inconsistencias" (con "seccion_a", "seccion_b", "descripcion", "sugerencia"), y "evaluacion_reproducibilidad" (con "puntaje_completitud", "informacion_faltante").`;
    const schema = { type: Type.OBJECT, properties: { puntaje_general: { type: Type.NUMBER }, comentario_resumen: { type: Type.STRING }, verificaciones_especificas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { verificacion: { type: Type.STRING }, es_coherente: { type: Type.BOOLEAN }, comentario: { type: Type.STRING } }, required: ["verificacion", "es_coherente", "comentario"] } }, inconsistencias: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { seccion_a: { type: Type.STRING }, seccion_b: { type: Type.STRING }, descripcion: { type: Type.STRING }, sugerencia: { type: Type.STRING } }, required: ["seccion_a", "seccion_b", "descripcion", "sugerencia"] } }, evaluacion_reproducibilidad: { type: Type.OBJECT, properties: { puntaje_completitud: { type: Type.NUMBER }, informacion_faltante: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["puntaje_completitud", "informacion_faltante"] } }, required: ["puntaje_general", "comentario_resumen", "verificaciones_especificas", "inconsistencias", "evaluacion_reproducibilidad"] };
    return callGenerativeModel<MethodologyAnalysis>(prompt, schema);
};

export const getExpertReview = async (analysisData: {
    suggestionsCount: number;
    avgStructureScore: number;
    citationIssues: number;
    methodologyScore: number;
}): Promise<ExpertReview> => {
    const prompt = `Eres un editor en jefe de una prestigiosa revista académica con más de 20 años de experiencia. Tu criterio es extremadamente riguroso. Se te ha proporcionado un resumen del análisis automático de un manuscrito. Basado ESTRICTAMENTE en los siguientes datos, debes tomar una decisión final sobre el artículo.

Datos del Análisis:
- Número de sugerencias de estilo/gramática: ${analysisData.suggestionsCount}
- Puntuaje promedio de estructura (sobre 100): ${analysisData.avgStructureScore}
- Número total de problemas de citación: ${analysisData.citationIssues}
- Puntuaje de coherencia metodológica (sobre 100): ${analysisData.methodologyScore}

Tus criterios de decisión son:
- **Aceptado sin revisión:** SOLO si todos los indicadores son casi perfectos. Cero sugerencias, puntuaciones > 95. Es extremadamente raro.
- **Rechazado:** Si el manuscrito muestra fallas fundamentales. Por ejemplo, un alto número de sugerencias (>50), una puntuación de estructura muy baja (< 60), o una puntuación de metodología inaceptable (< 50). Estos son umbrales guía; usa tu juicio experto para evaluar la combinación de factores. Un artículo con mala metodología pero buena redacción podría ser rechazado, y viceversa.
- **Aceptado para revisión:** Todos los demás casos. El artículo tiene potencial pero requiere revisiones por pares y del autor.

IMPORTANTE:
1.  Tu respuesta DEBE ser un objeto JSON.
2.  La clave "decision" debe ser UNA de estas tres cadenas EXACTAS: "Aceptado sin revisión", "Aceptado para revisión", "Rechazado".
3.  Si la decisión es "Rechazado", DEBES incluir una clave "recommendations" que sea un array de strings. Cada string debe ser una recomendación CONCRETA y CONSTRUCTIVA para que los autores mejoren el manuscrito para un futuro envío. Las recomendaciones deben ser accionables y específicas, basadas en las debilidades que los datos sugieren (ej. "Revisar a fondo la sección de Metodología para asegurar su reproducibilidad", "Realizar una revisión gramatical exhaustiva con un profesional", etc.).
4.  Si la decisión NO es "Rechazado", la clave "recommendations" debe ser un array vacío [].`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            decision: { type: Type.STRING, enum: ["Aceptado sin revisión", "Aceptado para revisión", "Rechazado"] },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["decision", "recommendations"]
    };
    return callGenerativeModel<ExpertReview>(prompt, schema);
};


export const changeTextTone = async (text: string, selectedTone: string): Promise<string> => {
    let instruction = '';
    switch (selectedTone) {
        case 'academico': instruction = 'Reescribe en tono académico/formal.'; break;
        case 'activa': instruction = 'Reescribe usando voz activa.'; break;
        case 'pasiva': instruction = 'Reescribe usando voz pasiva.'; break;
        case 'conciso': instruction = 'Reescribe de forma concisa.'; break;
        case 'cauteloso': instruction = 'Reescribe con un lenguaje cauteloso.'; break;
    }
    const prompt = `${instruction}\n\nTexto original:\n---\n${text}\n---\n\nTexto reescrito:`;
    
    // FIX: `safetySettings` must be inside a `config` object.
    const response = await ai.models.generateContent({ model, contents: prompt, config: { safetySettings } });
    return response.text;
};