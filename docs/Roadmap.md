# Roadmap de Producto y Desarrollo

## 1. Diagnóstico del estado actual

### Fortalezas
- Existe un prototipo funcional sin dependencias pesadas.
- El loop principal ya resuelve una secuencia de comandos y permite ganar o perder.
- La idea didáctica está clara: secuencias, repetición y bloques.
- Ya hay ranking local, temporizador y progresión básica de nivel.

### Debilidades técnicas
- `app.js` concentra estado, render, reglas, persistencia y progresión.
- `data.js` mezcla definición de comandos y nivel en memoria, sin formato extensible para contenido.
- No existe separación entre motor de juego, UI, editor de acciones y datos.
- La lógica de `repeat` y `enter` es suficiente para un prototipo, pero no para un sistema de acciones escalable.
- Los niveles no están externalizados en JSON, por lo que diseñar contenido será caro y propenso a errores.
- No hay pipeline de assets para sprites, sonidos ni validación de niveles.
- No hay base para elementos complejos: llaves, puertas, coleccionables, NPC, decisiones o triggers narrativos.

### Riesgos de producto
- Si se sigue añadiendo lógica en `app.js`, cada feature nueva costará más y romperá más cosas.
- La progresión actual de niveles es procedural y poco controlable para diseño didáctico.
- El editor de acciones todavía no soporta bien una experiencia de creación más compleja.

## 2. Visión objetivo

Convertir el prototipo en un videojuego didáctico completo, modular y escalable, con:

- niveles declarativos en JSON,
- motor de juego desacoplado de la interfaz,
- sistema de comandos y efectos extensible,
- editor de acciones mejorado,
- sprites y sonido,
- progresión por campaña,
- decisiones dentro del nivel,
- trabajo paralelo de 3 programadores con integración incremental por MVP.

## 3. Arquitectura objetivo

### Principios
- Datos primero: reglas de niveles y contenido fuera del código.
- Motor puro: resolver comandos y colisiones sin depender del DOM.
- UI desacoplada: renderizar a partir de estado observable.
- Assets desacoplados: sprites, audio y textos configurables.
- Vertical slices: cada MVP debe ser jugable de punta a punta.

### Estructura sugerida

```text
/src
  /core
    gameState.js
    gameEngine.js
    commandEvaluator.js
    collisionSystem.js
    scoringSystem.js
    progressionSystem.js
  /content
    /commands
      commandRegistry.js
    /elements
      elementRegistry.js
    /levels
      levelLoader.js
      levelValidator.js
      levelIndex.json
      level-001.json
      level-002.json
  /ui
    uiController.js
    hudView.js
    gridView.js
    modalView.js
    rankingView.js
  /editor
    sequenceEditor.js
    blockEditor.js
    commandPalette.js
    sequenceSerializer.js
  /audio
    audioManager.js
    audioMap.js
  /assets
    /sprites
    /audio
  /services
    storageService.js
    saveService.js
  /utils
    deepClone.js
    eventBus.js
    constants.js
main.js
```

### Responsabilidades
- `core`: reglas puras del juego.
- `content`: comandos, elementos y niveles configurados como datos.
- `ui`: render y eventos de pantalla.
- `editor`: construcción y edición de secuencias/bloques.
- `audio`: efectos y música.
- `services`: localStorage, guardado, perfil y ranking.

## 4. Diseño de niveles en JSON

### Objetivo
Permitir que diseño de niveles no dependa de los programadores. Un nivel debe poder crearse, validarse y cargarse sin tocar lógica del motor.

### Esquema recomendado

```json
{
  "id": "level-001",
  "name": "Primeros pasos",
  "size": { "width": 10, "height": 10 },
  "player": {
    "start": { "x": 0, "y": 0 },
    "facing": "right"
  },
  "goal": { "x": 9, "y": 9 },
  "tiles": [
    { "x": 3, "y": 2, "type": "wall" },
    { "x": 4, "y": 2, "type": "trap" },
    { "x": 6, "y": 4, "type": "collectible", "item": "star", "value": 100 },
    { "x": 7, "y": 5, "type": "door", "doorId": "A" },
    { "x": 1, "y": 7, "type": "key", "keyId": "A" }
  ],
  "rules": {
    "timeLimit": 60,
    "maxCommands": 12,
    "requireExactFinish": true
  },
  "allowedCommands": ["up", "down", "left", "right", "repeat", "enter"],
  "winConditions": [
    { "type": "reach-goal" }
  ],
  "loseConditions": [
    { "type": "out-of-bounds" },
    { "type": "hit-solid" },
    { "type": "touch-trap" },
    { "type": "timeout" }
  ],
  "hints": [
    "Usa bloques para agrupar movimientos.",
    "Piensa qué ocurre si repites dos veces."
  ],
  "rewards": {
    "stars": 3,
    "unlocks": ["level-002"]
  }
}
```

