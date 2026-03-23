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
Permitir que diseño de niveles no dependa del programador. Un nivel debe poder crearse, validarse y cargarse sin tocar lógica del motor.

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

## 14. Recomendación final como project lead

No conviene seguir iterando el producto directamente sobre el prototipo actual. El siguiente paso correcto no es “añadir sprites” ni “sumar más comandos”, sino estabilizar la base con un motor modular y niveles en JSON. Si eso se resuelve primero, el resto del roadmap se vuelve ejecutable por tres personas en paralelo sin colisiones constantes.