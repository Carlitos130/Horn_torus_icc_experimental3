# Diagramas del horn torus del Icc — leyenda y estatuto

*Material de trabajo para el Cap. 4/5 de `tesis_rsi_poincare.docx`. Sigue la
disciplina del resumen v7: cada elemento dibujado va marcado CITA / LECTURA /
AXIOMA / PENDIENTE. Nada de lo que sigue reemplaza el cotejo contra el alemán o
el francés.*

Generados por [diagramas_icc.py](../diagramas_icc.py),
que importa `HornTorusICC` del repo `horn-torus-icc-experimental`. Los valores
numéricos vienen del vector SCL-90-R por defecto del motor (`GSI = 0.85`, de donde
`a = 0.085` y `effective_a = 2.125`).

---

## Fig. 1 — Corte axial (§4)

![corte axial](../figures/fig1_corte_axial.png)

| Elemento | Estatuto | Apoyo |
|---|---|---|
| Dos circunferencias iguales tangentes en un punto | **hecho matemático** | consecuencia de `R = r = a`; no es licencia del dibujo |
| El punto de autotangencia es la voz / vía del superyó | **CITA + AXIOMA** | Lacan, Sem. XI, leçon 15 (orejas: el único orificio que no puede cerrarse); Freud, GW XV, conf. XXXI (*die Stimme des Gewissens*). Que sea *este* punto del toro es axioma propio |
| La cinta S-I-Σ pegada a la cara interna | **AXIOMA** | §4 |
| El hilo pulsional pegado al borde de I | **AXIOMA** (con CITA de apoyo) | Lacan, Sem. XI, p. 106 (*bord érogène*) funda el trayecto circular alrededor de un borde; que el borde sea el de I es aplicación propia |
| Interior de V vacío | **AXIOMA** | §8, opción (A) |
| Núcleo del trauma / núcleo fantasmático | **AXIOMA** | §17 |
| Pared con espesor Pcs que se anula en la autotangencia | **AXIOMA + PENDIENTE** | §5 le da espesor; §16 dice que el Pcs no ocupa región de V. Ver "decisiones abiertas" |
| Adelgazamientos locales | **AXIOMA** | §5 |
| "afuera: Cc (sin nombrar)" | **PENDIENTE** | §9 lo deja explícitamente sin nombre |

Las marcas aparecen dos veces porque el plano corta **el mismo tubo dos veces**.
La posición angular de las cuatro marcas de la cinta en el corte es arbitraria:
el corte es transversal a `u`, y lo que el modelo fija es el orden relativo
(el hilo pegado al borde de I), no la latitud exacta.

---

## Fig. 2 — La cinta sobre la cara interna (§4), y la carta desplegada

![cinta sobre la cara interna](../figures/fig2_cinta_cara_interna.png)

**(a)** La cara interna vista desde abajo, con la mitad inferior del tubo
removida: es la única forma de ver la cara cóncava donde el §4 pone la cinta.
**(b)** La carta desplegada `(u, v)` de esa misma cara interna.

Lo que la carta hace visible y el 3D no:

- **La recta `v = π` es un solo punto del toro.** En un horn torus el lugar
  geométrico `v = π` no es una circunferencia: colapsa al origen. Es la voz.
  En la carta se dibuja como una recta sólo porque la carta desdobla lo que en
  el toro es un punto.
- **La cinta que calcula hoy `get_curves()`** (líneas punteadas) oscila
  alrededor de `v = π` con amplitud 0.48–0.58, así que **cruza el agujero de la
  voz en cada vuelta** y queda confinada a `r ≤ 0.45` sobre un radio exterior
  `4.25` — entre el 7 % y el 10 % de la extensión radial. Esto es lo que
  explica por qué en `mi_modelo.png` la leyenda anuncia cuatro cintas y no se ve
  ninguna: no están ocultas, están colapsadas en el cuello.
- **La cinta conforme al §4** (líneas plenas) conserva las fases del motor
  (`v_S`, `v_I`, `v_Σ` mod 2π) y les suma el espaciado canónico de una trenza de
  tres hebras, en una banda que excluye `v = π`. Ninguna hebra pasa por la voz.
- **La zona de ruptura** `A ≤ A_cr = π/4` dibujada con distancia **envuelta**
  (ver más abajo).

---

## Fig. 3 — Las cuatro vías de salida (§5) y el tiempo en el cruce (§9)

![vías de salida](../figures/fig3_vias_de_salida.png)

| Vía | Estatuto | Apoyo |
|---|---|---|
| La voz — fija, espesor cero, siempre abierta | **CITA + AXIOMA** | como en Fig. 1 |
| Palabra deformada (Entstellung) | **AXIOMA** con apoyo freudiano | exige marca ligada a una *Wortvorstellung*: la travesía Ub→Vb de la Carta 52 (CITA) |
| Agieren | **CITA** | GW X, «Erinnern, Wiederholen und Durcharbeiten», p. 131 |
| Sublimación | **AXIOMA** | sin cita puntual en el resumen v7 |
| «Cada cruce es un borde de época mínimo: ahí se produce la fecha» | **AXIOMA** (Carlos) | sobre CITA de GW X, p. 286 (*Auch die Zeitbeziehung ist an die Arbeit des Bw-Systems geknüpft*) y de la Carta 52 |

---

## Fig. 4 — El §4.7 cerrado: toro sólido, Heegaard, no-anudamiento

![Heegaard y no-anudamiento](../figures/fig4_heegaard_no_anudamiento.png)

