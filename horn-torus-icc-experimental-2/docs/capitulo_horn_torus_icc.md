# El horn torus del Icc

## Material para el Cap. 4/5 — tesis *RSI – Poincaré*

Lic. Carlos Vonsik (MN 85130) · Buenos Aires

---

### Nota preliminar

Este documento reúne, en orden de tesis, el estado de la construcción del horn
torus del Icc: la superficie y sus correspondencias (Parte I), el cierre
matemático del §4.7 (Parte II), y la reescritura del §17 sobre trauma y fantasía
(Parte III). Reemplaza al §4.7 en su versión anterior —la que se apoyaba en la
esfera— y al §17 en su versión de "dos puntos fijos".

Se mantiene la disciplina del resto de la tesis. Cada afirmación va marcada
según su estatuto: **CITA** (verificada contra el texto original, con ubicación),
**LECTURA** (resonancia razonable, todavía sin confirmar), **AXIOMA**
(construcción propia), **PENDIENTE** (pregunta sin resolver). Se agrega aquí una
cuarta marca, **HECHO MATEMÁTICO**, para los enunciados que son teoremas y no
elaboración propia: distinguirlos importa, porque son los únicos que no admiten
discusión doctrinal y también los únicos que imponen condiciones al modelo.

El corpus alemán cotejado es *Aus den Anfängen der Psychoanalyse* (1950, incluye
el *Entwurf* de 1895) y los volúmenes X y XII–XVII de las *Gesammelte Werke*.
Toda cita alemana va con glosa española propia.

---

# Parte I — La superficie

## 1. El objeto: la familia `r → R`

Sea `C` el círculo de radio `R` en el plano `z = 0` —el círculo-núcleo— y para
`0 < r ≤ R` sea `V_r` el entorno tubular cerrado de radio `r` alrededor de `C`,
con borde `T_r = ∂V_r`:

> `x = (R + r cos v) cos u`,  `y = (R + r cos v) sin u`,  `z = r sin v`

con `u, v ∈ [0, 2π)`. El *horn torus* es el caso `r = R`, donde la expresión se
reduce a `a(1 + cos v)` con `a = R = r`.

> **AXIOMA.** Ding es `T_r` para algún `0 < r ≤ R`. El parámetro `r/R` no es
> decorativo: mide cuánto queda del agujero central, cuyo radio es `R − r`.

Definir Ding como miembro de esta familia, y no como "un toro tame con el
agujero llevado al mínimo", es la decisión que organiza toda la Parte II. La
razón se da en el §6.

![La familia r → R](../figures/fig5_familia_limite.png)

*Figura 1 — La familia en corte axial (a); la curva que se colapsa en el límite
es una longitud (b); los invariantes, constantes en la familia, saltan sólo en
el límite (c).*

## 2. El límite y lo que en él se rompe

> **HECHO MATEMÁTICO.** En `r = R` la parametrización manda **toda** la curva
> `λ_int = {v = π}` —el ecuador del agujero— al origen, y es inyectiva fuera de
> ella. El horn torus es por lo tanto el cociente
>
> `horn torus = T² / λ_int ≅ S²` con dos puntos identificados (*toro pinchado*).
>
> En consecuencia: **no es una variedad**, no es homeomorfo a `T²`, y su género
> no está definido en el sentido de la clasificación de superficies. La
> característica de Euler pasa de `0` a `1`; el primer grupo de homología, de
> `Z²⟨μ, λ⟩` a `Z⟨μ⟩`; el grupo fundamental, de `Z²` a `Z`.
>
> El colapso mata la clase de la longitud y deja viva la del meridiano:
> `H₁ = Z²⟨μ,λ⟩ / ⟨λ⟩ = Z⟨μ⟩`.

Esto obliga a corregir una formulación que aparecía dos veces en las versiones
anteriores del documento de trabajo: que el horn torus "sigue siendo,
topológicamente, un toro" y que "tiene género 1 como cualquier toro". Es
verdadero de todo miembro `r < R` y falso del objeto límite. La redacción
correcta es: *el horn torus es el límite de una familia de toros lisos de género
1; los enunciados de género se refieren a la familia, no al objeto límite, que ya
no es una variedad.*

