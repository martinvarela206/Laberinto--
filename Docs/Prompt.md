# LABERINTO++ - Especificación General del Proyecto

## 1. Objetivo y Concepto

**Laberinto++** es un juego educativo para enseñar conceptos de programación (entrada secuencial, bucles, bloques) mediante comandos de movimiento en un laberinto interactivo.

- **Público objetivo**: Niños de 8-12 años
- **Stack**: HTML, CSS, JavaScript (vanilla, sin frameworks)
- **Arquitectura**: Modular ES6 con separación de concerns (core, UI, services, content)

## 2. Mecánica de Juego

### 2.1 Comandos Base
- `⬆️ Arriba` (up): Mueve robot una celda arriba
- `⬇️ Abajo` (down): Mueve robot una celda abajo
- `⬅️ Izquierda` (left): Mueve robot una celda izquierda
- `➡️ Derecha` (right): Mueve robot una celda derecha
- `🔁 Repetir` (repeat): Duplica la secuencia actual del bloque (postfijo)
- `↵ Enter` (enter): Finaliza bloque actual e inicia uno nuevo

### 2.2 Evaluación Postfija
La secuencia se evalúa en notación postfija (RPN):
- Los `repeat` duplican solo los comandos del bloque actual
- Los `enter` separan bloques (repeat no trasciende bloques)
- Ejemplo: `right down repeat enter repeat` 
  - Bloque 1: `right down` → repite → `right down right down`
  - Bloque 2: (vacío) → repeat no tiene efecto

### 2.3 Sistema de Colisiones y Derrota
- **Fuera de bordes**: Si el robot sale del grid → derrota inmediata
- **Pared**: Si el robot choca con un obstáculo → derrota inmediata
- **Meta exacta**: La secuencia debe alcanzar exactamente la meta. Si hay comandos restantes, se ejecutan y pueden causar derrota

### 2.4 Sistema de Puntuación
- **Base**: 1000 puntos
- **Penalización por comandos**: -50 por cada comando usado
- **Bonificación por tiempo**: +10 por cada segundo restante
- **Fórmula**: `max(10, 1000 - comandosUsados*50 + tiempoRestante*10)`
- **Límite de tiempo**: 60 segundos por nivel (personalizable en JSON)

### 2.5 Reintentos
- Si falla (no alcanza meta, no pierde por colisión), puede reintentar sin resetear:
  - ✅ La secuencia de comandos se mantiene
  - ✅ El tiempo sigue corriendo
  - ✅ El robot vuelve a posición inicial
  - ❌ La secuencia NO se borra

## 3. Estructura de Niveles

### 3.1 Tipos de Niveles
- **Tutoriales (level-001 a level-005)**: Cinemática introductoria, un comando por nivel, sin ranking
- **Puntaje (level-006+)**: Competitivos, con ranking por nivel, guardado en localStorage

### 3.2 Niveles Actuales
1. **level-001** (Primeros pasos): Solo `right`, grid 5x1
2. **level-002**: `right` + `down`, grid 6x2
3. **level-003**: `right` + `up`, grid 6x3 (iniciando abajo)
4. **level-004**: `left` + `down`, grid 7x3 (iniciando derecha)
5. **level-005**: `right` + `down` + `repeat` + `enter`, grid 7x3, una pared
6. **level-006**: Modo puntaje, grid 10x10, 3 paredes
7. **level-007**: Modo puntaje, grid 10x10, 4 paredes en zig-zag

### 3.3 Formato JSON de Nivel
```json
{
  "id": "level-001",
  "name": "Primeros pasos",
  "isTutorial": true,
  "tutorialIntro": {
    "title": "Tutorial 1: Mover a la derecha",
    "command": "right",
    "description": "...",
    "objective": "..."
  },
  "size": { "width": 5, "height": 1 },
  "player": { "start": { "x": 0, "y": 0 } },
  "goal": { "x": 4, "y": 0 },
  "tiles": [],
  "rules": { "timeLimit": 60, "requireExactFinish": true },
  "allowedCommands": ["right"]
}
```

## 4. Sistema de Interfaz

### 4.1 Componentes Principales
- **Panel izquierdo**: Banco de comandos, secuencia del usuario, botones (Ejecutar, Reiniciar, Deshacer)
- **Panel derecho**: Grid 10x10 con borde rojo (grosor = tamaño celda)
- **Header**: Título, nivel actual, contador de comandos, contador de tiempo
- **Modales**: Intro/Lore, Tutorial, Resultado (victoria/derrota), Ranking

### 4.2 Interacciones
- **Clic en comando**: Añade a secuencia (si no está ejecutando)
- **Clic en comando de secuencia**: Elimina ese comando
- **Botón Deshacer**: Quita último comando
- **Botón Ejecutar**: Inicia ejecución (delay 300ms entre comandos)
- **Botón Reiniciar**: Reinicia nivel (borra secuencia, posición inicial, reset tiempo)

