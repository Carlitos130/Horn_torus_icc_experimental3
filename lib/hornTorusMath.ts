/**
 * =============================================================================
 * HORN TORUS DEL INCONSCIENTE (Icc)
 * Modelo Topológico del Inconsciente Freudiano
 * =============================================================================
 * 
 * Tesis: RSI - Poincaré
 * Autor: Lic. Carlos Vonsik (MN 85130)
 * 
 * CORRECCIÓN EPISTEMOLÓGICA FUNDAMENTAL:
 * El horn torus (r = R) NO es una variedad diferenciable. En el límite:
 *   - La longitud interior λ_int = {v = π} colapsa al origen (LA VOZ)
 *   - Los teoremas de Heegaard y Alexander valen para todo r < R
 *   - Se quiebran en el límite singular donde surge la voz
 *   - La característica de Euler salta: χ = 0 → 1
 *   - El grupo de homología colapsa: H₁ = ℤ² → ℤ
 *   - La energía de Willmore diverge: W → +∞
 *   - La curvatura de Gauss mínima diverge: K_min → -∞
 * 
 * =============================================================================
 * COHERENCIA METAPSICOLÓGICA
 * =============================================================================
 * 
 * El modelo matemático implementa la teoría lacaniana del inconsciente:
 * 
 * 1. LA VOZ (v = π): Punto de autotangencia donde el tubo se toca a sí mismo.
 *    - Coincide con la "Stimme des Gewissens" (voz de la conciencia) de Freud
 *    - Es el orificio sin cierre del Sem. XI de Lacan (las "orejas")
 *    - En el límite r→R, toda la circunferencia v=π colapsa a este punto
 *    - ORIGEN DE LOS VECTORES DE CIRCULACIÓN (VR): La voz emite vectores que circulan
 *      por las cintas S, I, Σ a través de las pulsiones
 * 
 * 2. EL FANTASMA (u_F, v_F): Núcleo fantasmático, nunca visitado pero rodeado
 *    - Correspondencia con "Ein Kind wird geschlagen" (Freud GW XII)
 *    - Defecto topológico en la superficie de inscripción
 *    - Aquí el significante NO puede simbolizar: surge la angustia (LO REAL)
 *    - PUNTO SIN CIRCULACIÓN: La fantasía es un punto fijo donde NO hay circulación
 * 
 * 3. EL TRAUMA (u_T, v_T): Marca alcanzable por Nachträglichkeit
 *    - Caso Emma y el trauma de Kleider (Freud GW II/III, Entwurf)
 *    - Marca en la superficie alcanzable por caminos en épocas posteriores
 *    - TRAUMA = S-E-I CONGELADO: El trauma es un nudo de S, I, Σ que está congelado
 *      por la Nachträglichkeit, intentando desimbolizarse
 *    - EL TRAUMA SE PUEDE RESOLVER: Al circular los VR por las cintas, el trauma
 *      congelado puede descongelarse y re-simbolizarse
 * 
 * 4. LAS CINTAS (S, I, Σ, Pulsión): Trenza conforme al §4
 *    - S: Significante (cadena significante)
 *    - I: Imagen del cuerpo (Imago)
 *    - Σ: Síntoma (formación del inconsciente)
 *    - Pulsión: Hilo pulsional (Trieb) pegado al borde de I
 *    - CIRCULACIÓN DE VR: Los vectores de circulación (VR) fluyen por estas cintas
 * 
 * 5. LO Icc (Inconsciente):
 *    - NO TODO LO Icc ES REPRIMIDO: Lo Icc incluye lo reprimido pero también lo no simbolizado
 *    - TODO LO REPRIMIDO ES Icc: Lo reprimido puede volver a descifrarse
 *    - LA FANTASÍA: Puntos no simbolizados que NO pueden volverse conscientes
 *    - CONSTRUCCIÓN: "Como pegan a un niño" - Lo Icc se construye a través de identificaciones
 *      primarias (como el niño que es pegado en la fantasía)
 * 
 * 6. MECANISMOS DE LA ANGUSTIA (LO REAL):
 *    - La angustia NO es un orden, es el EFECTO de lo real
 *    - Métrico: Cerca del fantasma (u_F, v_F), A(u,v) → 0, angustia emerge
 *    - Zona de Ruptura: A ≤ π/4 donde el significante no puede simbolizar
 *    - "La angustia es lo que no engaña" (Lacan, Sem. X)
 * 
 * =============================================================================
 * VECTORES DE CIRCULACIÓN (VR)
 * =============================================================================
 * 
 * Los VR son vectores tangentes a las cintas S, I, Σ que:
 * 1. ORIGEN: Parten del agujero de la voz (0,0,0) cuando v=π
 * 2. TRAYECTORIA: Siguen las curvas S, I, Σ manteniendo la tangencia
 * 3. SENTIDO: Circulan en dirección clockwise o counterclockwise según la cinta
 * 4. FUNCIÓN: Transportan energía pulsional y permiten la circulación del significante
 * 
 * PROPIEDADES:
 * - Los VR en S: Circulan la cadena significante
 * - Los VR en I: Circulan la imagen del cuerpo
 * - Los VR en Σ: Circulan el síntoma
 * - Los VR en Pulsión: Transportan la energía libidinal
 * 
 * TRAUMA Y CIRCULACIÓN:
 * - El trauma congelado (S-E-I) bloquea la circulación de VR
 * - Al circular VR por las cintas, se puede descongelar el trauma
 * - La fantasía (punto fijo) NO tiene circulación de VR
 * 
 * =============================================================================
 */

export interface SCL90RData {
  Somatizacion: number;
  "Obsesion-Compulsion": number;
  "Sensibilidad Interpersonal": number;
  Depresion: number;
  Ansiedad: number;
  Hostilidad: number;
  "Ansiedad Fobica": number;
  "Ideacion Paranoide": number;
  Psicoticismo: number;
  GSI: number;  // IGS (Índice de Gravedad Global)
  PST: number;  // TSP (Total de Síntomas Positivos, conteo sobre 90 ítems)
  PSDI: number; // IMSP (Índice de Malestar Síntomas Positivos)
}

/**
 * Baremo Casullo – Pérez (2008)
 * Población general Buenos Aires, Adultos 25–60 años, MASCULINO.
 * Valores de corte normalizados con Puntaje T = 60.
 * Por encima de dichos valores (T > 60) hay que tomar nota de los síntomas (significación clínica).
 */
export const CASULLO_2008_MASCULINO_ADULTOS_T60: SCL90RData = {
  Somatizacion: 1.08,             // SOM
  "Obsesion-Compulsion": 1.70,     // OBS
  "Sensibilidad Interpersonal": 1.33, // SI
  Depresion: 1.38,                // DEP
  Ansiedad: 1.30,                 // ANS
  Hostilidad: 1.33,               // HOS
  "Ansiedad Fobica": 0.57,        // FOB
  "Ideacion Paranoide": 1.50,     // PAR
  Psicoticismo: 0.90,             // PSIC
  GSI: 1.10,                      // IGS (Índice de Gravedad Global)
  PST: 52.00,                     // TSP (Total de Síntomas Positivos)
  PSDI: 2.25,                     // IMSP (Índice de Malestar Síntomas Positivos)
};

export const DEFAULT_SCL90R_DATA: SCL90RData = {
  ...CASULLO_2008_MASCULINO_ADULTOS_T60,
};

export interface Scl90ScaleMeta {
  key: keyof SCL90RData;
  abbreviation: string;
  name: string;
  cutoffT60: number;
  description: string;
  min: number;
  max: number;
  step: number;
  isGlobalIndex?: boolean;
}

export const SCL90_SCALES_CASULLO_2008: Scl90ScaleMeta[] = [
  { key: "Somatizacion", abbreviation: "SOM", name: "Somatización", cutoffT60: 1.08, min: 0.0, max: 4.0, step: 0.01, description: "Percepción de disfunciones corporales neurovegetativas y somáticas." },
  { key: "Obsesion-Compulsion", abbreviation: "OBS", name: "Obsesión-Compulsión", cutoffT60: 1.70, min: 0.0, max: 4.0, step: 0.01, description: "Pensamientos egodistónicos recurrentes, impulsos y compulsiones." },
  { key: "Sensibilidad Interpersonal", abbreviation: "SI", name: "Sensibilidad Interpersonal", cutoffT60: 1.33, min: 0.0, max: 4.0, step: 0.01, description: "Sentimientos de inferioridad, timidez y malestar en el vínculo social." },
  { key: "Depresion", abbreviation: "DEP", name: "Depresión", cutoffT60: 1.38, min: 0.0, max: 4.0, step: 0.01, description: "Afecto disfórico, anhedonia, pérdida de energía vital y desánimo." },
  { key: "Ansiedad", abbreviation: "ANS", name: "Ansiedad", cutoffT60: 1.30, min: 0.0, max: 4.0, step: 0.01, description: "Tensión motora, aprensión fásica, hiperalerta y angustia manifiesta." },
  { key: "Hostilidad", abbreviation: "HOS", name: "Hostilidad", cutoffT60: 1.33, min: 0.0, max: 4.0, step: 0.01, description: "Sentimientos de cólera, agresividad, resentimiento e irritabilidad." },
  { key: "Ansiedad Fobica", abbreviation: "FOB", name: "Ansiedad Fóbica", cutoffT60: 0.57, min: 0.0, max: 4.0, step: 0.01, description: "Temor irracional persistente y conducta de evitación a objetos o lugares." },
  { key: "Ideacion Paranoide", abbreviation: "PAR", name: "Ideación Paranoide", cutoffT60: 1.50, min: 0.0, max: 4.0, step: 0.01, description: "Pensamiento suspicaz, desconfianza proyectiva y temor a la intrusión." },
  { key: "Psicoticismo", abbreviation: "PSIC", name: "Psicoticismo", cutoffT60: 0.90, min: 0.0, max: 4.0, step: 0.01, description: "Vivencias de aislamiento radical, despersonalización y ruptura de realidad." },
  { key: "GSI", abbreviation: "IGS", name: "Índice de Gravedad Global (GSI)", cutoffT60: 1.10, min: 0.0, max: 4.0, step: 0.01, description: "Indicador general del nivel global de distrés y sufrimiento psíquico.", isGlobalIndex: true },
  { key: "PST", abbreviation: "TSP", name: "Total de Síntomas Positivos (PST)", cutoffT60: 52.00, min: 0, max: 90, step: 1, description: "Número de ítems reconocidos con puntaje mayor a 0 (conteo bruto sobre 90).", isGlobalIndex: true },
  { key: "PSDI", abbreviation: "IMSP", name: "Índice de Malestar Síntomas Positivos (PSDI)", cutoffT60: 2.25, min: 1.0, max: 4.0, step: 0.01, description: "Intensidad media del sufrimiento en los síntomas afirmativos.", isGlobalIndex: true },
];

