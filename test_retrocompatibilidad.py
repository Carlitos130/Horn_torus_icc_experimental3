#!/usr/bin/env python3
"""
Test de Retrocompatibilidad entre HornTorusICC (modelo original r=R=a)
y HornTorusFamilia (familia continua r -> R).
Tesis RSI - Poincaré (Lic. Carlos Vonsik, MN 85130).
"""

import math
import unittest

# ==============================================================================
# 1. Definición del modelo original HornTorusICC (r = R = a = 10.0)
# ==============================================================================

class HornTorusICC:
    def __init__(self, a=10.0):
        self.a = float(a)
        self.R = float(a)
        self.r = float(a)
        self.u_F = math.pi
        self.v_F = math.pi / 2.0
        self.A_cr = math.pi / 4.0

    def punto(self, u, v):
        x = (self.R + self.r * math.cos(v)) * math.cos(u)
        y = (self.R + self.r * math.cos(v)) * math.sin(u)
        z = self.r * math.sin(v)
        return (x, y, z)

    def calculate_angustia(self, u, v):
        du = (u - self.u_F + math.pi) % (2.0 * math.pi) - math.pi
        dv = (v - self.v_F + math.pi) % (2.0 * math.pi) - math.pi
        return math.sqrt(du * du + dv * dv)

    def check_rupture(self, u, v):
        return self.calculate_angustia(u, v) <= self.A_cr

    def get_curves(self, num_points=100):
        pts_S = []
        pts_I = []
        pts_Pulsion = []
        pts_Sigma = []
        for i in range(num_points):
            t = (i / (num_points - 1)) * 2.0 * math.pi
            # Curvas conforme al modelo motor
            v_S = math.pi / 2.0 + 0.3 * math.sin(2.0 * t)
            v_I = math.pi / 2.0 + 0.3 * math.sin(2.0 * t + 2.0 * math.pi / 3.0)
            v_P = v_I + 0.1
            v_Sigma = math.pi / 2.0 + 0.3 * math.sin(2.0 * t + 4.0 * math.pi / 3.0)

            pts_S.append(self.punto(t, v_S))
            pts_I.append(self.punto(t, v_I))
            pts_Pulsion.append(self.punto(t, v_P))
            pts_Sigma.append(self.punto(t, v_Sigma))
        return {
            "S": pts_S,
            "I": pts_I,
            "Pulsion": pts_Pulsion,
            "Sigma": pts_Sigma,
        }

# ==============================================================================
# 2. Definición de la familia continua HornTorusFamilia(r_over_R)
# ==============================================================================

class HornTorusFamilia:
    def __init__(self, r_over_R=1.0, R=10.0):
        if not (0.0 < r_over_R <= 1.0):
            raise ValueError("r_over_R debe estar en el intervalo (0, 1].")
        self.r_over_R = float(r_over_R)
        self.R = float(R)
        self.r = self.r_over_R * self.R
        self.radio_agujero = self.R - self.r
        self.es_limite = abs(self.r_over_R - 1.0) < 1e-9

        self.u_F = math.pi
        self.v_F = math.pi / 2.0
        self.A_cr = math.pi / 4.0

    def punto(self, u, v):
        x = (self.R + self.r * math.cos(v)) * math.cos(u)
        y = (self.R + self.r * math.cos(v)) * math.sin(u)
        z = self.r * math.sin(v)
        return (x, y, z)

    def calculate_angustia(self, u, v):
        du = (u - self.u_F + math.pi) % (2.0 * math.pi) - math.pi
        dv = (v - self.v_F + math.pi) % (2.0 * math.pi) - math.pi
        return math.sqrt(du * du + dv * dv)

    def check_rupture(self, u, v):
        return self.calculate_angustia(u, v) <= self.A_cr

    def get_curves(self, num_points=100):
        pts_S = []
        pts_I = []
        pts_Pulsion = []
        pts_Sigma = []
        for i in range(num_points):
            t = (i / (num_points - 1)) * 2.0 * math.pi
            v_S = math.pi / 2.0 + 0.3 * math.sin(2.0 * t)
            v_I = math.pi / 2.0 + 0.3 * math.sin(2.0 * t + 2.0 * math.pi / 3.0)
            v_P = v_I + 0.1
            v_Sigma = math.pi / 2.0 + 0.3 * math.sin(2.0 * t + 4.0 * math.pi / 3.0)

            pts_S.append(self.punto(t, v_S))
            pts_I.append(self.punto(t, v_I))
            pts_Pulsion.append(self.punto(t, v_P))
            pts_Sigma.append(self.punto(t, v_Sigma))
        return {
            "S": pts_S,
            "I": pts_I,
            "Pulsion": pts_Pulsion,
            "Sigma": pts_Sigma,
        }

    def invariantes(self):
        area = 4.0 * (math.pi ** 2) * self.R * self.r
        volumen = 2.0 * (math.pi ** 2) * self.R * (self.r ** 2)
        if self.es_limite:
            willmore = float("inf")
            k_min = float("-inf")
            es_variedad = False
            chi = 1
            rango_h1 = 1
        else:
            denom = self.r_over_R * math.sqrt(1.0 - (self.r_over_R ** 2))
            willmore = (math.pi ** 2) / denom
            k_min = -1.0 / (self.r * (self.R - self.r))
            es_variedad = True
            chi = 0
            rango_h1 = 2

        k_max = 1.0 / (self.r * (self.R + self.r))
        h_prom = 1.0 / (2.0 * self.r)
        return {
            "area": area,
            "volumen": volumen,
            "willmore": willmore,
            "k_min": k_min,
            "k_max": k_max,
            "h_prom": h_prom,
            "es_variedad": es_variedad,
            "chi": chi,
            "rango_h1": rango_h1,
        }