### Reglas del formato
- Un `levelValidator` debe validar estructura, límites y referencias.
- Los tipos de `tiles` deben resolverse vía `elementRegistry`.
- Los comandos habilitados deben resolverse vía `commandRegistry`.
- El diseñador no debe definir lógica; solo configuración.

## 5. Sistema de acciones y decisiones

### Estado actual
La secuencia funciona como una lista lineal con `repeat` y `enter` resueltos en una evaluación simple de bloques.

### Evolución objetivo
El juego necesita pasar de secuencia lineal a un pequeño lenguaje visual controlado.

### Fase intermedia
- Bloques visuales claros.
- Repetición de bloque actual.
- Vista previa de expansión lógica.
- Eliminación, reordenamiento y edición rápida.

### Fase avanzada
- Condicionales simples: si hay pared, si tengo llave, si hay objeto.
- Decisiones de ruta: bifurcaciones y elecciones con consecuencias.
- Acciones contextuales: recoger, abrir, activar, esperar.
- Macros o subrutinas simples para reutilizar secuencias.

### Mejoras concretas del editor de acciones
- Drag and drop de comandos.
- Separación visual por bloques.
- Numeración de pasos y bloques.
- Previsualización de trayectoria estimada antes de ejecutar.
- Indicador de comandos inválidos o sin efecto.
- Historial de deshacer/rehacer.
- Modo “explicar solución” para uso didáctico.
- Guardado y carga de secuencias por nivel.

## 6. Sprites, sonido y feedback

### Sprites
- Mantener emojis en prototipo, pero preparar un `render adapter` para cambiar a sprites sin romper el motor.
- Definir atlas básico: jugador, meta, pared, trampa, llave, puerta, estrella.
- Soportar skin por tema o mundo.

### Sonido
- Efectos mínimos: mover, choque, recoger, victoria, derrota, UI click.
- Música por menú y por nivel.
- Control global de volumen y mute.

### Feedback visual
- Animación de movimiento por tile.
- Destello de celda objetivo.
- Indicador de ejecución paso a paso.
- Overlay de error cuando una secuencia falla.

## 7. Roadmap por MVP

## MVP1 - Base modular jugable

### Objetivo
Salir de la arquitectura monolítica actual sin cambiar demasiado la experiencia.

### Alcance
- Separar motor, UI, contenido y persistencia.
- Mover niveles a JSON.
- Crear `commandRegistry` y `elementRegistry`.
- Mantener comandos actuales: mover, repeat, enter.
- Mantener ranking, tiempo y scoring.
- Soportar carga de varios niveles fijos desde índice JSON.

### Definición de terminado
- El juego funciona igual o mejor que hoy.
- `app.js` deja de ser el núcleo principal.
- Se pueden crear al menos 3 niveles sin tocar lógica.

## MVP2 - Editor de acciones robusto

### Objetivo
Volver usable y pedagógico el editor de secuencias.

### Alcance
- Drag and drop o reordenamiento claro.
- Bloques visibles y colapsables.
- Reintento consistente sin perder tiempo cuando corresponde.
- Previsualización de ruta.
- Validación visual de comandos inútiles.
- Deshacer/rehacer.

### Definición de terminado
- Un niño puede entender bloques y corregir errores sin ayuda técnica.
- El editor deja de depender de manipulación informal del DOM.

## MVP3 - Campaña de niveles y progresión real

### Objetivo
Pasar de sandbox a videojuego con campaña.

### Alcance
- 10 a 15 niveles diseñados manualmente en JSON.
- Curva de aprendizaje por mecánicas.
- Desbloqueo progresivo de comandos.
- Pantalla de selección de nivel.
- Persistencia de progreso.