export const COLOR_PALETTE = {
  S: "#d81b3c", // crimson — S (Significante)
  I: "#2e8b57", // seagreen — I (Imagen del cuerpo)
  Pulsion: "#daa520", // goldenrod — Hilo pulsional (Trieb)
  Sigma: "#3f51b5", // royalblue — Σ (Síntoma)
  voz: "#00e5ff", // cian brillante luminoso — punto de autotangencia / la voz (alto contraste en fondo azul oscuro)
  trauma: "#ef6c00", // núcleo del trauma
  fant: "#d81b8c", // núcleo fantasmático
  ding: "#37474f", // superficie de Ding
  pared: "#c9d6de", // espesor Pcs
  clifford: "#8b5cf6",
};

// =============================================================================
// INTERFACES PARA VECTORES DE CIRCULACIÓN (VR)
// =============================================================================

export interface VectorCirculacion {
  nombre: string;                    // Nombre del vector (ej: "VR-S", "VR-I", "VR-Sigma")
  cinta: 'S' | 'I' | 'Sigma' | 'Pulsion';  // Cinta a la que pertenece
  posicion: [number, number];       // Posición (u, v) en el toro
  direccion: [number, number, number]; // Vector tangente 3D (dx, dy, dz)
  magnitud: number;                 // Magnitud del vector
  sentido: 'clockwise' | 'counterclockwise'; // Sentido de circulación
  color: string;                    // Color para visualización
  esTangente: boolean;              // Indica si es tangente a la curva
}

export interface VectorCirculacionTrayectoria {
  nombre: string;
  cinta: 'S' | 'I' | 'Sigma' | 'Pulsion';
  puntos: VectorCirculacion[];      // Secuencia de vectores a lo largo de la trayectoria
  color: string;
  velocidad: number;                // Velocidad de circulación (0-1)
}

export interface VRParams {
  cinta: 'S' | 'I' | 'Sigma' | 'Pulsion';
  numPuntos: number;
  sentido?: 'clockwise' | 'counterclockwise';
  color?: string;
}

// =============================================================================
// CLASE PARA GENERAR Y GESTIONAR VECTORES DE CIRCULACIÓN
// =============================================================================

export class VectorCirculacionGenerator {
  private model: HornTorusFamiliaModel;
  private vectores: VectorCirculacionTrayectoria[] = [];

  constructor(model: HornTorusFamiliaModel) {
    this.model = model;
  }

  /**
   * Calcula el vector tangente a una curva en el punto (u, v)
   * 
   * METAPSICOLOGÍA: El vector tangente representa la dirección de circulación
   * del significante/pulsión en cada punto de la cinta.
   * 
   * FÓRMULA MATEMÁTICA:
   * Para un toro de revolución parametrizado por (u, v):
   *   x(u,v) = (R + r·cos(v)) · cos(u)
   *   y(u,v) = (R + r·cos(v)) · sin(u)
   *   z(u,v) = r · sin(v)
   * 
   * Vector tangente en u: ∂/∂u = [- (R + r·cos(v)) · sin(u), (R + r·cos(v)) · cos(u), 0]
   * Vector tangente en v: ∂/∂v = [- r·sin(v)·cos(u), - r·sin(v)·sin(u), r·cos(v)]
   * 
   * El vector tangente a la curva en (u,v) es una combinación lineal de estos.
   * 
   * @param u - Coordenada angular
   * @param v - Coordenada de latitud
   * @returns Vector tangente 3D [dx, dy, dz]
   */
  public calcularVectorTangente(u: number, v: number): [number, number, number] {
    const R = this.model.R;
    const r = this.model.r;
    
    // Vector tangente en u (derivada parcial respecto a u)
    const rad = R + r * Math.cos(v);
    const tx_u = -rad * Math.sin(u);
    const ty_u = rad * Math.cos(u);
    const tz_u = 0;
    
    // Vector tangente en v (derivada parcial respecto a v)
    const tx_v = -r * Math.sin(v) * Math.cos(u);
    const ty_v = -r * Math.sin(v) * Math.sin(u);
    const tz_v = r * Math.cos(v);
    
    // Para la circulación a lo largo de u (meridiano), usamos el vector tangente en u
    // Normalizamos el vector
    const longitud = Math.sqrt(tx_u * tx_u + ty_u * ty_u + tz_u * tz_u);
    
    return [
      tx_u / longitud,
      ty_u / longitud,
      tz_u / longitud
    ];
  }

  /**
   * Genera una trayectoria de vectores de circulación a lo largo de una cinta
   * 
   * METAPSICOLOGÍA:
   * - Los VR circulan por las cintas S, I, Σ transportando energía pulsional
   * - Cada vector es tangente a la curva de la cinta
   * - El sentido de circulación depende de la cinta y la dirección elegida
   * 
   * @param params - Parámetros de generación
   * @returns Trayectoria de vectores de circulación
   */
  public generarTrayectoriaVR(params: VRParams): VectorCirculacionTrayectoria {
    const {
      cinta,
      numPuntos = 100,
      sentido = 'clockwise',
      color = this.getColorForCinta(cinta),
    } = params;

    // Obtener la curva correspondiente a la cinta
    const curves = this.model.getSection4Curves(numPuntos);
    const curva = curves[cinta];
    
    if (!curva || curva.length === 0) {
      throw new Error(`No se encontró la curva para la cinta ${cinta}`);
    }

    // Obtener las coordenadas (u, v) para cada punto de la curva
    // Necesitamos invertir el mapeo punto(u,v) -> (x,y,z) para obtener (u,v)
    // Para simplificar, generamos puntos con u equiespaciado
    const puntosVR: VectorCirculacion[] = [];
    
    for (let i = 0; i <= numPuntos; i++) {
      const u = (i / numPuntos) * 2 * Math.PI;
      
      // Obtener v según la cinta recorriendo toda la superficie del horn torus
      let v: number;
      switch (cinta) {
        case 'S':
          v = u + this.model.v_S;
          break;
        case 'I':
          v = -u + this.model.v_I;
          break;
        case 'Sigma':
          v = 2.0 * u + this.model.v_Sigma;
          break;
        case 'Pulsion':
          v = u + this.model.v_I + 0.35 + 0.15 * Math.sin(3.0 * u) * this.model.pulsion_attachment_strength;
          break;
        default:
          v = u;
      }

      // Calcular vector tangente
      const vectorTangente = this.calcularVectorTangente(u, v);
      
      // Ajustar sentido: invertir si es counterclockwise
      const sentidoMultiplicador = sentido === 'counterclockwise' ? -1 : 1;
      
      const vectorFinal: [number, number, number] = [
        vectorTangente[0] * sentidoMultiplicador,
        vectorTangente[1] * sentidoMultiplicador,
        vectorTangente[2] * sentidoMultiplicador,
      ];

      // Calcular magnitud (siempre 1 para vectores normalizados)
      const magnitud = Math.sqrt(
        vectorFinal[0] * vectorFinal[0] + 
        vectorFinal[1] * vectorFinal[1] + 
        vectorFinal[2] * vectorFinal[2]
      );

      const vectorCirculacion: VectorCirculacion = {
        nombre: `VR-${cinta}-${i}`,
        cinta,
        posicion: [u, v],
        direccion: vectorFinal,
        magnitud,
        sentido,
        color,
        esTangente: true,
      };

      puntosVR.push(vectorCirculacion);
    }

    const trayectoria: VectorCirculacionTrayectoria = {
      nombre: `VR-${cinta}`,
      cinta,
      puntos: puntosVR,
      color,
      velocidad: 0.5,
    };

    this.vectores.push(trayectoria);
    
    return trayectoria;
  }

  /**
   * Genera vectores de circulación desde el agujero de la voz
   * 
   * METAPSICOLOGÍA:
   * Los VR parten del origen (la voz) y se distribuyen por las cintas.
   * Esto representa cómo la voz emite significante que circula por S, I, Σ.
   * 
   * @param numRayos - Número de rayos/vectores a generar desde la voz
   * @param longitud - Longitud de los vectores
   * @returns Arreglo de vectores de circulación desde la voz
   */
  public generarVRDesdeVoz(numRayos: number = 8, longitud: number = 5): VectorCirculacion[] {
    const vectoresDesdeVoz: VectorCirculacion[] = [];
    
    for (let i = 0; i < numRayos; i++) {
      const angulo = (i / numRayos) * 2 * Math.PI;
      
      // Direcciones equiespaciadas en el plano XY (paralelo al plano del toro)
      const dx = Math.cos(angulo);
      const dy = Math.sin(angulo);
      const dz = 0.1 * Math.sin(angulo * 2); // Pequeña variación en Z
      
      // Normalizar
      const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      const cinta = this.determinarCintaDesdeAngulo(angulo);
      const color = this.getColorForCinta(cinta);

      const vector: VectorCirculacion = {
        nombre: `VR-Voz-${i}`,
        cinta,
        posicion: [0, Math.PI], // Posición en la voz (v = π)
        direccion: [dx / mag, dy / mag, dz / mag],
        magnitud: longitud,
        sentido: i % 2 === 0 ? 'clockwise' : 'counterclockwise',
        color,
        esTangente: false, // Estos vectores no son tangentes a una curva específica
      };

      vectoresDesdeVoz.push(vector);
    }

    return vectoresDesdeVoz;
  }

  /**
   * Determina a qué cinta pertenece un ángulo dado
   */
  private determinarCintaDesdeAngulo(angulo: number): 'S' | 'I' | 'Sigma' | 'Pulsion' {
    const normalizado = angulo % (2 * Math.PI);
    
    if (normalizado < Math.PI / 2) return 'S';
    if (normalizado < Math.PI) return 'I';
    if (normalizado < 3 * Math.PI / 2) return 'Sigma';
    return 'Pulsion';
  }

  /**
   * Obtiene el color correspondiente a cada cinta
   */
  private getColorForCinta(cinta: 'S' | 'I' | 'Sigma' | 'Pulsion'): string {
    switch (cinta) {
      case 'S': return COLOR_PALETTE.S;
      case 'I': return COLOR_PALETTE.I;
      case 'Sigma': return COLOR_PALETTE.Sigma;
      case 'Pulsion': return COLOR_PALETTE.Pulsion;
      default: return COLOR_PALETTE.S;
    }
  }

