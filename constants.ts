
import { Category } from './types';

export const CATEGORIES: Category[] = [
    { id: 'all', label: 'Todas', color: 'bg-purple-500' },
    { id: 'grammar', label: 'Gramática', color: 'bg-blue-500', subcategories: [{ id: 'concordancia', label: 'Concordancia' }, { id: 'tiempos_verbales', label: 'Tiempos Verbales' }] },
    { id: 'spelling', label: 'Ortografía', color: 'bg-red-500' },
    { id: 'punctuation', label: 'Puntuación', color: 'bg-yellow-500' },
    { id: 'style', label: 'Estilo Científico', color: 'bg-green-500', subcategories: [{ id: 'lenguaje_vago', label: 'Lenguaje Vago' }, { id: 'antropomorfismo', label: 'Antropomorfismo' }, { id: 'consistencia', label: 'Consistencia' }] },
    { id: 'clarity', label: 'Claridad', color: 'bg-indigo-500', subcategories: [{ id: 'oraciones_complejas', label: 'Oraciones Complejas' }, { id: 'nominalizacion', label: 'Nominalización' }] }
];

export const TONES = [
    { id: 'academico', label: 'Tono Académico/Formal' },
    { id: 'activa', label: 'Convertir a Voz Activa' },
    { id: 'pasiva', label: 'Convertir a Voz Pasiva' },
    { id: 'conciso', label: 'Tono Conciso (Abstracts)' },
    { id: 'cauteloso', label: 'Tono Cauteloso (Discusión)' }
];

export const CITATION_STYLES = ['APA', 'Vancouver', 'MLA', 'Chicago', 'IEEE'];

export const SAMPLE_TEXT = `Impacto del uso de redes sociales en la mente humana: Un estudio sin precedentes sobre comportamiento digital y cosmovisión moderna
Resumen
En este artículo se aborda cómo las redes sociales afectan al mental humana en muchas maneras que aún no se a comprendido del todo. Se encuestaron personas sobre cosas relacionadas con redes y se analizaron datos obtenidos de varias fuentes y tambien se investigaron cosas nuevas. Los resultados muestran muchas tendencias, como el incremento del uso, sin embargo no se puede concluir nada concreto pero hay ideas importantes. Esto aportan a la literatura existente.
Palabras clave: redes sociales, salud mental, percepción digital, datos, tecnología

1. Introducción
La humanidad ha evolucionado gracias a muchos factores. En estos tiempos modernos, las redes sociales es una cosa que todos usamos. Aunque no es claro del todo cómo nos afecta, muchos expertos afirman que es importante. Según lo dicho por autores (Gonzalez et al 2019), el cerebro humano es impactado por estímulos digitales. Además, como se indica en varios estudios, se percibe una tendencia creciente a la disfuncionalidad emocional.
El objetivo del presente trabajo consiste en abordar esta problemática desde una óptica analítica pero también subjetiva, por lo cual nos basamos en varias experiencias personales y científicas de los autores. También se intentó incluir estadísticas aunque algunas no se pudieron verificar.

2. Metodología
Se utilizó una metodología mixta de tipo descriptiva con elementos cualitativos y experimentales sin una estructura concreta porque la flexibilidad permite mayor descubrimiento de los resultados.
Participaron en el estudio aproximadamente 100 personas entre 18 y 60 años, aunque no se tiene seguridad del número final porque algunos formularios se perdieron. Las encuestas fueron aplicadas en un parque y otros lugares.
No se obtuvo consentimiento informado en todos los casos porque algunas personas no estaban disponibles, pero se garantizó la ética en general.
Cuadro 1. Participantes y género

(No se incluye por problemas técnicos con la tabla)
3. Resultados
Los resultados obtenidos fueron muy variados. Por ejemplo, el 45% de las personas dijeron que usan redes sociales. Otra parte no respondió o no sabían qué decir. En la Figura 1 se muestra cómo se comporta el uso de las redes, aunque el gráfico no está del todo claro.
Figura 1. Uso de redes sociales según edad

![Gráfico ilegible con datos inconsistentes y ejes no etiquetados]
Se observaron otras cosas como el estrés, ansiedad y también felicidad, pero no se midieron con instrumentos validados.

4. Discusión
Aquí hay que mencionar que los resultados confirman muchas teorías pero también contradicen otras. Es un fenómeno complejo. Por ejemplo, algunas personas dijeron que se sienten bien, pero otros se sienten mal. Entonces, el impacto es dual o múltiple.
Autores como Smith (2018) no fueron consultados pero se sabe que han hablado del tema. Además, hay una relación entre tiempo de pantalla y salud, aunque no se midió el tiempo.
Una limitación es que no se usó control de variables y que algunos datos fueron supuestos por los investigadores.

5. Conclusión
En general, las redes sociales sí afectan, pero depende. No se puede decir exactamente cómo pero sí se nota que pasa algo.
Es necesario más investigaciones, sobre todo en otras ciudades y países para confirmar esto y entender mejor.
Este estudio representa una gran contribución porque nadie antes lo hizo igual.

Referencias
Gonzalez, A. et al. redes y cerebro. Revista de Cosas Digitales, sin año.
Otros autores importantes (no recordamos el nombre).
Wikipedia (consultado 2020): https://es.wikipedia.org/wiki/Redes_sociales
Artículo de internet: https://randomsite1234.com/social-impact-study`;