> **AXIOMA — la voz deja de postularse y pasa a derivarse.** En la versión
> anterior, "el punto de autotangencia es una vía de salida fija, de espesor
> topológico cero" era una propiedad que había que atribuirle al punto. En la
> familia es lo que el límite produce: el agujero tiene radio `R − r > 0` y se
> cierra cuando `r → R`, pero **no se cierra como agujero** — degenera en el
> único punto donde adentro y afuera se tocan.

> **CITA** — Lacan, *Séminaire XI*, leçon 15: el oído es el único orificio del
> campo del inconsciente que no puede cerrarse. Con la reformulación, la frase
> tiene lectura literal: el cierre no ocurre; ocurre la degeneración.

> **AXIOMA — qué ciclo muere no es una elección.** El colapso mata `λ` y deja
> vivo `μ`. En el modelo, `λ` es la dirección en la que corre la cinta —la vuelta
> alrededor del eje, el parámetro `u`— y `μ` es el círculo de la sección
> transversal, el borde que la pulsión recorre. El generador que sobrevive al
> límite es el del trayecto circular alrededor del borde; el que muere es el de
> la cadena. Enunciado: *en la voz, la dirección de la cadena degenera y sólo
> subsiste la del circuito pulsional.*

## 3. El corte axial y las correspondencias

El plano que contiene el eje de rotación corta a la superficie en dos
circunferencias iguales de radio `r` centradas en `(±R, 0)`; con `r = R` son
tangentes en el origen. Las marcas aparecen dos veces porque el plano corta **el
mismo tubo dos veces**.

![Corte axial](../figures/fig1_corte_axial.png)

*Figura 2 — Corte axial del horn torus del Icc.*

| Elemento | Estatuto | Apoyo |
|---|---|---|
| Dos circunferencias iguales tangentes en un punto | HECHO MATEMÁTICO | consecuencia de `R = r`; no es licencia del dibujo |
| El punto de autotangencia es la voz / vía del superyó | CITA + AXIOMA | Lacan, Sem. XI, leçon 15; Freud, GW XV, conf. XXXI (*die Stimme des Gewissens*). Que sea *este* punto es axioma propio |
| La cinta S-I-Σ pegada a la cara interna | AXIOMA | §4 |
| El hilo pulsional pegado al borde de I | AXIOMA con CITA de apoyo | Lacan, Sem. XI, p. 106 (*bord érogène*) funda el trayecto circular alrededor de un borde; que el borde sea el de I es aplicación propia |
| Interior de `V` vacío | AXIOMA | §8, opción (A) |
| Pared con espesor Pcs que se anula en la autotangencia | AXIOMA + PENDIENTE | ver §14 |
| Adelgazamientos locales como vías variables | AXIOMA | §5 |
| El afuera (Cc) sin nombrar | PENDIENTE | §9 lo deja explícitamente abierto |

La posición angular de las cuatro marcas de la cinta **en el corte** es
arbitraria: el corte es transversal a `u`, de modo que muestra una sección de la
cinta, y lo que el modelo fija es el orden relativo —el hilo pegado al borde de
I—, no la latitud exacta.

## 4. La cinta S-I-Σ sobre la cara interna

![La cinta sobre la cara interna](../figures/fig2_cinta_cara_interna.png)

*Figura 3 — La cara interna vista desde abajo (a) y su carta desplegada `(u, v)`
(b). Las líneas punteadas son las curvas tal como las calcula el motor.*

En la carta, el lugar `v = π` se dibuja como una recta sólo porque la carta
desdobla lo que en el límite es un punto. Esto planteaba una incompatibilidad
aparente: "la cinta pegada a *toda* la cara interna" contra "la cinta no pasa por
el agujero de la voz".