  /**
   * Genera vectores de circulación para el trauma (S-E-I congelado)
   * 
   * METAPSICOLOGÍA:
   * El trauma es un punto donde S, I, Σ están congelados por la Nachträglichkeit.
   * Los VR en el trauma están bloqueados, pero pueden ser liberados.
   * 
   * @param numPuntos - Número de vectores alrededor del trauma
   * @returns Trayectoria de vectores en el trauma
   */
  public generarVRTrauma(numPuntos: number = 50): VectorCirculacionTrayectoria {
    const puntosVR: VectorCirculacion[] = [];
    const u_T = this.model.u_T;
    const v_T = this.model.v_T;
    
    for (let i = 0; i <= numPuntos; i++) {
      const angulo = (i / numPuntos) * 2 * Math.PI;
      
      // Vectores circulares alrededor del punto del trauma
      const u = u_T + 0.1 * Math.cos(angulo);
      const v = v_T + 0.1 * Math.sin(angulo);
      
      // Calcular vector tangente
      const vectorTangente = this.calcularVectorTangente(u, v);
      
      // En el trauma, los vectores tienen magnitud reducida (congelados)
      const vectorFinal: [number, number, number] = [
        vectorTangente[0] * 0.3, // Reducido: congelado
        vectorTangente[1] * 0.3,
        vectorTangente[2] * 0.3,
      ];

      const vector: VectorCirculacion = {
        nombre: `VR-Trauma-${i}`,
        cinta: 'Sigma', // El trauma está principalmente en Σ
        posicion: [u, v],
        direccion: vectorFinal,
        magnitud: 0.3, // Magnitud reducida
        sentido: 'clockwise',
        color: COLOR_PALETTE.trauma,
        esTangente: true,
      };

      puntosVR.push(vector);
    }

    const trayectoria: VectorCirculacionTrayectoria = {
      nombre: 'VR-Trauma',
      cinta: 'Sigma',
      puntos: puntosVR,
      color: COLOR_PALETTE.trauma,
      velocidad: 0.1, // Velocidad reducida (congelado)
    };

    this.vectores.push(trayectoria);
    
    return trayectoria;
  }

  /**
   * Genera la representación de la fantasía: anclada en el inconsciente.
   * 
   * METAPSICOLOGÍA (Lacan):
   * La fantasía fundamental ($ ◇ a) está anclada en el inconsciente.
   * Es un punto fijo estructural donde NO hay circulación ni emisión de vectores:
   * NO SALEN VECTORES de la fantasía.
   * 
   * @returns Trayectoria de fantasía anclada en el inconsciente sin emisión de vectores
   */
  public generarVRFantasia(): VectorCirculacionTrayectoria {
    // La fantasía está anclada en el inconsciente (u_F, v_F) y NO emite vectores
    const trayectoria: VectorCirculacionTrayectoria = {
      nombre: 'VR-Fantasia (Anclado en el Inconsciente)',
      cinta: 'Sigma',
      puntos: [], // Sin emisión de vectores: no salen vectores
      color: COLOR_PALETTE.fant,
      velocidad: 0.0, // Velocidad cero: punto fijo / anclaje
    };

    this.vectores.push(trayectoria);
    
    return trayectoria;
  }

  /**
   * Obtiene todas las trayectorias de vectores generadas
   */
  public getTrayectorias(): VectorCirculacionTrayectoria[] {
    return [...this.vectores];
  }

  /**
   * Limpia todas las trayectorias de vectores
   */
  public clearTrayectorias(): void {
    this.vectores = [];
  }

  /**
   * Obtiene los puntos 3D para visualizar una trayectoria de vectores
   */
  public getTrayectoria3D(trayectoria: VectorCirculacionTrayectoria): {
    puntos: [number, number, number][];
    vectores: [number, number, number][];
  } {
    const puntos: [number, number, number][] = [];
    const vectores: [number, number, number][] = [];
    
    trayectoria.puntos.forEach((vector) => {
      const [u, v] = vector.posicion;
      const punto = this.model.punto(u, v);
      puntos.push(punto);
      
      // El vector dirección ya está en coordenadas 3D
      vectores.push(vector.direccion);
    });
    
    return { puntos, vectores };
  }
}

// =============================================================================
// INTERFAZ PARA CIRCULACIÓN DE SIGNIFICANTE/SIGNIFICADO
// =============================================================================

export interface SignificanteCirculacion {
  nombre: string;           // Nombre del significante (ej: "madre", "padre", "falo")
  significado: string;       // Significado asociado (puede ser vacío o múltiple)
  posicionInicial: [number, number]; // Posición inicial (u, v) en el toro
  trayectoria: [number, number][];   // Secuencia de posiciones en la circulación
  color: string;            // Color para visualización
  velocidad: number;        // Velocidad de circulación (0-1)
  direccion: 'clockwise' | 'counterclockwise'; // Dirección de circulación
}

export interface CirculacionParams {
  significante: string;
  significado: string;
  uStart: number;
  vStart: number;
  numPasos: number;
  deltaU: number;
  color?: string;
}

export class SignificanteTracker {
  private model: HornTorusFamiliaModel;
  private circulaciones: SignificanteCirculacion[] = [];
  
  constructor(model: HornTorusFamiliaModel) {
    this.model = model;
  }
  
  /**
   * Genera una trayectoria de circulación para un significante
   * 
   * METAPSICOLOGÍA (Lacan):
   * El significante circula en la cadena significante (S). Esta circulación
   * es lo que produce efectos de significado, pero el significado nunca
   * se fija completamente ("el significante representa al sujeto para
   * otro significante", Sem. XI).
   * 
   * En el horn torus:
   * - La circulación ocurre a lo largo de la curva S (Significante)
   * - Puede seguir el meridiano (u) o el paralelo (v)
   * - La dirección indica el sentido de la cadena
   * 
   * @param params - Parámetros de circulación
   * @returns Objeto SignificanteCirculacion con la trayectoria completa
   */
  public generarCirculacion(params: CirculacionParams): SignificanteCirculacion {
    const {
      significante,
      significado,
      uStart,
      vStart,
      numPasos = 100,
      deltaU = (2 * Math.PI) / numPasos,
      color = COLOR_PALETTE.S,
    } = params;
    
    const trayectoria: [number, number][] = [];
    
    for (let i = 0; i <= numPasos; i++) {
      const u = (uStart + i * deltaU) % (2 * Math.PI);
      const v = vStart; // Circulación a v constante (paralelo)
      trayectoria.push([u, v]);
    }
    
    const circulacion: SignificanteCirculacion = {
      nombre: significante,
      significado: significado,
      posicionInicial: [uStart, vStart],
      trayectoria,
      color,
      velocidad: 0.5,
      direccion: deltaU > 0 ? 'clockwise' : 'counterclockwise',
    };
    
    this.circulaciones.push(circulacion);
    
    return circulacion;
  }
  
  /**
   * Genera circulación a lo largo de la curva S (Significante)
   * 
   * METAPSICOLOGÍA:
   * Esta es la circulación "canónica" del significante en la cadena.
   * Sigue la curva S que representa la cadena significante en el toro.
   */
  public generarCirculacionEnS(
    significante: string,
    significado: string,
    numPasos: number = 100
  ): SignificanteCirculacion {
    const curves = this.model.getSection4Curves(numPasos);
    const sCurve = curves.S;
    
    // Extraer coordenadas (u,v) de la curva S
    // La curva S está en coordenadas cartesianas, necesitamos invertir
    const trayectoria: [number, number][] = [];
    
    for (let i = 0; i <= numPasos; i++) {
      // Para simplificar, generamos puntos a lo largo de u con v constante
      // usando la fase v_S del modelo
      const u = (i / numPasos) * 2 * Math.PI;
      const v = this.model.v_S;
      trayectoria.push([u, v]);
    }
    
    const circulacion: SignificanteCirculacion = {
      nombre: significante,
      significado: significado,
      posicionInicial: [0, this.model.v_S],
      trayectoria,
      color: COLOR_PALETTE.S,
      velocidad: 0.5,
      direccion: 'clockwise',
    };
    
    this.circulaciones.push(circulacion);
    
    return circulacion;
  }
  
  /**
   * Genera circulación entre significante y significado
   * 
   * METAPSICOLOGÍA:
   * En la teoría lacaniana, el significante y el significado están
   * separados por la barra del sujeto (S/s). El significante circula
   * buscando al significado, pero nunca lo alcanza completamente.
   * 
   * En el horn torus:
   * - El significante está en la curva S
   * - El significado puede estar en la curva I (Imagen) o Σ (Síntoma)
   * - La circulación muestra este "buscar sin encontrar"
   */
  public generarCirculacionSignificanteSignificado(
    significante: string,
    significado: string,
    numPasos: number = 100
  ): { significante: SignificanteCirculacion; significado: SignificanteCirculacion } {
    // Circulación del significante en curva S
    const circSignificante = this.generarCirculacionEnS(significante, "", numPasos);
    
    // Circulación del significado en curva I (Imagen)
    const curves = this.model.getSection4Curves(numPasos);
    const trayectoriaI: [number, number][] = [];
    
    for (let i = 0; i <= numPasos; i++) {
      const u = (i / numPasos) * 2 * Math.PI;
      const v = this.model.v_I;
      trayectoriaI.push([u, v]);
    }
    
    const circSignificado: SignificanteCirculacion = {
      nombre: `significado: ${significado}`,
      significado: significado,
      posicionInicial: [0, this.model.v_I],
      trayectoria: trayectoriaI,
      color: COLOR_PALETTE.I,
      velocidad: 0.4,
      direccion: 'counterclockwise',
    };
    
    this.circulaciones.push(circSignificado);
    
    return { significante: circSignificante, significado: circSignificado };
  }
  
  /**
   * Genera circulación que pasa por la zona de ruptura
   * 
   * METAPSICOLOGÍA:
   * Cuando el significante circula cerca del fantasma (u_F, v_F),
   * entra en la zona de ruptura (A ≤ π/4) donde ocurre
   * la angustia de castración.
   */
  public generarCirculacionConRuptura(
    significante: string,
    numPasos: number = 100
  ): SignificanteCirculacion {
    const trayectoria: [number, number][] = [];
    const u_F = this.model.u_F;
    const v_F = this.model.v_F;
    const A_cr = this.model.A_cr;
    
    for (let i = 0; i <= numPasos; i++) {
      const u = (i / numPasos) * 2 * Math.PI;
      // Oscilar alrededor de v_F con amplitud que entra en zona de ruptura
      const v = v_F + A_cr * 0.8 * Math.sin((i / numPasos) * 2 * Math.PI);
      trayectoria.push([u, v]);
    }
    
    const circulacion: SignificanteCirculacion = {
      nombre: significante,
      significado: "Ruptura / Angustia de castración",
      posicionInicial: [0, v_F],
      trayectoria,
      color: "#dc2626", // Rojo intenso para ruptura
      velocidad: 0.3,
      direccion: 'clockwise',
    };
    
    this.circulaciones.push(circulacion);
    
    return circulacion;
  }
  