### Definición de terminado
- Existe inicio, progresión y meta de campaña.
- La dificultad escala de forma intencional.

## MVP4 - Elementos interactivos y decisiones

### Objetivo
Introducir profundidad jugable y didáctica.

### Alcance
- Trampas, llaves, puertas, coleccionables.
- Condicionales básicos y acciones contextuales.
- Niveles con más de una solución.
- Decisiones con recompensa o penalización.

### Definición de terminado
- El jugador ya no solo ejecuta rutas: también decide estrategia.

## MVP5 - Capa audiovisual

### Objetivo
Elevar percepción de producto terminado.

### Alcance
- Sprites definitivos o semidefinitivos.
- SFX y música.
- Pantallas de inicio, pausa, victoria y derrota pulidas.
- Mejora estética integral.

### Definición de terminado
- El juego deja de sentirse prototipo técnico.

## MVP6 - Beta cerrada

### Objetivo
Validar con usuarios reales.

### Alcance
- Testing con niños y docentes.
- Ajuste de dificultad.
- Ajuste de tiempos, scoring y feedback.
- Corrección de bugs de UX.

### Definición de terminado
- El juego es comprensible, estable y divertido para el público objetivo.

## Versión final

### Objetivo
Publicar una versión completa y mantenible.

### Alcance
- Campaña final.
- Tutorial guiado.
- Audio/sprites finales.
- Guardado de progreso.
- Balance final.
- Documentación de mantenimiento y authoring de niveles.

## 8. División del trabajo para 3 programadores

## Programador A - Motor y reglas
- `core/gameEngine`
- `commandEvaluator`
- colisiones, scoring, progresión
- validación de reglas y estados

### Entregables
- API estable del motor
- tests lógicos del evaluador y colisiones
- contrato de eventos del motor

## Programador B - UI y editor
- vistas principales
- HUD
- modal
- editor de secuencias y bloques
- accesibilidad y feedback visual

### Entregables
- capa UI desacoplada
- editor usable
- integración con eventos del motor

## Programador C - Contenido y assets
- esquema JSON de niveles
- level loader y validator
- diseño de niveles
- sprites, sonido y balance inicial

### Entregables
- catálogo de niveles
- pipeline de assets
- documentación para crear niveles

## 9. Estrategia de ramas paralelas

### Rama base
- `main`: siempre estable.

### Ramas de trabajo por stream
- `feature/engine-core`
- `feature/ui-editor`
- `feature/content-levels`

### Integración por MVP
- cada programador integra contra una rama de release temporal, por ejemplo `release/mvp1`
- cuando `release/mvp1` queda estable y jugable, se fusiona a `main`
- luego se abren `feature/*` para `mvp2`

### Regla operativa
- no mezclar refactor + feature + assets en una sola PR
- contratos primero, implementación después
- si una feature rompe contrato, vuelve a draft

## 10. Secuencia sugerida de integración

### Sprint MVP1
- A define contrato del motor
- B adapta la UI al contrato
- C migra nivel actual a JSON y añade 2 niveles más

### Sprint MVP2
- B lidera editor nuevo
- A expone simulación de trayectoria para preview
- C define restricciones por nivel y tutoriales

### Sprint MVP3
- C lidera campaña
- A implementa progreso y persistencia
- B añade mapa o selector de niveles

### Sprint MVP4
- A implementa nuevos tipos de elemento y comandos condicionales
- B visualiza estados contextuales
- C diseña niveles con decisiones y múltiples rutas

### Sprint MVP5
- C lidera assets
- B integra presentación audiovisual
- A asegura compatibilidad del motor con nuevos efectos

## 11. Criterios de calidad por hito

- cada MVP debe ser jugable de inicio a fin
- cada PR debe incluir prueba manual reproducible
- cada cambio de nivel JSON debe pasar validación automática
- ningún módulo de UI debe contener reglas del juego
- ninguna regla del juego debe depender del DOM

## 12. Riesgos y mitigaciones

### Riesgo
El editor crece más rápido que el motor.

### Mitigación
Definir primero una representación interna estable de secuencia y bloques.

### Riesgo
Los niveles JSON se vuelven inconsistentes.

### Mitigación
Crear validador y ejemplos canónicos desde MVP1.

### Riesgo
Los tres programadores pisan los mismos archivos.

### Mitigación
Modularizar temprano y trabajar por contratos.