# ==============================================================================
# 3. Test Suite de Retrocompatibilidad
# ==============================================================================

class TestRetrocompatibilidad(unittest.TestCase):
    def setUp(self):
        self.orig = HornTorusICC(a=10.0)
        self.familia_limite = HornTorusFamilia(r_over_R=1.0, R=10.0)

    def test_parametros_fundamentales(self):
        """Verifica que el miembro r_over_R=1.0 tenga radios R=10 y r=10 idénticos al original."""
        self.assertEqual(self.orig.R, self.familia_limite.R)
        self.assertEqual(self.orig.r, self.familia_limite.r)
        self.assertEqual(self.orig.a, self.familia_limite.r)
        self.assertAlmostEqual(self.familia_limite.radio_agujero, 0.0, places=9)
        self.assertTrue(self.familia_limite.es_limite)

    def test_colapso_al_origen_la_voz(self):
        """Verifica que para todo u, v = pi colapsa a (0, 0, 0) en el límite."""
        for u_deg in [0, 30, 45, 90, 120, 180, 270, 315]:
            u = math.radians(u_deg)
            x_orig, y_orig, z_orig = self.orig.punto(u, math.pi)
            x_fam, y_fam, z_fam = self.familia_limite.punto(u, math.pi)

            # Debe ser (0,0,0) en ambos
            self.assertAlmostEqual(x_orig, 0.0, places=9)
            self.assertAlmostEqual(y_orig, 0.0, places=9)
            self.assertAlmostEqual(z_orig, 0.0, places=9)

            self.assertAlmostEqual(x_fam, 0.0, places=9)
            self.assertAlmostEqual(y_fam, 0.0, places=9)
            self.assertAlmostEqual(z_fam, 0.0, places=9)

    def test_coincidencia_grilla_espacial_3d(self):
        """Compara punto(u, v) en una malla regular entre el modelo original y la familia."""
        pasos_u = 24
        pasos_v = 24
        for i in range(pasos_u):
            u = (i / pasos_u) * 2.0 * math.pi
            for j in range(pasos_v):
                v = (j / pasos_v) * 2.0 * math.pi
                p_orig = self.orig.punto(u, v)
                p_fam = self.familia_limite.punto(u, v)
                self.assertAlmostEqual(p_orig[0], p_fam[0], places=10)
                self.assertAlmostEqual(p_orig[1], p_fam[1], places=10)
                self.assertAlmostEqual(p_orig[2], p_fam[2], places=10)

    def test_metrica_angustia_y_ruptura(self):
        """Verifica equivalencia de la métrica de angustia A(u,v) y zona de ruptura A <= pi/4."""
        test_points = [
            (math.pi, math.pi / 2.0),       # Núcleo del fantasma
            (math.pi + 0.2, math.pi / 2.0), # Dentro de zona crítica
            (0.0, 0.0),                     # Ecuator exterior opuesto
            (math.pi, math.pi),             # La voz
        ]
        for u, v in test_points:
            a_orig = self.orig.calculate_angustia(u, v)
            a_fam = self.familia_limite.calculate_angustia(u, v)
            self.assertAlmostEqual(a_orig, a_fam, places=12)

            rup_orig = self.orig.check_rupture(u, v)
            rup_fam = self.familia_limite.check_rupture(u, v)
            self.assertEqual(rup_orig, rup_fam)

    def test_curvas_interiores(self):
        """Verifica que las curvas S, I, Pulsion, Sigma coincidan exactamente punto por punto."""
        curvas_orig = self.orig.get_curves(50)
        curvas_fam = self.familia_limite.get_curves(50)

        for clave in ["S", "I", "Pulsion", "Sigma"]:
            pts_o = curvas_orig[clave]
            pts_f = curvas_fam[clave]
            self.assertEqual(len(pts_o), len(pts_f))
            for p_o, p_f in zip(pts_o, pts_f):
                self.assertAlmostEqual(p_o[0], p_f[0], places=10)
                self.assertAlmostEqual(p_o[1], p_f[1], places=10)
                self.assertAlmostEqual(p_o[2], p_f[2], places=10)

    def test_invariantes_regimenes(self):
        """Verifica los teoremas de la familia continua: Clifford y divergencia en el límite."""
        # 1. Toro de Clifford r/R = 1/sqrt(2)
        clifford = HornTorusFamilia(r_over_R=1.0 / math.sqrt(2.0), R=10.0)
        inv_cliff = clifford.invariantes()
        self.assertAlmostEqual(inv_cliff["willmore"], 2.0 * (math.pi ** 2), places=5)
        self.assertTrue(inv_cliff["es_variedad"])
        self.assertEqual(inv_cliff["chi"], 0)
        self.assertEqual(inv_cliff["rango_h1"], 2)

        # 2. Horn Torus límite r/R = 1.0
        inv_lim = self.familia_limite.invariantes()
        self.assertEqual(inv_lim["willmore"], float("inf"))
        self.assertEqual(inv_lim["k_min"], float("-inf"))
        self.assertFalse(inv_lim["es_variedad"])
        self.assertEqual(inv_lim["chi"], 1)
        self.assertEqual(inv_lim["rango_h1"], 1)

if __name__ == "__main__":
    print("======================================================================")
    print("Ejecutando Test de Retrocompatibilidad (HornTorusICC vs HornTorusFamilia)")
    print("Tesis RSI - Poincaré · Lic. Carlos Vonsik")
    print("======================================================================")
    unittest.main(verbosity=2)