  /**
   * Obtiene todas las circulaciones generadas
   */
  public getCirculaciones(): SignificanteCirculacion[] {
    return [...this.circulaciones];
  }
  
  /**
   * Limpia todas las circulaciones
   */
  public clearCirculaciones(): void {
    this.circulaciones = [];
  }
  
  /**
   * Genera puntos 3D para visualizar una circulación
   */
  public getCirculacion3D(circulacion: SignificanteCirculacion): [number, number, number][] {
    return circulacion.trayectoria.map(([u, v]) => {
      return this.model.punto(u, v);
    });
  }
  
  /**
   * Verifica si un punto de la circulación está en zona de ruptura
   */
  public checkRupturaEnTrayectoria(circulacion: SignificanteCirculacion): boolean[] {
    return circulacion.trayectoria.map(([u, v]) => {
      return this.model.checkRupture(u, v);
    });
  }
  
  /**
   * Calcula la angustia en cada punto de la circulación
   */
  public calculateAngustiaEnTrayectoria(circulacion: SignificanteCirculacion): number[] {
    return circulacion.trayectoria.map(([u, v]) => {
      return this.model.calculateAngustia(u, v);
    });
  }
}

export interface InvariantSummary {
  r_over_R: number;
  R: number;
  r: number;
  radio_agujero: number;
  regimen: string;
  es_variedad: boolean;
  euler_characteristic: number;
  rango_H1: number;
  H1: string;
  area: number;
  volumen: number;
  curvatura_gauss_max: number;
  curvatura_gauss_min: number;
  curvatura_media_promedio: number;
  willmore: number;
  willmore_minimo_familia: number;
}

/**
 * HornTorusFamiliaModel - Modelo de la Familia de Toros de Revolución
 * 
 * Representa la familia continua de toros de revolución parametrizada por r/R ∈ (0, 1]
 * donde r es el radio del tubo y R es el radio de revolución.
 * 
 * El caso límite r = R (Horn Torus) NO es una variedad diferenciable:
 * la circunferencia interior v = π colapsa a un punto (la voz).
 */
export class HornTorusFamiliaModel {
  
  // =========================================================================
  // CACHE DE GEOMETRÍA PARA OPTIMIZACIÓN
  // =========================================================================
  // Almacena cálculos redundantes para mejorar performance
  // Esto es especialmente útil cuando se generan múltiples puntos con los mismos
  // parámetros u, v o cuando se recalculan invariantes sin cambios
  
  private _puntoCache: Map<string, [number, number, number]> = new Map();
  private _invariantesCache: InvariantSummary | null = null;
  private _curvesCache: Map<string, any> = new Map();
  public scl90r: SCL90RData;
  public r_over_R: number;
  public a_scale: number;
  public visual_scale: number;
  public deformation_factor: number;
  public a: number;
  public effective_a: number;

  public u_S: number = 0;
  public v_S: number = 0;
  public u_I: number = 0;
  public v_I: number = 0;
  public u_Sigma: number = 0;
  public v_Sigma: number = 0;
  public pulsion_attachment_strength: number = 0.8;

  public u_F: number = Math.PI;
  public v_F: number = Math.PI / 2;
  public u_T: number = 1.95;
  public v_T: number = 2.25;
  public A_cr: number = Math.PI / 4;

  /**
   * Constructor del modelo
   * 
   * @param r_over_R - Cociente de radios r/R ∈ (0, 1]
   *   - r = 0: Toro degenerado (anillo)
   *   - r = R: Horn Torus (límite, no variedad)
   *   - r < R: Toro liso encajado (variedad 2D)
   * @param scl90r - Datos psicométricos SCL-90-R para deformación
   * @param deformation_factor - Factor de deformación armónica (0-1)
   */
  constructor(
    r_over_R: number = 1.0,
    scl90r: Partial<SCL90RData> = {},
    deformation_factor: number = 0.3
  ) {
    // Clamp r_over_R to valid range [0.01, 1.0]
    // 0.01 is the minimum to avoid division by zero in geometric calculations
    this.r_over_R = Math.max(0.01, Math.min(1.0, r_over_R));
    this.scl90r = { ...DEFAULT_SCL90R_DATA, ...scl90r };
    
    // Scaling factors:
    // - a_scale: Escala base para el parámetro 'a'
    // - visual_scale: Escala visual para renderizado 3D
    this.a_scale = 0.1;
    this.visual_scale = 25.0;
    this.deformation_factor = deformation_factor;

    // Calculate 'a' from GSI (Global Severity Index)
    // Con baremo Casullo (2008) T=60: GSI = 1.10
    const gsi = this.scl90r.GSI ?? 1.10;
    this.a = this.a_scale * gsi;
    
    // effective_a is the actual radius used in calculations
    // This represents the scale of the torus in 3D space
    this.effective_a = this.a * this.visual_scale;

    // Calculate Lacanian parameters (u_S, v_S, u_I, v_I, etc.) from SCL-90-R data
    this.calculateLacanianParameters();
  }

  /**
   * Calcula parámetros y fases lacanianas a partir de datos SCL-90-R
   * BAREMO CASULLO – PÉREZ (2008): Población general Buenos Aires (25-60 años, Varones, T=60)
   * 
   * METAPSICOLOGÍA: Cada escala SCL-90-R se mapea a coordenadas (u, v) y fases en el toro:
   * - u: Coordenada angular (meridiano) → Relacionado con lo simbólico
   * - v: Coordenada de latitud (tubo) → Relacionado con lo imaginario
   * 
   * Las fases (u_S, v_S, u_I, v_I, u_Sigma, v_Sigma) determinan la posición y oscilación
   * de las cintas S, I, Σ y el hilo pulsional en la superficie.
   * 
   * Valores de corte (T = 60):
   * SOM: 1.08 | OBS: 1.70 | SI: 1.33 | DEP: 1.38 | ANS: 1.30 | HOS: 1.33 | FOB: 0.57 | PAR: 1.50 | PSIC: 0.90
   * IGS: 1.10 | TSP: 52.00 | IMSP: 2.25
   */
  private calculateLacanianParameters(): void {
    const n = 9;  // Factor de normalización para coordenadas u (9 escalas primarias)
    const u_scale = 2 * Math.PI;  // Círculo completo para u
    const v_scale = Math.PI;       // Semicírculo base para v

    // S (Significante) - Cadena de significantes
    // u_S: Posición meridiana basada en Ansiedad + Obsesión-Compulsión
    // Con valores de corte T=60: Ansiedad = 1.30, Obsesión = 1.70 -> suma = 3.00
    // u_S = 2π * 3.00 / 9 = 2π/3 ≈ 2.0944 rad (120°)
    const anxiety = this.scl90r.Ansiedad ?? 1.30;
    const obsession = this.scl90r["Obsesion-Compulsion"] ?? 1.70;
    this.u_S = (u_scale * (anxiety + obsession)) / n;

    // v_S: Latitud basada en IMSP / PSDI (Índice de Malestar Síntomas Positivos)
    // Con valor de corte T=60: PSDI = 2.25
    // v_S = π * (1 + 2.25) = 3.25π -> phi_S = v_S mod 2π = 1.25π (3.927 rad)
    const psdi = this.scl90r.PSDI ?? 2.25;
    this.v_S = v_scale * (1 + psdi);

    // I (Imagen del cuerpo / Imago)
    // u_I: Basada en Somatización + Sensibilidad Interpersonal
    // Con valores de corte T=60: Somatización = 1.08, SI = 1.33 -> suma = 2.41
    // u_I = 2π * 2.41 / 9 ≈ 1.6825 rad (96.4°)
    const somatization = this.scl90r.Somatizacion ?? 1.08;
    const interpersonal = this.scl90r["Sensibilidad Interpersonal"] ?? 1.33;
    this.u_I = (u_scale * (somatization + interpersonal)) / n;

    // v_I: Latitud basada en TSP / PST (Total de Síntomas Positivos)
    // En Casullo (2008), TSP es conteo de ítems (0-90, con corte T=60 = 52.00).
    // Normalizamos por 90 ítems (pstNorm = 52/90 ≈ 0.5778) para mantener la fase
    // armónica en la cara interna del toroide sin colapsar artificialmente a v=π (la voz).
    const pst = this.scl90r.PST ?? 52.00;
    const pstNorm = pst > 1.5 ? pst / 90.0 : pst;
    this.v_I = v_scale * (1 + pstNorm);

    // Pulsión (Trieb)
    // Fuerza de apego pulsional al borde erógeno de I:
    // A mayor somatización → mayor tensión/fijación corporal
    // A mayor depresión → menor invested energy / debilitamiento del empuje pulsional
    // Con valores de corte T=60: Somatización = 1.08, Depresión = 1.38
    // attachment = 0.88 + 1.08*0.12 - 1.38*0.15 = 0.8026
    const depression = this.scl90r.Depresion ?? 1.38;
    this.pulsion_attachment_strength = Math.min(
      1.0,
      Math.max(0.3, 0.88 + somatization * 0.12 - depression * 0.15)
    );

    // Σ (Síntoma / Sinthome de anudamiento y estabilización)
    // u_Sigma: Basada en Psicoticismo + Hostilidad
    // Con valores de corte T=60: Psicoticismo = 0.90, Hostilidad = 1.33 -> suma = 2.23
    // u_Sigma = 2π * 2.23 / 9 ≈ 1.5568 rad (89.2°)
    const psychoticism = this.scl90r.Psicoticismo ?? 0.90;
    const hostility = this.scl90r.Hostilidad ?? 1.33;
    this.u_Sigma = (u_scale * (psychoticism + hostility)) / n;
    
    // v_Sigma: Latitud basada en Psicoticismo (con corte T=60 = 0.90)
    // v_Sigma = π * (1 + 0.90) = 1.90π (5.969 rad)
    this.v_Sigma = v_scale * (1 + psychoticism);
  }

  /**
   * Resumen de las fases lacanianas y parámetros de curvatura derivados del perfil psicométrico
   */
  public getFasesLacanianas() {
    return {
      u_S: this.u_S,
      v_S: this.v_S,
      phi_S: this.v_S % (2 * Math.PI),
      u_I: this.u_I,
      v_I: this.v_I,
      phi_I: this.v_I % (2 * Math.PI),
      u_Sigma: this.u_Sigma,
      v_Sigma: this.v_Sigma,
      phi_Sigma: this.v_Sigma % (2 * Math.PI),
      pulsion_attachment_strength: this.pulsion_attachment_strength,
      effective_a: this.effective_a,
      a: this.a,
    };
  }

  public get R(): number {
    return this.effective_a;
  }

  public get r(): number {
    return this.r_over_R * this.effective_a;
  }

