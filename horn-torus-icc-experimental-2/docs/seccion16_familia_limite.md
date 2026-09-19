# §16 reescrito: el horn torus como límite de la familia `r → R`

*Propuesta de reemplazo para los puntos (1)–(3) del §16 del resumen v7. Sigue la
disciplina CITA / LECTURA / AXIOMA / PENDIENTE. Los hechos matemáticos van
marcados como tales: no son axiomas tuyos ni citas de Freud, son teoremas.*

---

## La construcción

Sea `C` el círculo de radio `R` en el plano `z = 0` (el círculo-núcleo), y para
`0 < r ≤ R` sea `V_r` el entorno tubular cerrado de radio `r` alrededor de `C`,
con borde `T_r = ∂V_r`:

```
x = (R + r cos v) cos u ,   y = (R + r cos v) sin u ,   z = r sin v
```

`Ding` no se define ya como "un toro tame con el agujero llevado al mínimo",
sino como **un miembro de esta familia**. El horn torus es el caso `r = R`.

> **AXIOMA (reformulado, más barato que el anterior)** — Ding es `T_r` para algún
> `0 < r ≤ R`. El parámetro `r/R` no es decorativo: mide cuánto queda del
> agujero central.

---

## (1) Todo lo que el §4.7 necesitaba vale en la familia, sin hipótesis extra

> **Hecho matemático.** Para **todo** `r < R`:
>
> - `T_r` es una superficie lisa, encajada, orientable, de género 1;
> - `V_r` es un toro sólido, y `S³ ∖ int(V_r)` es **también** un toro sólido;
> - `S³ = V_r ∪_φ V'_r`, donde `φ` identifica los bordes intercambiando meridiano
>   y longitud (`μ ↦ λ`, `λ ↦ μ`): es la partición de Heegaard de género 1;
> - `T_r` separa `S³` en exactamente dos componentes (dualidad de Alexander,
>   *Trans. AMS* 23, 1922).

**Esto es la ganancia concreta de la reescritura.** En la versión anterior, que
ambos lados de Ding fueran toros sólidos exigía declarar aparte la hipótesis de
no-anudamiento, porque un toro tame *puede* estar anudado y entonces un lado es
el complemento de un nudo. Al definir Ding como miembro de la familia estándar,
el no-anudamiento **deja de ser una hipótesis** y pasa a ser una propiedad de la
definición: `T_r` es el borde de un entorno tubular de un círculo redondo, es
decir de un nudo trivial. El caveat del §16 no desaparece por arte de magia —
lo pagás una vez, y más barato: en vez de axiomatizar "Ding está sin anudar"
axiomatizás "Ding es un toro de revolución", que es una afirmación mucho más
fácil de defender y que además es la que el propio modelo ya usaba al escribir
las ecuaciones paramétricas.

---

## (2) El límite `r = R`: qué pasa exactamente

Verificado numéricamente: en `r = R` la parametrización manda **toda** la curva
`λ_int = {v = π}` (la longitud interior, el ecuador del agujero) al origen
—`max |P| = 1.2 × 10⁻¹⁶`— y es inyectiva fuera de ella. De modo que el horn
torus es, exactamente, el cociente

```
horn torus  =  T² / λ_int        (una longitud colapsada a un punto)
            ≅  S² con dos puntos identificados        ("toro pinchado")
```

> **Hecho matemático.** Consecuencias del colapso:
>
> | | `r < R` | `r = R` |
> |---|---|---|
> | ¿variedad? | sí, lisa | **no** |
> | característica de Euler `χ` | `0` | `1` |
> | `H₁` | `Z²⟨μ, λ⟩` | `Z⟨μ⟩` |
> | `π₁` | `Z²` | `Z` |
>
> El colapso mata la clase de la longitud y deja viva la del meridiano:
> `H₁ = Z²⟨μ,λ⟩ / ⟨λ⟩ = Z⟨μ⟩`.
>
> Lo que **sí** sobrevive al límite: la separación en dos componentes. Lo que
> **no** sobrevive tal como está enunciado: "ambos lados son toros sólidos" —
> en el límite, el lado de afuera es un toro sólido con un punto de su borde
> pinchado.