### Riesgo
Se agrega contenido sin curva didáctica.

### Mitigación
Diseñar una matriz de aprendizaje por nivel y por comando.

## 13. Prioridad ejecutiva inmediata

### Semana 1
- congelar features nuevas sobre `app.js`
- extraer motor mínimo
- definir formato JSON de nivel
- separar ranking/storage

### Semana 2
- cargar primer nivel desde JSON
- crear segundo y tercer nivel manual
- montar editor de bloques con estructura interna clara

### Semana 3
- cerrar MVP1 estable
- abrir desarrollo paralelo de MVP2

### Estructura para iniciar MVP1

```text
/
  index.html
  styles.css
  app.js (legacy, no tocar)
  data.js (legacy, no tocar)
  /src
    main.js
    /core
      gameState.js
      commandEvaluator.js
      collisionSystem.js
      scoringSystem.js
      progressionSystem.js
    /content
      /commands
        commandRegistry.js
      /elements
        elementRegistry.js
      /levels
        levelIndex.json
        level-001.json
        level-002.json
        level-003.json
        levelLoader.js
        levelValidator.js
        levelsFallback.js
    /ui
      domRefs.js
      commandPalette.js
      sequenceView.js
      gridView.js
      rankingView.js
    /services
      storageService.js
    /utils
      deepClone.js
      delay.js
  /Docs
    Roadmap.md
    Prompt.md
```

## 14. Recomendación final como project lead

No conviene seguir iterando el producto directamente sobre el prototipo actual. El siguiente paso correcto no es “añadir sprites” ni “sumar más comandos”, sino estabilizar la base con un motor modular y niveles en JSON. Si eso se resuelve primero, el resto del roadmap se vuelve ejecutable por tres personas en paralelo sin colisiones constantes.

## 15. Backlog técnico detallado por tareas

### Convenciones de backlog
- Prioridad: P0 (crítico), P1 (alto), P2 (medio), P3 (bajo).
- Estimación: XS (<= 0.5 día), S (1 día), M (2-3 días), L (4-5 días), XL (> 1 semana).
- Responsable sugerido: A (motor), B (UI/editor), C (contenido/assets).
- Dependencias: IDs de tareas que deben estar listas antes.

### MVP1 - Base modular jugable

#### Epic M1-E1: Modularización del runtime
- ID: M1-T01
  - Título: Crear estructura de carpetas src por dominios
  - Tipo: Refactor infra
  - Prioridad: P0
  - Estimación: S
  - Responsable: A
  - Dependencias: Ninguna
  - Criterio de aceptación: existe estructura mínima `src/core`, `src/ui`, `src/content`, `src/services`, `src/utils`.
- ID: M1-T02
  - Título: Extraer estado global a gameState
  - Tipo: Refactor
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T01
  - Criterio de aceptación: estado del juego encapsulado sin acceso directo desde vistas.
- ID: M1-T03
  - Título: Extraer loop de ejecución a gameEngine
  - Tipo: Refactor
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T02
  - Criterio de aceptación: la ejecución de secuencia no manipula DOM directamente.
- ID: M1-T04
  - Título: Implementar bus de eventos básico
  - Tipo: Infra
  - Prioridad: P1
  - Estimación: S
  - Responsable: A
  - Dependencias: M1-T01
  - Criterio de aceptación: UI responde a eventos emitidos por core (`tick`, `move`, `win`, `lose`, `timeout`).

#### Epic M1-E2: Comandos y evaluación desacoplada
- ID: M1-T05
  - Título: Migrar comandos a commandRegistry
  - Tipo: Feature técnica
  - Prioridad: P0
  - Estimación: S
  - Responsable: A
  - Dependencias: M1-T01
  - Criterio de aceptación: los comandos se registran por ID y metadata.
- ID: M1-T06
  - Título: Extraer lógica de repeat/enter a commandEvaluator
  - Tipo: Refactor
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T05
  - Criterio de aceptación: evaluator recibe secuencia y devuelve plan ejecutable independiente de UI.
- ID: M1-T07
  - Título: Pruebas unitarias de evaluator
  - Tipo: Calidad
  - Prioridad: P1
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T06
  - Criterio de aceptación: cubre bloques vacíos, repeats encadenados y `enter` final.