  public get es_limite(): boolean {
    return this.r_over_R >= 0.9999;
  }

  public get radio_agujero(): number {
    return this.R - this.r;
  }

  /**
   * Calcula un punto en la superficie del toro de revolución
   * 
   * FÓRMULA MATEMÁTICA:
   * Para un toro de revolución con radio mayor R y radio menor r:
   *   x(u,v) = (R + r·cos(v)) · cos(u)
   *   y(u,v) = (R + r·cos(v)) · sin(u)
   *   z(u,v) = r · sin(v)
   * 
   * Donde:
   *   u ∈ [0, 2π): ángulo meridiano (coordenada angular)
   *   v ∈ [0, 2π): ángulo de latitud en el tubo (coordenada polar)
   * 
   * En el límite r = R y v = π:
   *   x(u,π) = (R + R·cos(π)) · cos(u) = (R - R) · cos(u) = 0
   *   y(u,π) = (R + R·cos(π)) · sin(u) = (R - R) · sin(u) = 0
   *   z(u,π) = R · sin(π) = 0
   *   → Todas las curvas con v = π colapsan al origen (LA VOZ)
   * 
   * @param u - Coordenada angular (meridiano)
   * @param v - Coordenada de latitud (tubo)
   * @param rho - Radio del tubo opcional (default: this.r)
   * @returns Tupla [x, y, z] con coordenadas cartesianas
   */
  public punto(
    u: number,
    v: number,
    rho?: number
  ): [number, number, number] {
    // Generar clave única para el cache
    const cacheKey = `${u.toFixed(6)}_${v.toFixed(6)}_${rho !== undefined ? rho.toFixed(6) : 'default'}`;
    
    // Verificar si el punto ya está en cache
    if (this._puntoCache.has(cacheKey)) {
      return this._puntoCache.get(cacheKey)!;
    }
    
    const tubeRadius = rho !== undefined ? rho : this.r;
    const rad = this.R + tubeRadius * Math.cos(v);
    const x = rad * Math.cos(u);
    const y = rad * Math.sin(u);
    const z = tubeRadius * Math.sin(v);
    
    const result: [number, number, number] = [x, y, z];
    
    // Almacenar en cache
    this._puntoCache.set(cacheKey, result);
    
    // Limitar tamaño del cache para evitar consumo excesivo de memoria
    if (this._puntoCache.size > 10000) {
      // Eliminar la primera entrada (FIFO)
      const firstKey = this._puntoCache.keys().next().value;
      if (firstKey) this._puntoCache.delete(firstKey);
    }
    
    return result;
  }

  /**
   * Calcula la deformación psicométrica de la superficie
   * 
   * METAPSICOLOGÍA: Esta función implementa el acoplamiento entre
   * el modelo geométrico y los datos psicométricos SCL-90-R.
   * 
   * La deformación se calcula como una combinación lineal de armónicos:
   *   perturbation = w₁·sin(u)·cos(v) + w₂·cos(2u)·sin(v) + w₃·sin(3u)·cos(2v)
   *                + w_psic·harmonic_psic + w_ans·harmonic_ans
   * 
   * Donde los pesos wᵢ dependen de las escalas SCL-90-R (Casullo, 2008):
   *   w₁ = 0.45 · GSI       (Índice de Severidad Global)
   *   w₂ = 0.35 · PST/90    (Total de Síntomas Positivos normalizado)
   *   w₃ = 0.20 · (PSDI/2)  (Índice de Malestar de Síntomas Positivos / 2)
   *   w_psic = 0.35·(PSIC - 0.90)⁺ + 0.15·(PAR - 1.50)⁺ (Efracción psicótica y asedio del Otro)
   *   w_ans = 0.25·(ANS - 1.30)⁺ (Tensión de angustia toroidal)
   * 
   * El factor de deformación final es:
   *   factor = 1 + δ · perturbation
   * 
   * Donde δ es el deformation_factor (0-1) que controla la intensidad.
   * En picos psicóticos agudos fuera de baremo, δ escala dinámicamente
   * evidenciando la efracción topológica previa a la reconfiguración sinthomática.
   * 
   * @param u - Coordenada angular
   * @param v - Coordenada de latitud
   * @returns Objeto con factor de deformación y nivel de stress
   */
  public computeSclDeformation(u: number, v: number): { factor: number; stress: number } {
    const delta = this.deformation_factor;
    const gsi = this.scl90r.GSI ?? 1.10;
    const pst = this.scl90r.PST ?? 52.00;
    const pstNorm = pst > 1.5 ? pst / 90.0 : pst;
    const psdi = this.scl90r.PSDI ?? 2.25;

    // Componentes específicas con sensibilidad clínica directa
    const psic = this.scl90r.Psicoticismo ?? 0.90;
    const par = this.scl90r["Ideacion Paranoide"] ?? 1.50;
    const ans = this.scl90r.Ansiedad ?? 1.30;

    // Armónicos esféricos base para la deformación
    const harmonic1 = Math.sin(u) * Math.cos(v);
    const harmonic2 = Math.cos(2 * u) * Math.sin(v);
    const harmonic3 = Math.sin(3 * u) * Math.cos(2 * v);

    // Armónico de psicoticismo (efracción y abombamiento asimétrico cuadrupolar):
    // Se activa cuando supera el corte clínico Casullo (0.90) y se acopla a la fase del sinthome (v_Sigma)
    const psicExcess = Math.max(0, psic - 0.90);
    const parExcess = Math.max(0, par - 1.50);
    const harmonicPsic = Math.sin(4 * u + this.v_Sigma) * Math.cos(v) + Math.cos(2 * u) * Math.sin(2 * v);
    const weightPsic = 0.35 * psicExcess + 0.15 * parExcess;

    // Armónico de angustia focal (tensión latitudinal acoplada a la garganta interior y polo fantasmático)
    const ansExcess = Math.max(0, ans - 1.30);
    const harmonicAns = Math.sin(2 * v) * Math.cos(u - Math.PI);
    const weightAns = 0.25 * ansExcess;

    // Pesos basados en escalas SCL-90-R Casullo (2008)
    const weight1 = 0.45 * gsi;
    const weight2 = 0.35 * pstNorm;
    const weight3 = 0.20 * (psdi / 2.0);

    // Combinación lineal de armónicos
    const perturbation =
      weight1 * harmonic1 +
      weight2 * harmonic2 +
      weight3 * harmonic3 +
      weightPsic * harmonicPsic +
      weightAns * harmonicAns;
    
    // Factor de deformación: 1 + δ * perturbation
    const factor = 1.0 + delta * perturbation;
    
    // Stress: magnitud absoluta de la perturbación
    const stress = Math.abs(perturbation);

    return { factor, stress };
  }

  /**
   * Calcula la distancia angular envuelta en el toro
   * 
   * FÓRMULA: Distancia euclidiana en el espacio de coordenadas (u,v)
   * con envolvente toroidal (módulo 2π)
   * 
   * Para dos puntos (u,v) y (u₀,v₀) en el toro:
   *   Δu = (u - u₀) mod 2π, normalizado a [-π, π]
   *   Δv = (v - v₀) mod 2π, normalizado a [-π, π]
   *   distancia = √(Δu² + Δv²)
   * 
   * Esta métrica se usa para calcular la angustia como distancia
   * al punto fantasmático (u_F, v_F).
   * 
   * @param u - Coordenada u del primer punto
   * @param v - Coordenada v del primer punto
   * @param u0 - Coordenada u del segundo punto
   * @param v0 - Coordenada v del segundo punto
   * @returns Distancia angular en el espacio (u,v)
   */
  public distanciaAngular(u: number, v: number, u0: number, v0: number): number {
    // Normalizar diferencia en u a [-π, π]
    let du = (u - u0) % (2 * Math.PI);
    if (du > Math.PI) du -= 2 * Math.PI;
    if (du < -Math.PI) du += 2 * Math.PI;

    // Normalizar diferencia en v a [-π, π]
    let dv = (v - v0) % (2 * Math.PI);
    if (dv > Math.PI) dv -= 2 * Math.PI;
    if (dv < -Math.PI) dv += 2 * Math.PI;

    // Distancia euclidiana en el espacio (u,v)
    return Math.hypot(du, dv);
  }

  /**
   * Calcula el nivel de angustia en un punto (u,v)
   * 
   * METAPSICOLOGÍA: La angustia se define como la distancia angular
   * al núcleo fantasmático (u_F, v_F).
   * 
   * A(u,v) = distanciaAngular(u, v, u_F, v_F)
   * 
   * Esta métrica implementa el mecanismo métrico de la angustia:
   * la angustia crece al acercarse al trauma (punto fantasmático).
   * 
   * @param u - Coordenada angular
   * @param v - Coordenada de latitud
   * @returns Valor de angustia A(u,v)
   */
  public calculateAngustia(u: number, v: number): number {
    return this.distanciaAngular(u, v, this.u_F, this.v_F);
  }

  /**
   * Verifica si un punto está en la zona de ruptura
   * 
   * METAPSICOLOGÍA: La zona de ruptura se define como el conjunto
   * de puntos donde la angustia supera un umbral crítico:
   * 
   * Ruptura(u,v) = true  si A(u,v) ≤ A_cr
   * Ruptura(u,v) = false si A(u,v) > A_cr
   * 
   * Donde A_cr = π/4 es el umbral crítico de angustia.
   * 
   * En la zona de ruptura (A ≤ π/4), el sujeto experimenta
   * una discontinuidad en la estructura psíquica.
   * 
   * @param u - Coordenada angular
   * @param v - Coordenada de latitud
   * @returns true si el punto está en zona de ruptura, false en caso contrario
   */
  public checkRupture(u: number, v: number): boolean {
    return this.calculateAngustia(u, v) <= this.A_cr;
  }

