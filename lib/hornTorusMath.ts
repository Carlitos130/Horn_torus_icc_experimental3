/**
 * Topological & Geometric Model of the Freudian Unconscious
 * The Horn Torus as limit of the family of tori of revolution r -> R.
 * Based on research by Lic. Carlos Vonsik (Tesis RSI - Poincaré).
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

export class HornTorusFamiliaModel {
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

  constructor(
    r_over_R: number = 1.0,
    scl90r: Partial<SCL90RData> = {},
    deformation_factor: number = 0.3
  ) {
    this.r_over_R = Math.max(0.01, Math.min(1.0, r_over_R));
    this.scl90r = { ...DEFAULT_SCL90R_DATA, ...scl90r };
    this.a_scale = 0.1;
    this.visual_scale = 25.0;
    this.deformation_factor = deformation_factor;

    const gsi = this.scl90r.GSI ?? 0.85;
    this.a = this.a_scale * gsi;
    this.effective_a = this.a * this.visual_scale;

    this.calculateLacanianParameters();
  }

  private calculateLacanianParameters(): void {
    const n = 9;
    const u_scale = 2 * Math.PI;
    const v_scale = Math.PI;

    const anxiety = this.scl90r.Ansiedad ?? 0.95;
    const obsession = this.scl90r["Obsesion-Compulsion"] ?? 0.9;
    this.u_S = (u_scale * (anxiety + obsession)) / n;

    const psdi = this.scl90r.PSDI ?? 0.9;
    this.v_S = v_scale * (1 + psdi);

    const somatization = this.scl90r.Somatizacion ?? 0.8;
    const interpersonal = this.scl90r["Sensibilidad Interpersonal"] ?? 0.7;
    this.u_I = (u_scale * (somatization + interpersonal)) / n;

    const pst = this.scl90r.PST ?? 0.7;
    this.v_I = v_scale * (1 + pst);

    const depression = this.scl90r.Depresion ?? 0.8;
    this.pulsion_attachment_strength = Math.min(
      1.0,
      Math.max(0.3, 0.88 + somatization * 0.12 - depression * 0.15)
    );

    const psychoticism = this.scl90r.Psicoticismo ?? 0.9;
    const hostility = this.scl90r.Hostilidad ?? 0.6;
    this.u_Sigma = (u_scale * (psychoticism + hostility)) / n;
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

  public punto(
    u: number,
    v: number,
    rho?: number
  ): [number, number, number] {
    const tubeRadius = rho !== undefined ? rho : this.r;
    const rad = this.R + tubeRadius * Math.cos(v);
    const x = rad * Math.cos(u);
    const y = rad * Math.sin(u);
    const z = tubeRadius * Math.sin(v);
    return [x, y, z];
  }

  public computeSclDeformation(u: number, v: number): { factor: number; stress: number } {
    const delta = this.deformation_factor;
    const gsi = this.scl90r.GSI ?? 0.85;
    const pst = this.scl90r.PST ?? 0.7;
    const psdi = this.scl90r.PSDI ?? 0.9;

    const harmonic1 = Math.sin(u) * Math.cos(v);
    const harmonic2 = Math.cos(2 * u) * Math.sin(v);
    const harmonic3 = Math.sin(3 * u) * Math.cos(2 * v);

    const weight1 = 0.45 * gsi;
    const weight2 = 0.35 * pst;
    const weight3 = 0.20 * (psdi / 2.0);

    const perturbation = weight1 * harmonic1 + weight2 * harmonic2 + weight3 * harmonic3;
    const factor = 1.0 + delta * perturbation;
    const stress = Math.abs(perturbation);

    return { factor, stress };
  }

  public distanciaAngular(u: number, v: number, u0: number, v0: number): number {
    let du = (u - u0) % (2 * Math.PI);
    if (du > Math.PI) du -= 2 * Math.PI;
    if (du < -Math.PI) du += 2 * Math.PI;

    let dv = (v - v0) % (2 * Math.PI);
    if (dv > Math.PI) dv -= 2 * Math.PI;
    if (dv < -Math.PI) dv += 2 * Math.PI;

    return Math.hypot(du, dv);
  }

  public calculateAngustia(u: number, v: number): number {
    return this.distanciaAngular(u, v, this.u_F, this.v_F);
  }

  public checkRupture(u: number, v: number): boolean {
    return this.calculateAngustia(u, v) <= this.A_cr;
  }

  public invariantes(): InvariantSummary {
    const R = this.R;
    const r = this.r;
    const limite = this.es_limite;
    const x = this.r_over_R;
    const rho = R / r;

    const willmore = limite
      ? Infinity
      : (Math.PI * Math.PI) / (x * Math.sqrt(Math.max(1e-10, 1.0 - x * x)));

    const k_min = limite ? -Infinity : -1.0 / (r * (R - r));
    const k_max = 1.0 / (r * (R + r));

    return {
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
  }

  /**
   * Curves conforming to Chapter §4 (braided without touching v = π)
   */
  public getSection4Curves(points: number = 240) {
    const uVals: number[] = [];
    for (let i = 0; i <= points; i++) {
      uVals.push((i / points) * 2 * Math.PI);
    }

    const bandaMin = 0.45;
    const bandaMax = 2.70;
    const v0 = 0.5 * (bandaMin + bandaMax);
    const ampl = 0.5 * (bandaMax - bandaMin);

    const phi_S = this.v_S % (2 * Math.PI);
    const phi_I = this.v_I % (2 * Math.PI);
    const phi_Sigma = this.v_Sigma % (2 * Math.PI);

    const rho = 0.93 * this.r;

    const sCurve: [number, number, number][] = [];
    const iCurve: [number, number, number][] = [];
    const pCurve: [number, number, number][] = [];
    const sigmaCurve: [number, number, number][] = [];
    const lambdaIntCurve: [number, number, number][] = [];

    for (const u of uVals) {
      const v_s = v0 + ampl * Math.sin(3.0 * u + phi_S);
      const v_i = v0 + ampl * Math.sin(3.0 * u + phi_I + (2 * Math.PI) / 3);
      const v_sg = v0 + ampl * Math.sin(3.0 * u + phi_Sigma + (4 * Math.PI) / 3);
      const v_p = v_i + 0.075 + 0.055 * this.pulsion_attachment_strength;

      sCurve.push(this.punto(u, v_s, rho));
      iCurve.push(this.punto(u, v_i, rho));
      pCurve.push(this.punto(u, v_p, rho));
      sigmaCurve.push(this.punto(u, v_sg, rho));
      lambdaIntCurve.push(this.punto(u, Math.PI, this.r));
    }

    return {
      S: sCurve,
      I: iCurve,
      Pulsion: pCurve,
      Sigma: sigmaCurve,
      lambdaInt: lambdaIntCurve,
      fantasyPoint: this.punto(this.u_F, this.v_F, rho),
      traumaPoint: this.punto(this.u_T, this.v_T, rho),
      voicePoint: [0, 0, 0] as [number, number, number],
    };
  }

  /**
   * Curves as originally implemented in get_curves() oscillating around v = π
   */
  public getMotorCurves(points: number = 240) {
    const uVals: number[] = [];
    for (let i = 0; i <= points; i++) {
      uVals.push((i / points) * 2 * Math.PI);
    }

    const phi_I = this.v_I % (2 * Math.PI);
    const phi_S = this.v_S % (2 * Math.PI);
    const phi_Sigma = this.v_Sigma % (2 * Math.PI);
    const R = this.R;
    const rt = this.r;
    const s = this.pulsion_attachment_strength;

    const sCurve: [number, number, number][] = [];
    const iCurve: [number, number, number][] = [];
    const pCurve: [number, number, number][] = [];
    const sigmaCurve: [number, number, number][] = [];

    for (const u of uVals) {
      const v_I = Math.PI + 0.48 * Math.sin(u + phi_I) + 0.12 * Math.cos(2 * u);
      const r_I = R + rt * Math.cos(v_I);
      iCurve.push([r_I * Math.cos(u), r_I * Math.sin(u), rt * Math.sin(v_I)]);

      const f = 6;
      const v_P = v_I + 0.14 * Math.sin(f * u) * s;
      const r_P = R + rt * Math.cos(v_P) + 0.08 * Math.cos(f * u) * rt * s;
      const z_P = rt * Math.sin(v_P) + 0.06 * Math.sin(f * u) * rt;
      pCurve.push([r_P * Math.cos(u), r_P * Math.sin(u), z_P]);

      const v_S = Math.PI + 0.48 * Math.cos(u + phi_S) - 0.16 * Math.sin(2 * u);
      const r_S = R + rt * Math.cos(v_S);
      sCurve.push([r_S * Math.cos(u), r_S * Math.sin(u), rt * Math.sin(v_S)]);

      const v_Sg = Math.PI + 0.58 * Math.sin(2 * u + phi_Sigma);
      const r_Sg = R + rt * Math.cos(v_Sg);
      sigmaCurve.push([r_Sg * Math.cos(u), r_Sg * Math.sin(u), rt * Math.sin(v_Sg)]);
    }

    return { S: sCurve, I: iCurve, Pulsion: pCurve, Sigma: sigmaCurve };
  }
}