> **HECHO MATEMÁTICO.** La incompatibilidad se disuelve en la familia. Para
> `r < R`, `λ_int` es una curva honesta de radio `R − r`, y una curva cerrada de
> clase `(1, q)` sobre el toro corta a `λ_int` un mínimo de `|q|` veces. Por lo
> tanto: con `q = 0` los cruces son **removibles** —la hebra puede deslizarse
> hasta no tocar nunca la voz— y con `q ≠ 0` son **esenciales**: ninguna
> deformación los evita, y en el límite la hebra pasa `|q|` veces por la voz en
> cada vuelta.

> **AXIOMA (decisión adoptada).** Las cuatro hebras son de clase `(1, 0)` y sus
> cruces con `λ_int` se remueven: la cinta vive en bandas que excluyen `v = π`.
> La voz no es un punto que la cinta contenga sino una **vía de salida** a la que
> la pulsión llega. Con esto, "pegada a toda la cara interna" se lee como "pegada
> a toda la extensión en `u`", y se preserva la exigencia del §17 de que la voz
> sea estructuralmente distinta de las marcas.
>
> La alternativa —dar `q = 1` al hilo pulsional, con lo cual pasaría
> necesariamente por la voz una vez por vuelta— es incompatible con que el hilo
> esté pegado al borde de I. Son excluyentes; se elige la primera.

## 5. Las vías de salida y el tiempo en el cruce

![Las vías de salida](../figures/fig3_vias_de_salida.png)

*Figura 4 — Las cuatro vías de salida: una fija, tres variables.*

| Vía | Estatuto | Apoyo |
|---|---|---|
| La voz — fija, espesor cero, siempre abierta | CITA + AXIOMA | como en §3 |
| Palabra deformada (*Entstellung*) | AXIOMA con apoyo freudiano | exige marca ligada a una *Wortvorstellung*: la travesía Ub→Vb de la Carta 52 |
| *Agieren* | CITA | GW X, «Erinnern, Wiederholen und Durcharbeiten», p. 131 |
| Sublimación | AXIOMA | sin cita puntual por ahora |

> **AXIOMA sobre CITA.** Cada cruce es un borde de época mínimo: allí se produce
> la fecha, no adentro. Se apoya en GW X, p. 286 —*«Auch die Zeitbeziehung ist an
> die Arbeit des Bw-Systems geknüpft»*— y en la Carta 52. El interior es
> *zeitlos*: las marcas no se fechan, y eso no contradice que la inscripción
> tenga historia vía *Bahnung*.

---

# Parte II — El cierre matemático del §4.7

## 6. De `V` a `S³` por pegado de Heegaard

![Heegaard y no-anudamiento](../figures/fig4_heegaard_no_anudamiento.png)

*Figura 5 — `V`, la variedad `M`, el pegado de género 1, y por qué el toro exige
una hipótesis que la esfera no exigía.*

> **AXIOMA (formalización adoptada).** `V` es el toro sólido que Ding cierra, y
> `M = V ∖ N(S ∪ I ∪ Σ)`. El borde `∂M` es Ding —con su punto singular en el
> límite— unido a las componentes toroidales de los entornos tubulares removidos.

> **HECHO MATEMÁTICO.** Para **todo** `r < R`: `T_r` es lisa, encajada,
> orientable, de género 1; `V_r` es un toro sólido y `S³ ∖ int(V_r)` **también**;
> y `S³ = V_r ∪_φ V'_r` con `φ` intercambiando meridiano y longitud
> (`μ ↦ λ`, `λ ↦ μ`) — la partición de Heegaard de género 1. Pegar por la
> identidad da `S¹ × S²`, no `S³`. Además `T_r` separa `S³` en exactamente dos
> componentes (dualidad de Alexander, *Trans. AMS* 23, 1922), lo que vale para
> cualquier género.