  /**
   * Calcula todos los invariantes geométricos y topológicos
   * 
   * FÓRMULAS MATEMÁTICAS:
   * 
   * 1. Área superficial: A = 4π²·R·r
   *    - Para un toro de revolución, el área es el producto de las circunferencias
   *    - de la trayectoria central (2πR) y la sección transversal (2πr)
   * 
   * 2. Volumen: V = 2π²·R·r²
   *    - Teorema de Pappus: volumen = área de la sección × distancia recorrida por su centroide
   *    - Sección circular de área πr² recorre 2πR
   * 
   * 3. Curvatura de Gauss:
   *    - K_max = 1/(r(R+r)) → Curvatura máxima (exterior)
   *    - K_min = -1/(r(R-r)) → Curvatura mínima (interior, negativa = "silla")
   *    - En el límite r→R: K_min → -∞ (divergencia en el horn torus)
   * 
   * 4. Curvatura media: H = 1/(2r)
   *    - Promedio sobre toda la superficie
   * 
   * 5. Energía de Willmore: W = ∫H² dA
   *    - Para toro de revolución: W = π² / (x·√(1-x²)) donde x = r/R
   *    - Mínimo en x = 1/√2 (Toro de Clifford): W = 2π² ≈ 19.7392
   *    - En el límite r→R (x→1): W → +∞ (divergencia)
   *    - Conjetura de Willmore: 2π² es el mínimo para cualquier superficie
   *      (probada por Marques y Neves, 2014)
   * 
   * 6. Característica de Euler: χ
   *    - χ = 0 para toros lisos (r < R)
   *    - χ = 1 para horn torus (r = R) → Salto topológico
   * 
   * 7. Grupo de Homología: H₁
   *    - H₁ = ℤ² para toros lisos (dos ciclos independientes: meridiano y paralelo)
   *    - H₁ = ℤ para horn torus (solo un ciclo, el meridiano sobrevive)
   *    - El paralelo interior λ_int colapsa a un punto
   * 
   * @returns Objeto InvariantSummary con todos los invariantes calculados
   */
  public invariantes(): InvariantSummary {
    // Verificar cache
    if (this._invariantesCache) {
      return this._invariantesCache;
    }
    
    const R = this.R;
    const r = this.r;
    const limite = this.es_limite;
    const x = this.r_over_R;

    // Energía de Willmore
    // W = π² / (x · √(1 - x²)) para x ∈ (0, 1)
    // En x = 1/√2: W = π² / ((1/√2) · √(1 - 1/2)) = π² / ((1/√2) · (1/√2)) = π² / (1/2) = 2π²
    const willmore = limite
      ? Infinity
      : (Math.PI * Math.PI) / (x * Math.sqrt(Math.max(1e-10, 1.0 - x * x)));

    // Curvaturas de Gauss
    // K_max = 1/(r(R+r)) - curvatura máxima (punto exterior)
    // K_min = -1/(r(R-r)) - curvatura mínima (punto interior, tipo "silla")
    const k_min = limite ? -Infinity : -1.0 / (r * (R - r));
    const k_max = 1.0 / (r * (R + r));

    const result: InvariantSummary = {
      r_over_R: this.r_over_R,
      R,
      r,
      radio_agujero: this.radio_agujero,
      regimen: limite ? "Límite (toro pinchado — objeto no variedad)" : "Toro liso encajado estándar",
      es_variedad: !limite,
      euler_characteristic: limite ? 1 : 0,
      rango_H1: limite ? 1 : 2,
      H1: limite ? "Z⟨μ⟩" : "Z²⟨μ, λ⟩",
      area: 4 * Math.PI * Math.PI * R * r,
      volumen: 2 * Math.PI * Math.PI * R * r * r,
      curvatura_gauss_max: k_max,
      curvatura_gauss_min: k_min,
      curvatura_media_promedio: 1.0 / (2 * r),
      willmore,
      willmore_minimo_familia: 2 * Math.PI * Math.PI, // 19.7392
    };
    
    // Almacenar en cache
    this._invariantesCache = result;
    
    return result;
  }

  /**
   * Genera las curvas conforme al Capítulo §4 (trenza sin tocar v = π)
   * 
   * METAPSICOLOGÍA: Estas curvas representan las formaciones del inconsciente:
   * - S: Cadena significante (orden simbólico)
   * - I: Imagen del cuerpo / Imago (orden imaginario)
   * - Pulsión: Hilo pulsional (Trieb) - energía libidinal
   * - Σ: Síntoma - formación de compromiso
   * - λ_int: Longitud interior (v = π) - colapsa a la voz en el límite
   * 
   * Las curvas están trenzadas en la banda [0.45, 2.70] rad de la cara interna
   * y NUNCA tocan el punto de la voz (v = π) en el horn torus.
   * 
   * @param points - Número de puntos por curva (default: 240)
   * @returns Objeto con todas las curvas y puntos especiales
   */
  public getSection4Curves(points: number = 240) {
    const uVals: number[] = [];
    for (let i = 0; i <= points; i++) {
      uVals.push((i / points) * 2 * Math.PI);
    }

    // Fases de las curvas (desplazamientos en u)
    // Estas fases determinan la posición relativa de las cintas
    const phi_S = this.v_S % (2 * Math.PI);
    const phi_I = this.v_I % (2 * Math.PI);
    const phi_Sigma = this.v_Sigma % (2 * Math.PI);

    // Radio ligeramente sobreelevado para las cintas (101.5% del radio del tubo)
    // para que recorran la superficie exterior e interior sin quedar ocluidas
    const rho = 1.015 * this.r;

    const sCurve: [number, number, number][] = [];
    const iCurve: [number, number, number][] = [];
    const pCurve: [number, number, number][] = [];
    const sigmaCurve: [number, number, number][] = [];
    const lambdaIntCurve: [number, number, number][] = [];

    for (const u of uVals) {
      // Las cintas recorren toda la superficie del horn torus (cubriendo latitud v en [0, 2π])
      // Pasando por la cara exterior (v=0), polo superior (v=π/2), garganta interior (v=π) y vientre inferior (v=3π/2)
      const v_s = u + phi_S;
      const v_i = -u + phi_I;
      const v_sg = 2.0 * u + phi_Sigma;
      const v_p = u + phi_I + 0.35 + 0.15 * Math.sin(3.0 * u) * this.pulsion_attachment_strength;

      // Generar puntos en las curvas recorriendo toda la superficie del horn torus
      sCurve.push(this.punto(u, v_s, rho));
      iCurve.push(this.punto(u, v_i, rho));
      pCurve.push(this.punto(u, v_p, rho));
      sigmaCurve.push(this.punto(u, v_sg, rho));
      
      // λ_int: Longitud interior en v = π
      // En el límite r→R, esta curva colapsa al origen (la voz)
      lambdaIntCurve.push(this.punto(u, Math.PI, this.r));
    }

    return {
      S: sCurve,
      I: iCurve,
      Pulsion: pCurve,
      Sigma: sigmaCurve,
      lambdaInt: lambdaIntCurve,
      // Puntos especiales:
      fantasyPoint: this.punto(this.u_F, this.v_F, rho),  // Núcleo fantasmático
      traumaPoint: this.punto(this.u_T, this.v_T, rho),    // Marca del trauma
      voicePoint: [0, 0, 0] as [number, number, number],    // La voz (origen)
    };
  }

  /**
   * Genera las curvas en el estilo del motor original (get_curves)
   * 
   * METAPSICOLOGÍA: Estas curvas oscilan alrededor de v = π (la voz)
   * pero sin tocarla. Representan la dinámica pulsional original.
   * 
   * @param points - Número de puntos por curva (default: 240)
   * @returns Objeto con las curvas S, I, Pulsión, Σ
   */
  public getMotorCurves(points: number = 240) {
    const uVals: number[] = [];
    for (let i = 0; i <= points; i++) {
      uVals.push((i / points) * 2 * Math.PI);
    }

    // Fases y parámetros
    const phi_I = this.v_I % (2 * Math.PI);
    const phi_S = this.v_S % (2 * Math.PI);
    const phi_Sigma = this.v_Sigma % (2 * Math.PI);
    const R = this.R;        // Radio de revolución
    const rt = this.r;       // Radio del tubo
    const s = this.pulsion_attachment_strength;  // Fuerza de apego de la pulsión

    const sCurve: [number, number, number][] = [];
    const iCurve: [number, number, number][] = [];
    const pCurve: [number, number, number][] = [];
    const sigmaCurve: [number, number, number][] = [];

    for (const u of uVals) {
      // Curva I (Imagen del cuerpo)
      // Oscila alrededor de v = π con amplitud 0.48 y armónico 2
      const v_I = Math.PI + 0.48 * Math.sin(u + phi_I) + 0.12 * Math.cos(2 * u);
      const r_I = R + rt * Math.cos(v_I);
      iCurve.push([r_I * Math.cos(u), r_I * Math.sin(u), rt * Math.sin(v_I)]);

      // Curva de Pulsión
      // Más compleja: oscila con frecuencia f=6 y modulación por s (fuerza de apego)
      const f = 6;  // Frecuencia alta para la pulsión
      const v_P = v_I + 0.14 * Math.sin(f * u) * s;
      const r_P = R + rt * Math.cos(v_P) + 0.08 * Math.cos(f * u) * rt * s;
      const z_P = rt * Math.sin(v_P) + 0.06 * Math.sin(f * u) * rt;
      pCurve.push([r_P * Math.cos(u), r_P * Math.sin(u), z_P]);

      // Curva S (Significante)
      // Oscila con coseno y corrección de segundo armónico
      const v_S = Math.PI + 0.48 * Math.cos(u + phi_S) - 0.16 * Math.sin(2 * u);
      const r_S = R + rt * Math.cos(v_S);
      sCurve.push([r_S * Math.cos(u), r_S * Math.sin(u), rt * Math.sin(v_S)]);

      // Curva Σ (Síntoma)
      // Oscila con doble frecuencia (2u) y fase phi_Sigma
      const v_Sg = Math.PI + 0.58 * Math.sin(2 * u + phi_Sigma);
      const r_Sg = R + rt * Math.cos(v_Sg);
      sigmaCurve.push([r_Sg * Math.cos(u), r_Sg * Math.sin(u), rt * Math.sin(v_Sg)]);
    }

    return { S: sCurve, I: iCurve, Pulsion: pCurve, Sigma: sigmaCurve };
  }
}

// =============================================================================
// SECCIÓN 9: DINÁMICA DE CRISIS CLÍNICAS Y SIMULACIÓN TEMPORAL DE RECONFIGURACIÓN
// =============================================================================

export interface ClinicalCrisisPhase {
  t: number; // Porcentaje de la línea de tiempo (0 a 100)
  title: string;
  subtitle: string;
  description: string;
  metapsychologicalNote: string;
  sclData: SCL90RData;
  rOverR: number;
  deformationFactor: number;
  colorMode: "neutral" | "angustia" | "estres";
  isPeak?: boolean;
  isReconfiguration?: boolean;
}

export interface ClinicalCrisisScenario {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  theoreticalDifferential: string;
  phases: ClinicalCrisisPhase[];
}

/**
 * Escenario 1: Explosión de Psicoticismo y Reconfiguración Sinthomática
 * 
 * Efracción fuera de baremo de PSIC (y acoplados PAR, HOS, IGS),
 * shock de deformación geométrica en la superficie (δ → 0.78),
 * y posterior reconfiguración en nuevo equilibrio compensado (r/R → 0.945, δ → 0.32).
 */