### Dos correcciones que hay que hacer en el texto y en el código

1. **El §2 y el §16 dicen que el horn torus "sigue siendo, topológicamente, un
   toro" y que "tiene género 1 como cualquier toro".** Eso es verdadero de todo
   miembro `r < R` y **falso del límite**: el objeto límite no es una variedad, no
   es homeomorfo a `T²`, y su género no está definido en el sentido de la
   clasificación de superficies. Redacción sugerida: *"el horn torus es el límite
   de una familia de toros lisos de género 1; los enunciados de género se
   refieren a la familia, no al objeto límite, que ya no es una variedad"*.
2. **`horn_torus_experimental.py` imprime** `Característica de Euler (χ): 0 (Toro
   Manifold Genero 1)`. Correcto para la familia, incorrecto para el límite. Y
   el arreglo es una mejora, no un parche: informar `χ = 0` mientras `r < R` y
   `χ = 1` en `r = R` convierte al invariante en **la firma numérica del lugar
   donde aparece la voz**.

---

## (3) Lo que el límite le da a la teoría

Acá el estatuto cambia: los hechos de arriba son teoremas, lo que sigue es
lectura tuya sobre ellos.

> **AXIOMA — la voz deja de postularse y pasa a derivarse.** En la versión
> anterior, "el punto de autotangencia es una vía de salida fija, de espesor
> topológico cero" era una propiedad que había que atribuirle al punto. En la
> familia, es lo que el límite produce: el agujero tiene radio `R − r > 0` y se
> cierra cuando `r → R`, pero **no se cierra como agujero** — degenera en el
> único punto donde adentro y afuera se tocan. El *"orificio que no puede
> cerrarse"* de Lacan (Sem. XI, leçon 15 — CITA ya verificada) pasa a tener una
> lectura literal: el cierre no ocurre, ocurre la degeneración.

> **AXIOMA — qué ciclo muere no lo elegís vos, lo decide la geometría.** El
> colapso mata la longitud `λ` y deja vivo el meridiano `μ`. En tu modelo, `λ` es
> la dirección **en la que corre la cinta** (la vuelta alrededor del eje, el
> parámetro `u`) y `μ` es el **círculo de la sección transversal** (el parámetro
> `v`), que es el borde que la pulsión recorre. Es decir: el generador que
> sobrevive al límite es el del trayecto circular alrededor del borde
> —justamente el movimiento que Lacan describe en la cita del *bord érogène*— y
> el que muere es el de la cadena. Si querés que el modelo **afirme** algo en vez
> de ilustrarlo, esto es un buen candidato: *en la voz, la dirección de la cadena
> degenera y sólo subsiste la del circuito pulsional.*

> **PENDIENTE — puede destrabar la tensión §5 / §16.** El parámetro `r/R`
> interpola entre dos regímenes: con `r < R` hay una región entre adentro y
> afuera (el agujero tiene radio positivo), y con `r = R` sólo queda un punto de
> contacto. Eso sugiere leer el "espesor preconsciente" del §5 y el "Pcs como
> estado-umbral" del §16 no como dos afirmaciones en conflicto sino como los dos
> regímenes de la misma familia. **No está cerrado**: el `R − r` de la familia es
> el radio del agujero central, no el espesor de la pared que dibujan las Fig. 1
> y 3, así que la identificación hay que construirla, no darla por hecha.

---

## Qué cambiar en el motor

Tres cosas chicas, en este orden:

1. Parametrizar la familia: `HornTorusICC(r_over_R=1.0)` y
   `punto(R, r, u, v)` en vez de fijar `R = r = a`. Con eso podés recorrer la
   familia y mirar qué se rompe sólo en el límite.
2. Informar `χ` y el rango de `H₁` por régimen, en lugar de la línea fija.
3. Reemplazar `gaussian_curvature_min = -12.45 * (1 + psy * 1.5)` por la
   curvatura de Gauss real, que para esta familia es
   `K = cos v / (r (R + r cos v))`. Diverge al acercarse a `v = π` cuando
   `r → R`: la voz como singularidad de curvatura. Es un número que *dice* algo,
   a diferencia del actual.