Y acá está la ganancia de definir Ding como miembro de la familia. Que **ambos
lados** sean toros sólidos no es automático para un toro cualquiera: un toro tame
puede estar anudado, y entonces un lado es el complemento del nudo —hiperbólico,
por Thurston— y no un toro sólido. En la versión anterior eso obligaba a
declarar aparte una hipótesis de no-anudamiento. Al definir Ding como el borde de
un entorno tubular de un círculo **redondo**, el no-anudamiento **deja de ser
hipótesis**: el núcleo es un nudo trivial. Se paga un axioma más barato —"Ding es
un toro de revolución"— que es, además, lo que las ecuaciones paramétricas del
§1 ya afirmaban.

> **PENDIENTE (declarado, no resuelto).** Lo que sobrevive al límite es la
> separación en dos componentes. Lo que **no** sobrevive tal como está enunciado
> es "ambos lados son toros sólidos": en `r = R` el lado de afuera es un toro
> sólido con un punto de su borde pinchado. Los pasos 3 y 4 de la Figura 5
> dibujan toros de revolución no degenerados porque es el objeto al que el
> teorema se aplica.

## 7. Los invariantes de la familia

![Los invariantes](../figures/fig6_invariantes_familia.png)

*Figura 6 — La energía de flexión diverge en el límite (a); sólo la curvatura
mínima se va al infinito (b).*

Formas cerradas, todas contrastadas contra integración numérica (control de
Gauss–Bonnet: `∫K dA ≈ −7 × 10⁻¹⁶` para todo miembro liso):

> área `A = 4π²Rr` · volumen `V = 2π²Rr²` · curvatura de Gauss
> `K = cos v / (r(R + r cos v))`, con `K_max = 1/(r(R+r))` y
> `K_min = −1/(r(R−r))` · curvatura media `H = (R + 2r cos v)/(2r(R + r cos v))`,
> con promedio en área `⟨H⟩ = 1/(2r)` · energía de Willmore
> `W = ∫H²dA = π²ρ²/√(ρ²−1)` con `ρ = R/r`.

| `r/R` | `R−r` | `χ` | rango `H₁` | área | `W` | `K_min` |
|---|---|---|---|---|---|---|
| 0.4500 | 1.1687 | 0 | 2 | 80.221 | 24.560 | −0.895 |
| 0.7071 | 0.6224 | 0 | 2 | 126.056 | 19.739 | −1.069 |
| 0.9000 | 0.2125 | 0 | 2 | 160.443 | 25.158 | −2.461 |
| 0.9900 | 0.0213 | 0 | 2 | 176.487 | 70.670 | −22.369 |
| 1.0000 | 0.0000 | 1 | 1 | 178.270 | ∞ | −∞ |

*(escala `R = 2.125`, la del motor con el vector por defecto.)*

> **HECHO MATEMÁTICO.** `W` y `K_min` **divergen** cuando `r → R`, mientras
> `K_max` y `⟨H⟩` se quedan finitos. El límite donde aparece la voz es un punto
> de energía de flexión infinita: el horn torus está a distancia infinita, en
> energía de Willmore, de cualquier miembro liso de la familia.

`W` alcanza su mínimo `2π² = 19.739` en `r/R = 1/√2` —el toro de Clifford, el
mínimo de la conjetura de Willmore—. Conviene registrarlo porque el motor venía
usando ese valor como línea de base mientras declaraba estar en `r = R`.

---

# Parte III — Trauma y fantasía (§17)

## 8. El trauma: alcanzabilidad indexada por época

> **CITA** — *Entwurf einer Psychologie* (1895), parte II «Psychopathologie der
> Hysterie», § *Das hysterische πρῶτον ψεῦδος*, en *Aus den Anfängen der
> Psychoanalyse* (1950), pp. 432–435.

Escena I, los doce años (p. 432): *«Emma steht heute unter dem Zwange, daß sie
nicht allein in einen Kaufladen gehen kann. […] Sie ging in einen Laden etwas
einkaufen, sah die beiden Kommis, von denen ihr einer in Erinnerung ist,
miteinander lachen, und lief in irgendwelchem Schreckaffekt davon.»* Los
pensamientos que se despiertan: *«daß die beiden über ihr Kleid gelacht»*.