export const SCENARIO_PSICOSIS_RECONFIGURACION: ClinicalCrisisScenario = {
  id: "psicosis-reconfiguracion",
  title: "Explosión de Psicoticismo & Reconfiguración Sinthomática",
  badge: "Efracción y Reanudamiento",
  shortDesc:
    "Efracción aguda de Psicoticismo fuera de baremo (PSIC 0.90 → 3.85) con arrastre de Paranoia y Hostilidad, shock de ondulación de la superficie y posterior reconfiguración hacia un nuevo equilibrio topológico.",
  theoreticalDifferential:
    "A diferencia del nudo borromeo clásico de Lacan (donde 3 aros sueltos precisan del 4° nudo del sinthome ante la forclusión de P₀), en la tesis de Lic. Carlos Vonsik la angustia es una métrica continua de distancia toroidal al punto de anclaje del fantasma ($◇a) y la marca del trauma. Durante la efracción psicótica, la perturbación geométrica extrema distorsiona el manifold y altera r/R, tras lo cual el sinthome reconfigura la superficie en un nuevo equilibrio compensado.",
  phases: [
    {
      t: 0,
      title: "Línea de Base Poblacional (Corte T=60)",
      subtitle: "Equilibrio normativo Casullo – Pérez (2008)",
      description:
        "El sujeto opera dentro de los límites del baremo (PSIC=0.90, PAR=1.50, IGS=1.10). El Horn Torus se mantiene en su límite canónico exacto con autotangencia central perfecta (r/R = 1.000).",
      metapsychologicalNote:
        "La cadena significante (S), la imagen corporal (I) y el síntoma (Σ) circulan armónicamente en la cara interna sin invadir la garganta colapsada de la voz.",
      sclData: { ...CASULLO_2008_MASCULINO_ADULTOS_T60 },
      rOverR: 1.0,
      deformationFactor: 0.25,
      colorMode: "neutral",
    },
    {
      t: 25,
      title: "Fase Prodrómica y Tensión Paranoide",
      subtitle: "Ascenso de la hostilidad y desconfianza básica",
      description:
        "Comienza la pérdida de certeza simbólica. El Psicoticismo trepa a 1.85 y arrastra la Ideación Paranoide a 2.45 y la Hostilidad a 1.85. El factor de deformación sube a 0.45.",
      metapsychologicalNote:
        "Se incrementa la rigidez meridiana. La cinta Σ (sinthome) acelera su rotación angular en el meridiano (u_Σ), indicando que el compromiso sintomático comienza a sobrecalentarse.",
      sclData: {
        ...CASULLO_2008_MASCULINO_ADULTOS_T60,
        Psicoticismo: 1.85,
        "Ideacion Paranoide": 2.45,
        Hostilidad: 1.85,
        Ansiedad: 1.75,
        GSI: 1.6,
        PST: 64,
        PSDI: 2.5,
      },
      rOverR: 0.992,
      deformationFactor: 0.45,
      colorMode: "estres",
    },
    {
      t: 50,
      title: "💥 PICO DE EXPLOSIÓN PSICÓTICA (Fuera de Baremo)",
      subtitle: "Efracción del registro de la realidad e invasión de goce",
      description:
        "El Psicoticismo se dispara catastróficamente a 3.85 (muy por encima de cualquier baremo). La Paranoia alcanza 3.65, la Hostilidad 3.10 y el IGS sube a 2.85 con 84 síntomas positivos. El factor de deformación visual alcanza su pico de shock en δ = 0.78.",
      metapsychologicalNote:
        "La superficie del Horn Torus experimenta abombamientos y estrangulamientos cuádruples severos; se rompe la simetría axial. La trayectoria bordea peligrosamente la zona de angustia crítica (A ≤ π/4) próxima a la punción del fantasma.",
      sclData: {
        Somatizacion: 1.95,
        "Obsesion-Compulsion": 2.4,
        "Sensibilidad Interpersonal": 2.5,
        Depresion: 2.3,
        Ansiedad: 2.8,
        Hostilidad: 3.1,
        "Ansiedad Fobica": 1.6,
        "Ideacion Paranoide": 3.65,
        Psicoticismo: 3.85,
        GSI: 2.85,
        PST: 84,
        PSDI: 3.5,
      },
      rOverR: 0.978,
      deformationFactor: 0.78,
      colorMode: "estres",
      isPeak: true,
    },
    {
      t: 75,
      title: "Labor de Anudamiento Sinthomático",
      subtitle: "Intervención estabilizadora de la cinta Σ",
      description:
        "Frente a la efracción, se activa el trabajo ortopédico del sinthome. Los síntomas agudos descienden (PSIC 2.30, PAR 2.40). El factor de deformación decae a 0.48 y el cociente r/R se reajusta a 0.955, abriendo el cuello central para desasfixiar la garganta.",
      metapsychologicalNote:
        "El sinthome remacha los bordes del agujero. La relajación geométrica (r/R < 1) sustituye la singularidad infinita por un canal transitable, evitando la autodisolución catatónica del sujeto.",
      sclData: {
        Somatizacion: 1.5,
        "Obsesion-Compulsion": 2.05,
        "Sensibilidad Interpersonal": 1.85,
        Depresion: 1.9,
        Ansiedad: 1.65,
        Hostilidad: 1.95,
        "Ansiedad Fobica": 1.05,
        "Ideacion Paranoide": 2.4,
        Psicoticismo: 2.3,
        GSI: 1.75,
        PST: 66,
        PSDI: 2.65,
      },
      rOverR: 0.955,
      deformationFactor: 0.48,
      colorMode: "estres",
      isReconfiguration: true,
    },
    {
      t: 100,
      title: "✨ Nuevo Equilibrio Reconfigurado (Estabilización Post-Crisis)",
      subtitle: "Topología post-efracción estabilizada",
      description:
        "El manifold ha alcanzado su nuevo estado estacionario. El cociente r/R se asienta en 0.945 (toroide de cuello abierto compensado). La deformación se estabiliza en una cicatriz armónica moderada (δ = 0.32), integrando la experiencia del brote.",
      metapsychologicalNote:
        "La superficie ha mutado: el sujeto no regresa a la inocencia previa, sino que sostiene una nueva consistencia subjetiva mediada por la prótesis sinthomática.",
      sclData: {
        Somatizacion: 1.25,
        "Obsesion-Compulsion": 1.8,
        "Sensibilidad Interpersonal": 1.5,
        Depresion: 1.55,
        Ansiedad: 1.35,
        Hostilidad: 1.5,
        "Ansiedad Fobica": 0.75,
        "Ideacion Paranoide": 2.05,
        Psicoticismo: 1.65,
        GSI: 1.45,
        PST: 58,
        PSDI: 2.38,
      },
      rOverR: 0.945,
      deformationFactor: 0.32,
      colorMode: "neutral",
      isReconfiguration: true,
    },
  ],
};

/**
 * Escenario 2: Crisis de Angustia y Efracción Traumática (Proximidad al Fantasma)
 */
export const SCENARIO_CRISIS_ANGUSTIA_FANTASMA: ClinicalCrisisScenario = {
  id: "crisis-angustia",
  title: "Crisis de Angustia & Proximidad al Fantasma",
  badge: "Métrica A ≤ π/4",
  shortDesc:
    "Aproximación métrica vertiginosa a la punción del fantasma ($◇a en u_F=π, v_F=π/2) y marca del trauma, activando el campo crítico A(u,v) ≤ π/4 con intensa somatización.",
  theoreticalDifferential:
    "La angustia no es un afecto flotante ni una rotura de aros borromeos, sino la señal métrica pura de proximidad al núcleo fantasmático indestructible (punto quitado de la superficie) y a la marca del trauma.",
  phases: [
    {
      t: 0,
      title: "Línea de Base Basal",
      subtitle: "Corte Casullo T=60",
      description: "Nivel de ansiedad controlado (ANS=1.30, SOM=1.08). Las trayectorias se mantienen lejos del radio crítico de ruptura.",
      metapsychologicalNote: "A(u,v) > π/4 en la totalidad de la órbita de vigilia.",
      sclData: { ...CASULLO_2008_MASCULINO_ADULTOS_T60 },
      rOverR: 1.0,
      deformationFactor: 0.25,
      colorMode: "neutral",
    },
    {
      t: 35,
      title: "Inquietud y Desasosiego Somático",
      subtitle: "Activación del registro somatofóbico",
      description: "La Ansiedad escala a 2.40 y la Somatización a 2.20. Empieza a manifestarse taquicardia, opresión torácica y temblores.",
      metapsychologicalNote: "La órbita significante se aproxima a la latitud del fantasma (v_F = π/2).",
      sclData: {
        ...CASULLO_2008_MASCULINO_ADULTOS_T60,
        Ansiedad: 2.4,
        Somatizacion: 2.2,
        "Ansiedad Fobica": 1.45,
        GSI: 1.65,
        PST: 65,
        PSDI: 2.55,
      },
      rOverR: 1.0,
      deformationFactor: 0.45,
      colorMode: "angustia",
    },
    {
      t: 60,
      title: "⚡ PICO DE ANGUSTIA Y ZONA DE RUPTURA CRÍTICA",
      subtitle: "Aproximación paroxística al núcleo del trauma",
      description:
        "Ataque de pánico agudo. Ansiedad a 3.90, Somatización a 3.40 y Ansiedad Fóbica a 2.90. La superficie entra en alerta máxima con coloración carmesí en el radio A ≤ π/4.",
      metapsychologicalNote:
        "La distancia toroidal A(u,v) desciende por debajo de A_cr = π/4: inminencia de despersonalización y desgarro subjetivo ante la punción fantasmática.",
      sclData: {
        Somatizacion: 3.4,
        "Obsesion-Compulsion": 2.1,
        "Sensibilidad Interpersonal": 2.0,
        Depresion: 2.2,
        Ansiedad: 3.9,
        Hostilidad: 1.8,
        "Ansiedad Fobica": 2.9,
        "Ideacion Paranoide": 1.9,
        Psicoticismo: 1.3,
        GSI: 2.65,
        PST: 82,
        PSDI: 3.4,
      },
      rOverR: 0.985,
      deformationFactor: 0.68,
      colorMode: "angustia",
      isPeak: true,
    },
    {
      t: 100,
      title: "Restitución del Amurallamiento Defensivo",
      subtitle: "Retorno a la defensa fóbico-obsesiva",
      description:
        "Se restablece la barrera de protección frente a los estímulos. La ansiedad remite a 1.40 y la somatización desciende a 1.25, alejando la trayectoria de la zona crítica.",
      metapsychologicalNote:
        "El sujeto reconstituye el velo fantasmático defensivo, restaurando la distancia de seguridad con el trauma.",
      sclData: {
        ...CASULLO_2008_MASCULINO_ADULTOS_T60,
        Ansiedad: 1.4,
        Somatizacion: 1.25,
        "Ansiedad Fobica": 0.85,
        GSI: 1.2,
      },
      rOverR: 1.0,
      deformationFactor: 0.28,
      colorMode: "neutral",
    },
  ],
};