#### Epic M1-E3: Niveles en JSON
- ID: M1-T08
  - Título: Definir schema JSON v1 de nivel
  - Tipo: Contrato
  - Prioridad: P0
  - Estimación: S
  - Responsable: C
  - Dependencias: Ninguna
  - Criterio de aceptación: documento de esquema con campos obligatorios y opcionales.
- ID: M1-T09
  - Título: Implementar levelLoader con levelIndex
  - Tipo: Feature técnica
  - Prioridad: P0
  - Estimación: M
  - Responsable: C
  - Dependencias: M1-T08
  - Criterio de aceptación: carga nivel por ID desde índice JSON.
- ID: M1-T10
  - Título: Implementar levelValidator v1
  - Tipo: Calidad
  - Prioridad: P0
  - Estimación: M
  - Responsable: C
  - Dependencias: M1-T08
  - Criterio de aceptación: valida límites, coordenadas y comandos permitidos.
- ID: M1-T11
  - Título: Migrar nivel actual a level-001.json
  - Tipo: Migración contenido
  - Prioridad: P0
  - Estimación: S
  - Responsable: C
  - Dependencias: M1-T09, M1-T10
  - Criterio de aceptación: nivel 1 se ejecuta igual que en prototipo.
- ID: M1-T12
  - Título: Crear level-002 y level-003 de prueba
  - Tipo: Contenido
  - Prioridad: P1
  - Estimación: M
  - Responsable: C
  - Dependencias: M1-T11
  - Criterio de aceptación: tres niveles jugables sin tocar lógica.

#### Epic M1-E4: Adaptación UI al nuevo core
- ID: M1-T13
  - Título: Crear uiController desacoplado
  - Tipo: Refactor
  - Prioridad: P0
  - Estimación: M
  - Responsable: B
  - Dependencias: M1-T03, M1-T04
  - Criterio de aceptación: UI suscribe eventos del motor y despacha acciones.
- ID: M1-T14
  - Título: Separar gridView, hudView, modalView
  - Tipo: Refactor
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M1-T13
  - Criterio de aceptación: cada vista tiene responsabilidades aisladas.
- ID: M1-T15
  - Título: Mantener ranking y storage en storageService
  - Tipo: Refactor
  - Prioridad: P1
  - Estimación: S
  - Responsable: B
  - Dependencias: M1-T13
  - Criterio de aceptación: acceso a localStorage centralizado.

#### Epic M1-E5: Integración y hardening
- ID: M1-T16
  - Título: Prueba de regresión funcional nivel 1
  - Tipo: QA
  - Prioridad: P0
  - Estimación: S
  - Responsable: B
  - Dependencias: M1-T14, M1-T15
  - Criterio de aceptación: flujo completo gana/pierde/ranking/retry funcional.
- ID: M1-T17
  - Título: Checklist técnico de salida MVP1
  - Tipo: QA
  - Prioridad: P0
  - Estimación: XS
  - Responsable: A
  - Dependencias: M1-T07, M1-T12, M1-T16
  - Criterio de aceptación: cumplimiento de criterios del MVP1 firmado por los 3.

### MVP2 - Editor de acciones robusto

#### Epic M2-E1: Modelo interno del editor
- ID: M2-T01
  - Título: Definir AST simple de secuencia y bloques
  - Tipo: Contrato
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T06
  - Criterio de aceptación: representación estable con serializer/deserializer.
- ID: M2-T02
  - Título: Integrar evaluator con AST
  - Tipo: Feature técnica
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M2-T01
  - Criterio de aceptación: executionPlan deriva del AST, no del DOM.

#### Epic M2-E2: UX del editor
- ID: M2-T03
  - Título: Implementar commandPalette modular
  - Tipo: UI
  - Prioridad: P1
  - Estimación: S
  - Responsable: B
  - Dependencias: M2-T01
  - Criterio de aceptación: paleta renderizada por comandos habilitados del nivel.
- ID: M2-T04
  - Título: Implementar blockEditor con bloques colapsables
  - Tipo: UI
  - Prioridad: P0
  - Estimación: L
  - Responsable: B
  - Dependencias: M2-T01
  - Criterio de aceptación: edición visual por bloque y reordenamiento funcional.
- ID: M2-T05
  - Título: Soporte drag and drop de comandos
  - Tipo: UI
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M2-T04
  - Criterio de aceptación: usuario puede mover comandos dentro y entre bloques.