Escena II, los ocho años (pp. 433–434): *«Als Kind von 8 Jahren ging sie zweimal
in den Laden eines Greißlers allein, um Näschereien einzukaufen. Der Edle kniff
sie dabei durch die Kleider in die Genitalien.»*

Y la composición, explícita (p. 434): *«Wir verstehen nun Szene I (Kommis) wenn
wir Szene II (Greißler) dazunehmen.»*

La frase decisiva (p. 435): *«Es liegt hier der Fall vor, daß eine Erinnerung
einen Affekt erweckt, den sie als Erlebnis nicht erweckt hatte, weil unterdes
die Veränderung der Pubertät ein anderes Verständnis des Erinnerten ermöglicht
hat.»* — *se da aquí el caso de que un recuerdo despierta un afecto que, como
vivencia, no había despertado, porque en el intervalo la mudanza de la pubertad
hizo posible otra comprensión de lo recordado.*

Y en la misma página, la que sostiene la formalización del camino compuesto:
*«In unserem Beispiel ist aber gerade das bemerkenswert, daß nicht jenes Glied
ins Bewußtsein tritt, welches ein Interesse weckt (Attentat), sondern ein
anderes als Symbol (Kleider).»* — *lo notable en nuestro ejemplo es justamente
que no accede a la conciencia el eslabón que despierta el interés (el atentado),
sino otro, a título de símbolo (la ropa).*

> **CITA — el sustantivo *Nachträglichkeit* es de Freud.** Seis veces en *Aus
> den Anfängen*: cuatro en la p. 247 y una en la p. 248 (*Brief vom 14. 11. 97*),
> y una en la p. 272. Tres en GW XII: p. 72 —*«Es ist dies einfach ein zweiter
> Fall von Nachträglichkeit»*, en *Aus der Geschichte einer infantilen
> Neurose*—, otra entre pp. 87–89, y la entrada del Sachregister del volumen:
> *«Nachträglichkeit (Wiederbelebung v. Eindrücken) 72»*. Laplanche y el
> *après-coup* lacaniano elaboran el concepto; no acuñan la palabra.

De la carta del 14.11.97, p. 247: *«Hat man ein Kind an den Genitalien
irritiert, so entsteht Jahre später durch Nachträglichkeit von der Erinnerung
daran eine weit stärkere Sexualentbindung als damals, weil der ausschlaggebende
Apparat und der Sekretionsbetrag inzwischen gewachsen sind.»* Y: *«So gibt es
eine nicht neurotische Nachträglichkeit normaler Weise, und aus ihr entsteht der
Zwang. (Unsere anderen Erinnerungen wirken sonst nur, weil sie als Erlebnisse
gewirkt haben.)»*

El paréntesis es el que sostiene la formalización: **los demás recuerdos actúan
sólo porque actuaron como vivencias.** La *Nachträglichkeit* es la excepción.

> **AXIOMA.** Sea `T` la marca del trauma. La alcanzabilidad no es una propiedad
> de `T` sino del sistema de caminos, y ese sistema cambia con cada nueva
> inscripción: en la época `n` no existe camino de `T` a la pared; en la época
> `n+1`, depositada `M₂` que comparte borde con `T`, existe el camino compuesto
> `T → M₂ → cruce`. **El punto no se mueve; el camino aparece.** Por eso lo que
> sale por la palabra es la otra escena.

## 9. La fantasía: una punción, no una marca

> **CITA** — *«Ein Kind wird geschlagen»* (1919), GW XII, pp. 199–226; el pasaje
> de la fase 2, en p. 204.

| | fase | estatuto en el aparato |
|---|---|---|
| φ₁ | «el padre pega al niño» (al hermano odiado) | se recuerda |
| φ₂ | «yo soy pegada por el padre» | nunca fue conciente; *construcción del análisis* |
| φ₃ | «pegan a un niño» (impersonal, excitante) | conciente |

*«Ihr Wortlaut ist jetzt also: Ich werde vom Vater geschlagen. […] Aber man kann
in gewissem Sinne von ihr sagen, sie habe niemals eine reale Existenz gehabt.
Sie wird in keinem Falle erinnert, sie hat es nie zum Bewußtwerden gebracht. Sie
ist eine Konstruktion der Analyse, aber darum nicht minder eine
Notwendigkeit.»*

