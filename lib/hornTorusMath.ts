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
 * 
 * 2. EL FANTASMA (u_F, v_F): Núcleo fantasmático, nunca visitado pero rodeado
 *    - Correspondencia con "Ein Kind wird geschlagen" (Freud GW XII)
 *    - Defecto topológico en la superficie de inscripción
 *    - Aquí el significante NO puede simbolizar: surge la angustia (LO REAL)
 * 
 * 3. EL TRAUMA (u_T, v_T): Marca alcanzable por Nachträglichkeit
 *    - Caso Emma y el trauma de Kleider (Freud GW II/III, Entwurf)
 *    - Marca en la superficie alcanzable por caminos en épocas posteriores
 * 
 * 4. LAS CINTAS (S, I, Σ, Pulsión): Trenza conforme al §4
 *    - S: Significante (cadena significante)
 *    - I: Imagen del cuerpo (Imago)
 *    - Σ: Síntoma (formación del inconsciente)
 *    - Pulsión: Hilo pulsional (Trieb) pegado al borde de I
 * 
 * 5. MECANISMOS DE LA ANGUSTIA (LO REAL):
 *    - La angustia NO es un orden, es el EFECTO de lo real
 *    - Métrico: Cerca del fantasma (u_F, v_F), A(u,v) → 0, angustia emerge
 *    - Zona de Ruptura: A ≤ π/4 donde el significante no puede simbolizar
 *    - "La angustia es lo que no engaña" (Lacan, Sem. X)
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
  GSI: number;
  PST: number;
  PSDI: number;
}

export const DEFAULT_SCL90R_DATA: SCL90RData = {
  Somatizacion: 0.8,
  "Obsesion-Compulsion": 0.9,
  "Sensibilidad Interpersonal": 0.7,
  Depresion: 0.85,
  Ansiedad: 0.95,
  Hostilidad: 0.6,
  "Ansiedad Fobica": 0.75,
  "Ideacion Paranoide": 0.8,
  Psicoticismo: 0.9,
  GSI: 0.85,
  PST: 0.7,
  PSDI: 0.9,
};