- ID: M2-T06
  - Título: Implementar undo/redo en editor
  - Tipo: Feature
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M2-T04
  - Criterio de aceptación: historial estable con límite configurable.

#### Epic M2-E3: Ayudas didácticas
- ID: M2-T07
  - Título: Previsualización de trayectoria (simulación)
  - Tipo: Feature
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M2-T02
  - Criterio de aceptación: muestra ruta prevista sin ejecutar partida.
- ID: M2-T08
  - Título: Resaltado de comandos sin efecto
  - Tipo: Feature
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M2-T07
  - Criterio de aceptación: marca visual para comandos redundantes o inválidos.
- ID: M2-T09
  - Título: Modo explicar solución
  - Tipo: Feature didáctica
  - Prioridad: P2
  - Estimación: M
  - Responsable: C
  - Dependencias: M2-T07
  - Criterio de aceptación: explicación paso a paso en lenguaje simple.

### MVP3 - Campaña y progresión

#### Epic M3-E1: Progreso y desbloqueos
- ID: M3-T01
  - Título: Implementar progressionSystem persistente
  - Tipo: Feature
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T15
  - Criterio de aceptación: guarda nivel desbloqueado, estrellas y mejor score.
- ID: M3-T02
  - Título: Definir matriz de aprendizaje por nivel
  - Tipo: Diseño técnico
  - Prioridad: P0
  - Estimación: S
  - Responsable: C
  - Dependencias: M1-T12
  - Criterio de aceptación: cada nivel tiene objetivo didáctico explícito.

#### Epic M3-E2: Contenido de campaña
- ID: M3-T03
  - Título: Diseñar 10 a 15 niveles JSON
  - Tipo: Contenido
  - Prioridad: P0
  - Estimación: XL
  - Responsable: C
  - Dependencias: M3-T02
  - Criterio de aceptación: niveles validados y ordenados por dificultad.
- ID: M3-T04
  - Título: Pantalla selector de niveles
  - Tipo: UI
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M3-T01
  - Criterio de aceptación: muestra bloqueo/desbloqueo y mejor score por nivel.
- ID: M3-T05
  - Título: Restricciones por nivel de comandos permitidos
  - Tipo: Feature
  - Prioridad: P1
  - Estimación: S
  - Responsable: A
  - Dependencias: M1-T05, M3-T03
  - Criterio de aceptación: paleta de comandos se adapta al nivel.

### MVP4 - Decisiones y elementos interactivos

#### Epic M4-E1: Nuevos elementos de tablero
- ID: M4-T01
  - Título: Implementar elementRegistry v2
  - Tipo: Feature técnica
  - Prioridad: P0
  - Estimación: M
  - Responsable: A
  - Dependencias: M1-T05
  - Criterio de aceptación: soporte wall, trap, key, door, collectible.
- ID: M4-T02
  - Título: Lógica de inventario de jugador
  - Tipo: Feature
  - Prioridad: P1
  - Estimación: M
  - Responsable: A
  - Dependencias: M4-T01
  - Criterio de aceptación: llaves y objetos persistidos durante nivel.
- ID: M4-T03
  - Título: Render y feedback de elementos interactivos
  - Tipo: UI
  - Prioridad: P1
  - Estimación: M
  - Responsable: B
  - Dependencias: M4-T01
  - Criterio de aceptación: estado visual consistente de puertas, llaves y coleccionables.

#### Epic M4-E2: Decisiones en acciones
- ID: M4-T04
  - Título: Añadir comandos condicionales básicos
  - Tipo: Feature
  - Prioridad: P0
  - Estimación: L
  - Responsable: A
  - Dependencias: M2-T01
  - Criterio de aceptación: evalúa al menos dos condiciones (`si pared`, `si llave`).
- ID: M4-T05
  - Título: Editor visual de condicionales
  - Tipo: UI
  - Prioridad: P1
  - Estimación: L
  - Responsable: B
  - Dependencias: M4-T04
  - Criterio de aceptación: usuario crea y edita bloques condicionales visualmente.
- ID: M4-T06
  - Título: Diseñar niveles con múltiples rutas válidas
  - Tipo: Contenido
  - Prioridad: P1
  - Estimación: M
  - Responsable: C
  - Dependencias: M4-T01, M4-T04
  - Criterio de aceptación: al menos 5 niveles con decisiones reales de estrategia.