Glosa: *en cierto sentido puede decirse de ella que nunca tuvo una existencia
real. En ningún caso se la recuerda, nunca llegó a devenir conciente. Es una
construcción del análisis, y no por eso menos una necesidad.*

La estructura se repite en el varón (GW XII, entre pp. 219–221): *«Sie hat ein
Vorstadium, das regelmäßig unbewußt ist und das den Inhalt hat: Ich werde vom
Vater geschlagen.»*

> **AXIOMA (reformulación del §17).** Si φ₂ nunca fue conciente y nunca se
> inscribió como recuerdo, entonces **no es una marca**: no es una
> representación reprimida esperando volver. El núcleo fantasmático es una
> **punción** de la cara interna — un punto quitado. No hay camino de salida
> desde él, y no porque esté bloqueado sino porque no hay nada de donde partir.
> Lo que el análisis produce no es una visita sino un **lazo**: φ₁ y φ₃ son
> alcanzables, y φ₂ queda determinada porque el lazo que las une **no se puede
> contraer**. *La construcción rodea lo que no puede visitar* — que es lo que
> Freud dice que hace la construcción en análisis.

![Trauma y fantasía](../figures/fig7_trauma_fantasma.png)

*Figura 7 — El trauma es alcanzable pero no por sí mismo (a); la fantasía no es
un punto sino un agujero (b).*

> **HECHO MATEMÁTICO — la condición que no hay que equivocar.** Esto vale porque
> las marcas viven en la **cara interna**, que es una superficie: en una
> superficie, un punto quitado se detecta con un lazo no contráctil (`π₁` de la
> cara punzada). Si el núcleo se pusiera en el **interior del toro sólido**, un
> lazo no detectaría nada —en tres dimensiones los lazos alrededor de un punto se
> contraen— y habría que usar una esfera que lo encierre (`H₂`). La
> formalización del lazo exige los núcleos sobre la cara interna, que es donde el
> §4 ya los pone.

## 10. Los tres defectos

El §17 exige que ni el trauma ni la fantasía coincidan con el agujero de la voz.
Con la reescritura la exigencia se cumple por construcción, porque los tres son
de tipos distintos:

| | qué es | dónde | alcance |
|---|---|---|---|
| **la voz** | el punto donde la superficie deja de ser una variedad (la autotangencia del límite) | de la superficie misma | universal, estructural |
| **el núcleo fantasmático** | un punto **quitado** de la cara interna; ahí la superficie es variedad salvo por el punto que falta | de la cara interna | singular, por sujeto |
| **el núcleo del trauma** | **no es un defecto**: es una marca, con caminos indexados por época | sobre la cara interna | singular, por sujeto |

La asimetría entre trauma y fantasía deja de estipularse: uno es un elemento de
la superficie y el otro un defecto de ella, y de ahí se sigue —no se declara—
que uno sea resoluble y el otro indestructible.

## 11. La angustia en dos mecanismos

![Los dos mecanismos de la angustia](../figures/fig8_angustia_dos_mecanismos.png)

*Figura 8 — Junto al trauma la angustia es proximidad (a); junto al agujero es
que hay que elegir un lado (b).*

Primero el cálculo, porque decide el resto. Una marca y una salida alineadas con
la punción, a `0.5` de cada lado: el camino recto mide `1`. Quitando un disco de
radio `ε`, el camino más corto es tangente–arco–tangente:

| `ε` | largo del rodeo | exceso |
|---|---|---|
| 0.20 | 1.081122 | +8.11 % |
| 0.10 | 1.020067 | +2.01 % |
| 0.05 | 1.005004 | +0.50 % |
| 0.01 | 1.000200 | +0.02 % |
| 0.001 | 1.000002 | +0.0002 % |