export const COLOR_PALETTE = {
  S: "#d81b3c", // crimson — S (Significante)
  I: "#2e8b57", // seagreen — I (Imagen del cuerpo)
  Pulsion: "#daa520", // goldenrod — Hilo pulsional (Trieb)
  Sigma: "#3f51b5", // royalblue — Σ (Síntoma)
  voz: "#111111", // punto de autotangencia / la voz
  trauma: "#ef6c00", // núcleo del trauma
  fant: "#d81b8c", // núcleo fantasmático
  ding: "#37474f", // superficie de Ding
  pared: "#c9d6de", // espesor Pcs
  clifford: "#8b5cf6",
};

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
    // a = a_scale * GSI, where GSI ∈ [0, 1]
    const gsi = this.scl90r.GSI ?? 0.85;
    this.a = this.a_scale * gsi;
    
    // effective_a is the actual radius used in calculations
    // This represents the scale of the torus in 3D space
    this.effective_a = this.a * this.visual_scale;

    // Calculate Lacanian parameters (u_S, v_S, u_I, v_I, etc.) from SCL-90-R data
    this.calculateLacanianParameters();
  }

  /**
   * Calcula parámetros lacanianos a partir de datos SCL-90-R
   * 
   * METAPSICOLOGÍA: Cada escala SCL-90-R se mapea a coordenadas (u, v) en el toro:
   * - u: Coordenada angular (meridiano) → Relacionado con lo simbólico
   * - v: Coordenada de latitud (tubo) → Relacionado con lo imaginario
   * 
   * Las fases (u_S, v_S, u_I, v_I, u_Sigma, v_Sigma) determinan la posición
   * de las cintas S, I, Σ y el hilo pulsional en la superficie.
   * 
   * ADVERTENCIA (Cap. 14.5): Este acoplamiento tiene constantes libres y NO
   * tiene valor diagnóstico. Es solo una parametrización ilustrativa.
   */
  private calculateLacanianParameters(): void {
    const n = 9;  // Normalization factor for u coordinates
    const u_scale = 2 * Math.PI;  // Full circle for u
    const v_scale = Math.PI;       // Half circle for v

    // S (Significante) - Chain of signifiers
    // u_S: Position based on Anxiety + Obsession-Compulsion
    // High anxiety/obsession → more "symbolic" displacement
    const anxiety = this.scl90r.Ansiedad ?? 0.95;
    const obsession = this.scl90r["Obsesion-Compulsion"] ?? 0.9;
    this.u_S = (u_scale * (anxiety + obsession)) / n;

    // v_S: Vertical position based on PSDI (Positive Symptom Distress Index)
    const psdi = this.scl90r.PSDI ?? 0.9;
    this.v_S = v_scale * (1 + psdi);

    // I (Imagen del cuerpo / Imago)
    // u_I: Based on Somatization + Interpersonal Sensitivity
    const somatization = this.scl90r.Somatizacion ?? 0.8;
    const interpersonal = this.scl90r["Sensibilidad Interpersonal"] ?? 0.7;
    this.u_I = (u_scale * (somatization + interpersonal)) / n;

    // v_I: Based on PST (Positive Symptom Total)
    const pst = this.scl90r.PST ?? 0.7;
    this.v_I = v_scale * (1 + pst);

    // Pulsión (Drive / Trieb)
    // Attachment strength based on Somatization and Depression
    // More somatization → stronger drive attachment
    // More depression → weaker drive attachment
    const depression = this.scl90r.Depresion ?? 0.8;
    this.pulsion_attachment_strength = Math.min(
      1.0,
      Math.max(0.3, 0.88 + somatization * 0.12 - depression * 0.15)
    );

    // Σ (Síntoma / Symptom)
    // u_Sigma: Based on Psychoticism + Hostility
    const psychoticism = this.scl90r.Psicoticismo ?? 0.9;
    const hostility = this.scl90r.Hostilidad ?? 0.6;
    this.u_Sigma = (u_scale * (psychoticism + hostility)) / n;
    
    // v_Sigma: Based on Psychoticism
    this.v_Sigma = v_scale * (1 + psychoticism);
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
   * La deformación se calcula como una combinación lineal de armónicos esféricos:
   *   perturbation = w₁·sin(u)·cos(v) + w₂·cos(2u)·sin(v) + w₃·sin(3u)·cos(2v)
   * 
   * Donde los pesos wᵢ dependen de las escalas SCL-90-R:
   *   w₁ = 0.45 · GSI       (Índice de Severidad Global)
   *   w₂ = 0.35 · PST       (Total de Síntomas Positivos)
   *   w₃ = 0.20 · (PSDI/2)   (Índice de Distrés de Síntomas Positivos / 2)
   * 
   * El factor de deformación final es:
   *   factor = 1 + δ · perturbation
   * 
   * Donde δ es el deformation_factor (0-1) que controla la intensidad.
   * 
   * ADVERTENCIA: Como se indica en el Cap. 14.5 de la tesis,
   * este acoplamiento NO tiene valor diagnóstico. Es una parametrización
   * ilustrativa con constantes libres.
   * 
   * @param u - Coordenada angular
   * @param v - Coordenada de latitud
   * @returns Objeto con factor de deformación y nivel de stress
   */
  public computeSclDeformation(u: number, v: number): { factor: number; stress: number } {
    const delta = this.deformation_factor;
    const gsi = this.scl90r.GSI ?? 0.85;
    const pst = this.scl90r.PST ?? 0.7;
    const psdi = this.scl90r.PSDI ?? 0.9;

    // Armónicos esféricos para la deformación
    const harmonic1 = Math.sin(u) * Math.cos(v);
    const harmonic2 = Math.cos(2 * u) * Math.sin(v);
    const harmonic3 = Math.sin(3 * u) * Math.cos(2 * v);

    // Pesos basados en escalas SCL-90-R
    const weight1 = 0.45 * gsi;
    const weight2 = 0.35 * pst;
    const weight3 = 0.20 * (psdi / 2.0);

    // Combinación lineal de armónicos
    const perturbation = weight1 * harmonic1 + weight2 * harmonic2 + weight3 * harmonic3;
    
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

    // Banda de inscripción en la cara interna del toro
    // [0.45, 2.70] rad = [25.8°, 154.7°] en coordenadas de latitud
    // Esta banda evita la línea v = π (180°) donde está la voz
    const bandaMin = 0.45;
    const bandaMax = 2.70;
    const v0 = 0.5 * (bandaMin + bandaMax);  // Centro de la banda
    const ampl = 0.5 * (bandaMax - bandaMin);   // Amplitud de oscilación

    // Fases de las curvas (desplazamientos en u)
    // Estas fases determinan la posición relativa de las cintas
    const phi_S = this.v_S % (2 * Math.PI);
    const phi_I = this.v_I % (2 * Math.PI);
    const phi_Sigma = this.v_Sigma % (2 * Math.PI);

    // Radio reducido para las curvas (93% del radio del tubo)
    // Esto hace que las curvas estén ligeramente por dentro de la superficie
    const rho = 0.93 * this.r;

    const sCurve: [number, number, number][] = [];
    const iCurve: [number, number, number][] = [];
    const pCurve: [number, number, number][] = [];
    const sigmaCurve: [number, number, number][] = [];
    const lambdaIntCurve: [number, number, number][] = [];

    for (const u of uVals) {
      // Curvas oscilando en la banda [0.45, 2.70] con frecuencia 3
      // Las fases están desfasadas por 2π/3 para crear la trenza
      const v_s = v0 + ampl * Math.sin(3.0 * u + phi_S);
      const v_i = v0 + ampl * Math.sin(3.0 * u + phi_I + (2 * Math.PI) / 3);
      const v_sg = v0 + ampl * Math.sin(3.0 * u + phi_Sigma + (4 * Math.PI) / 3);
      
      // Curva de pulsión: ligeramente desplazada de la curva I
      // El desplazamiento depende de la fuerza de apego de la pulsión
      const v_p = v_i + 0.075 + 0.055 * this.pulsion_attachment_strength;

      // Generar puntos en las curvas con radio reducido rho
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