### 4.3 Highlighting en Ejecución
Durante la ejecución, el comando actual se resalta con:
- Color azul (#3b82f6)
- Glow effect
- Scale 1.1
- Clase CSS: `.executing`

Si `repeat` duplica un comando, se resaltan tanto el original como su copia expandida.

## 5. Sistema de Persistencia

### 5.1 localStorage
- **Clave de prefijo**: `laberinto*` (para aislamiento de datos)
- **Ranking por nivel**: `laberintoRanking` (level-001) o `laberintoRanking_nivel_N`
- **Lore visto**: `laberintoLoreSeen` (boolean)
- **Progreso**: `laberintoGameProgress` { lastCompletedLevelId }

### 5.2 Ranking
- **Capacidad**: Top 10 por nivel
- **Campos**: name, score, date (ISO 8601)
- **Ordenamiento**: Descendente por puntuación
- **Vencer top 1**: Desbloquea botón "Subir de Nivel"

### 5.3 Progreso de Campaña
- Al completar un nivel, se guarda `lastCompletedLevelId`
- "Continuar" carga el siguiente nivel no completado
- "Volver a iniciar" borra todos los datos (`laberinto*`) y reinicia desde level-001

## 6. Sistema de Lore/Intro

### 6.1 Introducción Cinemática (3 pasos)
Se muestra una sola vez al abrir el juego (verificado con `laberintoLoreSeen`):

1. **Instituto de Informática**: Presentación del proyecto
2. **Un robot que aprende**: Concepto de instrucciones precisas
3. **Tú eres el programador**: Tu rol y opciones (Iniciar, Continuar, Volver a iniciar)

### 6.2 Componentes Lore
- Robot emoji: 🤖 (con borde gradiente azul, glow)
- Tres puntos de progreso (). animados
- Botones contextuales (Siguiente, Iniciar, Continuar, Volver a iniciar)
- Aparece antes que cualquier tutorial

## 7. Sistema de Tutorial

### 7.1 Tutorial por Nivel
Cada nivel tutorial (isTutorial: true) muestra una pantalla con:
- Título
- Comando principal (con icono)
- Descripción del comando
- Objetivo del nivel
- Botón "Entendido"

### 7.2 Flujo
1. Lore (primera vez)
2. Tutorial del nivel
3. Juego ejecutable
4. Al ganar: mensaje especial (sin pedir nombre, sin ranking)
5. Capas de tutoriales completos → "Siguiente Nivel" activado

## 8. Arquitectura del Código

### 8.1 Estructura Modular
```
src/
├── core/
│   ├── gameState.js       (STATE, setLevel, resetRound)
│   ├── commandEvaluator.js (evaluateSequence, evaluateSequenceWithOrigin)
│   ├── collisionSystem.js  (checkCollisions)
│   ├── scoringSystem.js    (calculateScore)
│   └── progressionSystem.js (addBlockingObstacle)
├── content/
│   ├── commands/commandRegistry.js (COMMANDS array)
│   ├── elements/elementRegistry.js (ELEMENTS: wall, trap, goal)
│   └── levels/
│       ├── levelLoader.js (loadLevelById, loadLevelIndex)
│       ├── levelValidator.js (validateLevel)
│       ├── levelsFallback.js (datos offline)
│       ├── levelIndex.json (catálogo de niveles)
│       └── level-*.json (niveles individuales)
├── services/
│   └── storageService.js (getJson, setJson, loadRanking, saveRanking, etc.)
├── ui/
│   ├── domRefs.js (centralized DOM element refs)
│   ├── commandPalette.js (renderCommandPalette)
│   ├── sequenceView.js (renderSequence)
│   ├── gridView.js (renderGrid, updatePlayerPosition, trail rendering)
│   └── rankingView.js (renderRanking)
└── utils/
    ├── delay.js (Promise-based delay)
    └── deepClone.js (JSON-safe clone)

main.js (orquestación principal: init, event binding, game loop)
```

### 8.2 Flujo de Ejecución (startRun)
1. Evalúa secuencia con `evaluateSequenceWithOrigin()` (obtiene comandos + índices origen)
2. Por cada comando en plan:
   - Delay 300ms
   - Highlightea comando actual
   - Ejecuta acción (mueve robot)
   - Verifica colisiones
   - Si derrota → animación 1500ms + gameOver(false)
   - Si meta alcanzada → continúa (para que siga ejecutando)
3. Después de terminar secuencia:
   - Delay adicional 400ms (para ver último comando resaltado)
   - Verifica si está en meta
   - gameOver(true/false)

### 8.3 Manejo de Estado
- `state` global (centralizado en main.js)
- `resetRoundState()` → reinicia posición, timer, secuencia, pero mantiene nivel
- `setLevel()` → cambia nivel completo
- Modales bloqueadores: `isIntroOverlayVisible()` previene ejecución

## 9. Próximas Expansiones Planeadas

### 9.1 Obstáculos Ampliados
- **Trampa (🔥)**: Derrota instantánea (aún no implementada)
- **Ítems recolectables**: ⭐ estrellas, 🔑 llaves (aún no implementados)
- **Puertas**: Requieren llave para atravesar

### 9.2 Dinámicas de Progresión
- Incremento de dificultad por nivel
- Obstacles aleatorios en modo sandbox
- Desafíos de optimización (máximo X comandos)

### 9.3 Mejoras de UX
- Sistema de logros/insignias
- Historial de mejores intentos
- Modo editor de niveles
- Compartir soluciones

## 10. Notas Técnicas

- **Responsividad**: Grid adapta tamaño con `--cell-size: min(5vw, 40px)`
- **Accesibilidad**: ARIA labels en overlay de progreso
- **Fallbacks**: levelsFallback.js si archivos JSON no cargan
- **Trail visual**: Rayado del recorrido con pseudoelementos y transiciones CSS
- **Post-procesamiento**: Al ganar nivel tutorial, lógica diferente (no pedir nombre, mostrar mensaje especial)