| Paso | Estatuto |
|---|---|
| `V` = toro sólido cerrado por Ding; `M = V ∖ N(S ∪ I ∪ Σ)` | **AXIOMA** (formalización adoptada, §16) |
| `∂M` = Ding con su punto singular ∪ componentes toroidales | consecuencia de la construcción |
| Pegado por la identidad → `S¹ × S²`; pegado de Heegaard de género 1 (m ↦ ℓ) → `S³` | **hecho matemático** (Heegaard 1898; Rolfsen; Hempel) |
| Ding separa `S³` en dos componentes | **hecho matemático** (dualidad de Alexander, *Trans. AMS* 23, 1922) — vale para cualquier género |
| Que **ambos lados sean toros sólidos** exige que Ding esté sin anudar | **hecho matemático** + **AXIOMA**: la implicación es un teorema, la hipótesis es axioma propio |

Nota de dibujo, y no es cosmética: los pasos 3 y 4 dibujan **toros de
revolución no degenerados**, no el horn torus. El pegado de Heegaard y el
argumento de anudamiento se enuncian sobre el toro de borde de `V`; el límite
horn torus (con su punto singular, donde la superficie deja de ser una variedad
2-dimensional en sentido estricto) es exactamente donde vive el *caveat* que el
§16 ya declara. Conviene que la figura y el texto digan eso con las mismas
palabras.

---

## Hallazgos sobre el motor (`horn_torus_experimental.py`)

Ninguno de estos es un error de cálculo: son desajustes entre el código y lo que
el resumen v7 afirma. Están sin resolver.

1. **La cinta colapsa en el cuello y atraviesa la voz.** `get_curves()` centra
   las cuatro hebras en `v = π`. Contradice el §4 ("pegada a toda la cara
   interna", distribuida) y colisiona con el §17, donde la voz es un punto fijo
   *distinto* de las marcas de la cinta.
2. **`u_S`, `u_I`, `u_Σ` se calculan y se imprimen pero no se usan.**
   `get_curves()` no los lee: las curvas recorren todo `u`. El resumen del motor
   los reporta como si fueran posiciones.
3. **`v_S`, `v_I`, `v_Σ` entran sólo como fase `mod 2π`**, no como latitud, aunque
   el resumen los imprime como `v_S = ... rad`.
4. **Con el vector por defecto, dos cintas quedan superpuestas:**
   `v_S = v_Σ = 5.969` (PSDI = Psicoticismo = 0.9) y `u_I = u_Σ = 1.047`
   (0.8 + 0.7 = 0.9 + 0.6 = 1.5). Es coincidencia de los datos, no del modelo,
   pero conviene que el mapeo no sea degenerado.
5. **`A(u,v)` no es una distancia sobre el toro.** La euclídea en `(u, v)` ignora
   la periodicidad: `v = 6.2` y `v = 0.08` son prácticamente el mismo punto y sin
   embargo `A` da `4.629` contra `1.654` de la distancia envuelta. Con `u_F = π` la
   componente en `u` se salva por simetría, pero la de `v` no.
   `diagramas_icc.distancia_angular()` tiene la versión envuelta.
6. **Hay un solo núcleo en el código y el §17 pide dos.** El punto de fantasía
   `(π, π/2)` está implementado; el núcleo del trauma —resoluble, que eclosiona
   vía la palabra— no existe en el motor.
7. **El punto de autotangencia no se dibuja nunca**, aunque es el único agujero
   fijo del modelo.
8. **`gaussian_curvature_min` está fijado a mano** (`-12.45 * (1 + psy * 1.5)`).
   La curvatura de Gauss del toro es calculable en forma cerrada,
   `K = cos v / (a²(1 + cos v))`, y diverge al acercarse a la cúspide: eso *dice*
   algo del modelo (la voz como singularidad de curvatura) que un número
   inventado no dice.

---

## Decisiones abiertas (para Carlos)

1. **¿La pared tiene espesor?** El §5 necesita un espesor preconsciente que se
   adelgaza localmente; el §16 dice que el Pcs no ocupa región propia de `V` y es
   el estado-umbral en el instante de tocar el punto de espesor topológico cero.
   Las Fig. 1 y 3 dibujan las dos lecturas a la vez. Si manda el §16, sale la
   banda gris y las vías variables hay que representarlas de otro modo.
2. **¿Puede la cinta pasar por `v = π`?** "Pegada a toda la cara interna" es
   incompatible con "no pasa por la voz", porque en un horn torus `v = π` es un
   punto y no un paralelo. O la cinta lo atraviesa (y entonces la voz no es
   estructuralmente distinta de la cinta), o la cinta vive en bandas que lo
   excluyen (y entonces "toda" hay que reformularlo). Fig. 2 toma la segunda
   opción.
3. **¿Dónde va el núcleo del trauma?** Ni el resumen ni el código fijan su
   posición. En Fig. 1 y 2 está marcado como *posición no fijada*.
4. **¿La fantasía es una marca o varias?** El §8 lo deja abierto (núcleo fundante
   único vs. una marca por trauma). Los diagramas dibujan una sola.
5. **Color.** Las cuatro cintas conservan los colores del visualizador React
   (carmesí / verde / dorado / azul). El par carmesí–verde no sobrevive una
   simulación de deuteranopia: si las figuras van a imprenta, conviene cambiar I
   por un azul-verde.

---

## Regenerar

```bash
python diagramas_icc.py     # requiere horn_torus_experimental.py en el mismo directorio
```

Funciones sueltas: `fig_corte_axial()`, `fig_cinta(M=...)`, `fig_vias_salida()`,
`fig_heegaard()`. La banda de la cinta se controla con
`fig_cinta(banda=(v_min, v_max))`.