> **HECHO MATEMÁTICO.** El exceso va como `ε²`, no como `ε` —el cociente
> `exceso/ε²` converge a `(1/a + 1/b)/2 = 2.0`—. Para una punción verdadera
> (`ε → 0`) el costo métrico es **exactamente cero**: el largo del camino recto
> sigue siendo el ínfimo, sólo que no se alcanza.

> **AXIOMA.** Junto al trauma la angustia es **proximidad**: crece al acercarse,
> decrece al alejarse, y un umbral tiene sentido. Junto al agujero no es
> proximidad, porque atravesarlo no es caro: es imposible, y los dos modos de
> rodearlo no son el mismo camino —no son homotópicos—. La angustia es que hay
> que **elegir un lado** y nada en la superficie decide cuál: angustia como
> imposibilidad de la indiferencia.

> **AXIOMA.** Como no se puede pasar, se rodea, y rodear es lo único disponible:
> el circuito **es** la tramitación. Por eso lo que sale de esa región sale como
> construcción y no como recuerdo — *«Sie wird in keinem Falle erinnert… Sie ist
> eine Konstruktion der Analyse»*.

> **AXIOMA — la distinción clínica que el modelo produce.** Junto al trauma,
> alejarse alivia, y la palabra por la vía compuesta resuelve: eso es la eclosión
> del §17. Junto al agujero, alejarse no alivia del mismo modo, porque la
> angustia no venía de la distancia: se vuelve a presentar cada vez que el
> circuito pasa. **La repetición no es un fracaso de la tramitación: es la forma
> que la tramitación toma ahí.**

## 12. Qué prohíbe el modelo

Un modelo se gana el lugar si prohíbe algo. Hasta esta reescritura, el horn torus
describía; ahora afirma:

1. **No hay camino de salida desde el núcleo fantasmático en ninguna época.** A
   diferencia del trauma, ninguna inscripción posterior puede abrirle uno,
   porque no hay punto de partida. La indestructibilidad deja de ser un adjetivo.
2. **De esa región no puede volver un recuerdo**, sólo una construcción — y esto
   no es sólo consecuencia del modelo, es CITA: *«Sie wird in keinem Falle
   erinnert»*.
3. **El trauma sí puede volver, pero siempre por otra escena**: la salida es un
   camino compuesto.
4. **En la voz, la dirección de la cadena degenera y sólo subsiste la del
   circuito pulsional** (§2): el generador que muere en el límite es `λ`, el de
   la cinta, y el que sobrevive es `μ`, el del borde.

---

# Parte IV — Aparato

## 13. Citas verificadas

Cotejadas directamente contra los archivos alemanes del corpus. Las páginas
salen de los encabezados de página y de los marcadores de los propios volúmenes.

| # | cita | ubicación | estatuto |
|---|---|---|---|
| 1 | *«…daß eine Erinnerung einen Affekt erweckt, den sie als Erlebnis nicht erweckt hatte…»* | Entwurf, II, § *Das hysterische πρῶτον ψεῦδος* — Aus den Anfängen, p. 435 | CITA |
| 2 | *«…daß nicht jenes Glied ins Bewußtsein tritt, welches ein Interesse weckt (Attentat), sondern ein anderes als Symbol (Kleider).»* | ídem, p. 435 | CITA |
| 3 | Escena I (Kommis, 12 años) / Escena II (Greißler, 8 años) y su composición | ídem, pp. 432–434 | CITA |
| 4 | *«So gibt es eine nicht neurotische Nachträglichkeit normaler Weise… (Unsere anderen Erinnerungen wirken sonst nur, weil sie als Erlebnisse gewirkt haben.)»* | Brief vom 14. 11. 97 — Aus den Anfängen, p. 247 | CITA |
| 5 | *Nachträglichkeit* como sustantivo, otras apariciones | Aus den Anfängen pp. 247 (×4), 248, 272; GW XII p. 72 y entre 87–89 | CITA |
| 6 | *«…sie habe niemals eine reale Existenz gehabt… Sie ist eine Konstruktion der Analyse, aber darum nicht minder eine Notwendigkeit.»* | *Ein Kind wird geschlagen* — GW XII, p. 204 | CITA |
| 7 | *«Sie hat ein Vorstadium, das regelmäßig unbewußt ist…»* (el varón) | ídem, GW XII, entre pp. 219–221 | CITA |
| 8 | *«Auch die Zeitbeziehung ist an die Arbeit des Bw-Systems geknüpft»* | GW X, p. 286 | CITA |
| 9 | *Agieren* | GW X, «Erinnern, Wiederholen und Durcharbeiten», p. 131 | CITA |
| 10 | El orificio que no puede cerrarse | Lacan, *Séminaire XI*, leçon 15 | CITA |
| 11 | *bord érogène* | Lacan, *Séminaire XI*, p. 106 | CITA |