### MVP5 - Capa audiovisual

#### Epic M5-E1: Pipeline de sprites
- ID: M5-T01
  - Título: Definir atlas y naming convention de sprites
  - Tipo: Assets/infra
  - Prioridad: P1
  - Estimación: S
  - Responsable: C
  - Dependencias: Ninguna
  - Criterio de aceptación: documento de assets y estructura de carpetas estable.
- ID: M5-T02
  - Título: Implementar render adapter emoji/sprite
  - Tipo: Feature técnica
  - Prioridad: P0
  - Estimación: M
  - Responsable: B
  - Dependencias: M5-T01
  - Criterio de aceptación: switch configurable sin tocar core.

#### Epic M5-E2: Audio
- ID: M5-T03
  - Título: Implementar audioManager con mapa de eventos
  - Tipo: Feature
  - Prioridad: P1
  - Estimación: M
  - Responsable: C
  - Dependencias: M1-T04
  - Criterio de aceptación: reproducir SFX por evento de juego.
- ID: M5-T04
  - Título: Control de volumen y mute global
  - Tipo: Feature UI
  - Prioridad: P2
  - Estimación: S
  - Responsable: B
  - Dependencias: M5-T03
  - Criterio de aceptación: configuración persistida por usuario.

### MVP6 - Beta cerrada y hardening

#### Epic M6-E1: Validación con usuarios
- ID: M6-T01
  - Título: Protocolo de prueba con niños y docentes
  - Tipo: QA producto
  - Prioridad: P0
  - Estimación: M
  - Responsable: C
  - Dependencias: M3-T03
  - Criterio de aceptación: guion de test y métricas de comprensión.
- ID: M6-T02
  - Título: Instrumentación básica de métricas locales
  - Tipo: Feature técnica
  - Prioridad: P2
  - Estimación: M
  - Responsable: A
  - Dependencias: M6-T01
  - Criterio de aceptación: captura intentos, tiempo y tasa de éxito por nivel.

#### Epic M6-E2: Corrección de UX y bugs
- ID: M6-T03
  - Título: Barrido de bugs críticos P0/P1
  - Tipo: QA
  - Prioridad: P0
  - Estimación: L
  - Responsable: A+B+C
  - Dependencias: M6-T01
  - Criterio de aceptación: cero bugs bloqueantes abiertos para release.
- ID: M6-T04
  - Título: Ajuste final de dificultad y scoring
  - Tipo: Balance
  - Prioridad: P1
  - Estimación: M
  - Responsable: C
  - Dependencias: M6-T02
  - Criterio de aceptación: curva de dificultad validada con usuarios.

### Backlog transversal (siempre activo)
- ID: BX-T01
  - Título: Definir plantilla de PR y Definition of Done
  - Prioridad: P0
  - Estimación: XS
  - Responsable: A
- ID: BX-T02
  - Título: Convención de ramas y naming de commits
  - Prioridad: P0
  - Estimación: XS
  - Responsable: A
- ID: BX-T03
  - Título: Checklist de revisión para no mezclar lógica en UI
  - Prioridad: P1
  - Estimación: XS
  - Responsable: B
- ID: BX-T04
  - Título: Guía de authoring de niveles JSON
  - Prioridad: P1
  - Estimación: S
  - Responsable: C

### Primer corte recomendado (2 semanas)
- Sprint Goal: cerrar base de MVP1 en estado integrable.
- Compromiso mínimo:
  - A: M1-T01, M1-T02, M1-T03, M1-T05, M1-T06.
  - B: M1-T13, M1-T14, M1-T15.
  - C: M1-T08, M1-T09, M1-T10, M1-T11.
- Stretch Goal:
  - C: M1-T12.
  - A: M1-T07.
  - B: M1-T16.

### Mapeo sugerido a GitHub Issues
- Etiquetas por dominio: `core`, `ui`, `editor`, `content`, `audio`, `qa`.
- Etiquetas por prioridad: `P0`, `P1`, `P2`, `P3`.
- Milestones: `MVP1` a `MVP6`.
- Asignación inicial:
  - Programador A: tareas `core`.
  - Programador B: tareas `ui` y `editor`.
  - Programador C: tareas `content`, `audio` y balance.