/**
 * Escenario 3: Derrumbe Afectivo y Desinvestidura Melancólica
 */
export const SCENARIO_DERRUMBE_MELANCOLIA: ClinicalCrisisScenario = {
  id: "derrumbe-melancolia",
  title: "Derrumbe Afectivo & Desinvestidura Melancólica",
  badge: "Pulsión s → 0.30",
  shortDesc:
    "Caída de la investidura libidinal: la Depresión extrema (DEP 3.95) colapsa la fuerza de apego pulsional s al piso de 0.30, desligando el Trieb del cuerpo.",
  theoreticalDifferential:
    "La sombra del objeto cae sobre el yo: la pulsión de muerte desliga el hilo libidinal del borde de la imagen corporal (I). El toroide pierde empuje dinámico y cae en atonía.",
  phases: [
    {
      t: 0,
      title: "Línea de Base Basal",
      subtitle: "Apego pulsional conservado",
      description: "Fuerza de apego pulsional s = 0.803. La curva pulsional se mantiene acoplada al borde de la imagen corporal I.",
      metapsychologicalNote: "Circulación fluida de la energía libidinal sobre la superficie.",
      sclData: { ...CASULLO_2008_MASCULINO_ADULTOS_T60 },
      rOverR: 1.0,
      deformationFactor: 0.25,
      colorMode: "neutral",
    },
    {
      t: 50,
      title: "🍂 PICO DE DESINVESTIDURA MELANCÓLICA",
      subtitle: "Atonía pulsional y duelo sin fin",
      description:
        "Depresión escala a 3.95 con inhibición somática masiva (SOM=0.40). La fuerza de apego pulsional colapsa al mínimo (s = 0.300). La deformación se aplana por falta de empuje vital.",
      metapsychologicalNote:
        "El hilo pulsional (Trieb) se desprende del borde de I: el cuerpo queda deshabitado del goce vivificante; el manifold entra en rigidez depresiva.",
      sclData: {
        Somatizacion: 0.4,
        "Obsesion-Compulsion": 1.2,
        "Sensibilidad Interpersonal": 2.2,
        Depresion: 3.95,
        Ansiedad: 0.8,
        Hostilidad: 0.6,
        "Ansiedad Fobica": 0.4,
        "Ideacion Paranoide": 1.1,
        Psicoticismo: 0.9,
        GSI: 1.95,
        PST: 48,
        PSDI: 2.1,
      },
      rOverR: 0.995,
      deformationFactor: 0.12,
      colorMode: "neutral",
      isPeak: true,
    },
    {
      t: 100,
      title: "Reinversión Objetal Progresiva",
      subtitle: "Reanudación del lazo pulsional",
      description: "Recuperación paulatina de la vitalidad. s asciende nuevamente a 0.72.",
      metapsychologicalNote: "La pulsión vuelve a rodear y vivificar la imagen del cuerpo.",
      sclData: {
        ...CASULLO_2008_MASCULINO_ADULTOS_T60,
        Depresion: 1.5,
        Somatizacion: 0.95,
        GSI: 1.15,
      },
      rOverR: 1.0,
      deformationFactor: 0.25,
      colorMode: "neutral",
    },
  ],
};

/**
 * Escenario 4: Rigidificación Paranoide y Asedio del Otro
 */
export const SCENARIO_RIGIDEZ_PARANOIDE: ClinicalCrisisScenario = {
  id: "rigidez-paranoide",
  title: "Rigidificación Paranoide & Asedio del Objeto",
  badge: "Torsión PAR + HOS",
  shortDesc:
    "Hiper-significación persecutoria: elevación masiva de PAR (3.85) y HOS (3.45) con endurecimiento de la simetría y tensión meridiana extrema sin reconfiguración plástica.",
  theoreticalDifferential:
    "En la paranoia, el significante no se desata libremente sino que se coagula en certeza persecutoria inquebrantable; la superficie del toro sufre tensión tangencial elevada sin permitir la relajación plástica del cuello.",
  phases: [
    {
      t: 0,
      title: "Línea de Base Basal",
      subtitle: "Vigilancia latente",
      description: "Ideación paranoide en 1.50 y Hostilidad en 1.33.",
      metapsychologicalNote: "Tensión normal entre el sujeto y el campo del Otro.",
      sclData: { ...CASULLO_2008_MASCULINO_ADULTOS_T60 },
      rOverR: 1.0,
      deformationFactor: 0.25,
      colorMode: "neutral",
    },
    {
      t: 50,
      title: "🛡️ PICO DE DELIRIO PERSECUTORIO",
      subtitle: "Asedio del Otro e hiper-interpretación",
      description:
        "Ideación Paranoide trepa a 3.85 y Hostilidad a 3.45. La torsión angular meridiana genera pliegues de alta rigidez en la superficie.",
      metapsychologicalNote:
        "El sujeto atribuye intencionalidad malévola absoluta al Otro. La cinta S se tensa y polariza el espacio sin dejar lugar al equívoco.",
      sclData: {
        Somatizacion: 1.4,
        "Obsesion-Compulsion": 2.2,
        "Sensibilidad Interpersonal": 2.7,
        Depresion: 1.7,
        Ansiedad: 2.1,
        Hostilidad: 3.45,
        "Ansiedad Fobica": 1.2,
        "Ideacion Paranoide": 3.85,
        Psicoticismo: 2.1,
        GSI: 2.35,
        PST: 72,
        PSDI: 3.1,
      },
      rOverR: 0.985,
      deformationFactor: 0.62,
      colorMode: "estres",
      isPeak: true,
    },
    {
      t: 100,
      title: "Compensación Encapsulada",
      subtitle: "Delirio estabilizado en sistema cerrado",
      description: "El sistema paranoide se encapsula sin colapsar el aparato, reduciendo la hostilidad activa.",
      metapsychologicalNote: "La certeza delirante funciona como muro protector estable frente al vacío de la castración.",
      sclData: {
        ...CASULLO_2008_MASCULINO_ADULTOS_T60,
        "Ideacion Paranoide": 2.3,
        Hostilidad: 1.8,
        GSI: 1.4,
      },
      rOverR: 0.975,
      deformationFactor: 0.35,
      colorMode: "neutral",
    },
  ],
};

export const CLINICAL_CRISIS_SCENARIOS: ClinicalCrisisScenario[] = [
  SCENARIO_PSICOSIS_RECONFIGURACION,
  SCENARIO_CRISIS_ANGUSTIA_FANTASMA,
  SCENARIO_DERRUMBE_MELANCOLIA,
  SCENARIO_RIGIDEZ_PARANOIDE,
];

/**
 * Función de interpolación lineal suave entre dos perfiles SCL-90-R
 */
export function interpolateSclData(
  a: SCL90RData,
  b: SCL90RData,
  alpha: number
): SCL90RData {
  const t = Math.max(0, Math.min(1, alpha));
  const lerp = (v1: number = 0, v2: number = 0) => v1 + (v2 - v1) * t;

  return {
    Somatizacion: lerp(a.Somatizacion, b.Somatizacion),
    "Obsesion-Compulsion": lerp(a["Obsesion-Compulsion"], b["Obsesion-Compulsion"]),
    "Sensibilidad Interpersonal": lerp(a["Sensibilidad Interpersonal"], b["Sensibilidad Interpersonal"]),
    Depresion: lerp(a.Depresion, b.Depresion),
    Ansiedad: lerp(a.Ansiedad, b.Ansiedad),
    Hostilidad: lerp(a.Hostilidad, b.Hostilidad),
    "Ansiedad Fobica": lerp(a["Ansiedad Fobica"], b["Ansiedad Fobica"]),
    "Ideacion Paranoide": lerp(a["Ideacion Paranoide"], b["Ideacion Paranoide"]),
    Psicoticismo: lerp(a.Psicoticismo, b.Psicoticismo),
    GSI: lerp(a.GSI, b.GSI),
    PST: Math.round(lerp(a.PST, b.PST)),
    PSDI: lerp(a.PSDI, b.PSDI),
  };
}

/**
 * Muestrea un escenario clínico en cualquier punto temporal de la evolución [0, 100]%
 */
export function sampleScenarioAt(
  scenario: ClinicalCrisisScenario,
  progressPercent: number
): {
  sclData: SCL90RData;
  rOverR: number;
  deformationFactor: number;
  colorMode: "neutral" | "angustia" | "estres";
  activePhase: ClinicalCrisisPhase;
  currentPhaseIndex: number;
} {
  const p = Math.max(0, Math.min(100, progressPercent));
  const phases = scenario.phases;

  if (p <= phases[0].t) {
    return {
      sclData: { ...phases[0].sclData },
      rOverR: phases[0].rOverR,
      deformationFactor: phases[0].deformationFactor,
      colorMode: phases[0].colorMode,
      activePhase: phases[0],
      currentPhaseIndex: 0,
    };
  }

  const lastIdx = phases.length - 1;
  if (p >= phases[lastIdx].t) {
    return {
      sclData: { ...phases[lastIdx].sclData },
      rOverR: phases[lastIdx].rOverR,
      deformationFactor: phases[lastIdx].deformationFactor,
      colorMode: phases[lastIdx].colorMode,
      activePhase: phases[lastIdx],
      currentPhaseIndex: lastIdx,
    };
  }

  // Encontrar el segmento [idx, idx + 1]
  let idx = 0;
  for (let i = 0; i < phases.length - 1; i++) {
    if (p >= phases[i].t && p <= phases[i + 1].t) {
      idx = i;
      break;
    }
  }

  const pA = phases[idx];
  const pB = phases[idx + 1];
  const segmentRange = Math.max(0.001, pB.t - pA.t);
  const alpha = (p - pA.t) / segmentRange;

  // Interpolación suave cúbica (smoothstep)
  const smoothAlpha = alpha * alpha * (3 - 2 * alpha);

  const lerpNum = (v1: number, v2: number) => v1 + (v2 - v1) * smoothAlpha;

  return {
    sclData: interpolateSclData(pA.sclData, pB.sclData, smoothAlpha),
    rOverR: lerpNum(pA.rOverR, pB.rOverR),
    deformationFactor: lerpNum(pA.deformationFactor, pB.deformationFactor),
    colorMode: smoothAlpha > 0.5 ? pB.colorMode : pA.colorMode,
    activePhase: smoothAlpha > 0.5 ? pB : pA,
    currentPhaseIndex: smoothAlpha > 0.5 ? idx + 1 : idx,
  };
}