Paginación fina por confirmar en el ejemplar impreso: los encabezados del OCR
son ralos en *Ein Kind wird geschlagen* —trece en veintisiete páginas—, de modo
que la p. 204 de la cita 6 está acotada entre los encabezados 201 y 205, con el
de 205 inmediatamente posterior a la frase. Lo mismo con las citas 5 (entre 87 y
89) y 7 (entre 219 y 221). Las frases alemanas están transcriptas de los
archivos.

## 14. Pendientes

1. **¿La pared tiene espesor?** El §5 necesita un espesor preconsciente que se
   adelgaza localmente; el §16 sostiene que el Pcs no ocupa región propia de `V`
   y es el estado-umbral en el instante de tocar el punto de espesor topológico
   cero. Las Figuras 2 y 4 dibujan las dos lecturas a la vez. El parámetro `r/R`
   sugiere leerlas como dos regímenes de la misma familia, pero `R − r` es el
   radio del agujero central y no el espesor de la pared: la identificación hay
   que construirla.
2. **¿Dónde va el núcleo del trauma?** Ni el texto ni el código fijan su
   posición. Ya no es libre, sin embargo: debe existir otra marca con la que
   comparta borde, y la salida tiene que pasar por ella.
3. **¿La fantasía es una punción o varias?** El §8 lo deja abierto (núcleo
   fundante único vs. una por trauma). Las figuras dibujan una sola.
4. **Cuánta angustia junto al agujero.** Es una pregunta métrica y la topología
   sólo contesta sí o no. Un campo graduado alrededor de la punción exige una
   decisión de modelo adicional —un `ε` finito, o un radio de giro máximo para el
   recorrido pulsional— que hay que justificar. Mientras no esté tomada, el
   modelo afirma la *clase* del fenómeno junto al agujero y la *magnitud* sólo
   junto al trauma.
5. **El acoplamiento con el SCL-90-R.** Las constantes son libres y la asignación
   escala→coordenada no se deriva de nada; entre los "invariantes topológicos"
   hay magnitudes fijadas a mano. O sale del capítulo o entra explícitamente como
   parametrización ilustrativa, con las constantes declaradas arbitrarias y sin
   valor diagnóstico.
6. **Color.** El par carmesí–verde de las cintas no sobrevive una simulación de
   deuteranopia; si las figuras van a imprenta, conviene cambiar I por un
   azul-verde.

## 15. Reproducibilidad

Las ocho figuras y los dos visores interactivos se generan con `diagramas_icc.py`
y `familia_horn_torus.py`, que importan `HornTorusICC` de
`horn_torus_experimental.py` (repositorio `horn-torus-icc-experimental`):

> `fig_familia_limite()` · `fig_corte_axial()` · `fig_cinta()` ·
> `fig_vias_salida()` · `fig_heegaard()` · `fig_invariantes_familia()` ·
> `fig_trauma_fantasma()` · `fig_angustia()` · `html_interactivo()` ·
> `html_familia()`

`HornTorusFamilia(r_over_R=x)` extiende el motor sin modificarlo: con
`r_over_R = 1.0` reproduce sus salidas de forma idéntica, y con `r_over_R < 1`
recorre la familia. `invariantes()` devuelve las formas cerradas del §7 y
`resumen_geometrico()` las imprime por régimen.