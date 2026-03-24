# Laberinto--

## Español
Juego didactico de laberinto para introducir conceptos de programacion mediante comandos secuenciales.

### Estado actual del juego
- Campana por niveles JSON.
- Tutoriales guiados (niveles `001` a `005`) con pantalla explicativa por comando.
- Transicion automatica a modo puntaje al finalizar tutoriales.
- Niveles de puntaje desde `level-006` en adelante (ranking y guardado de score).
- Rastro visual del recorrido durante la ejecucion.

### Requisitos
- Navegador moderno.
- Un servidor HTTP local (incluido en este repositorio con scripts para Windows y Linux/macOS).

### Ejecutar en local
Este proyecto incluye dos scripts para iniciar un servidor local desde la raiz del repositorio:

1. Windows (PowerShell):
```powershell
.\server.ps1
```
Puerto por defecto: `8000`

Con puerto personalizado:
```powershell
.\server.ps1 -Port 8080
```

2. Linux/macOS (Bash):
```bash
chmod +x server.sh
./server.sh
```
Puerto por defecto: `8000`

Con puerto personalizado:
```bash
./server.sh 8080
```

Luego abre en el navegador:
- http://localhost:8000
- o el puerto que hayas elegido.

### Flujo de niveles
1. Tutoriales:
	- `level-001`: comando derecha.
	- `level-002`: comando abajo.
	- `level-003`: comando arriba.
	- `level-004`: comando izquierda.
	- `level-005`: bloques `repeat` y `enter`.
2. Al completar el ultimo tutorial, aparece un mensaje de fin de tutoriales y comienza el modo puntaje.
3. Puntaje/ranking:
	- activo desde `level-006`.
	- pide nombre al ganar.
	- guarda top 10 por nivel en `localStorage`.

### Comportamiento en tutoriales
- Se muestra una pantalla de introduccion del comando a aprender.
- La pantalla usa iconos de comandos (por ejemplo `➡️`, `⬇️`, `⬆️`, `⬅️`, `🔁 + ↵`).
- Mientras la pantalla tutorial esta abierta, no se puede ejecutar ni editar secuencia.
- Al ganar un tutorial, no se solicita nombre ni se muestra ranking.

### Estructura principal
- `index.html`: entrada de la aplicacion web.
- `styles.css`: estilos de interfaz.
- `src/`: arquitectura modular (core, content, ui, services, utils).
- `src/content/levels/`: niveles JSON (`level-001` ...), indice (`levelIndex.json`) y fallback (`levelsFallback.js`).
- `Docs/`: roadmap, prompts y documentacion de apoyo.
- `server.ps1`: servidor local para Windows.
- `server.sh`: servidor local para Linux/macOS.

### Licencia
Este proyecto se distribuye bajo licencia MIT.

Titular de derechos:
Instituto de Informatica de la Facultad de Ciencias Exactas, Fisicas y Naturales de la Universidad Nacional de San Juan.

Archivos de licencia:
- Ingles: `LICENSE`
- Castellano: `LICENCIA.md`

---

## English
Educational maze game to introduce programming concepts through sequential commands.

### Current game status
- JSON-driven level campaign.
- Guided tutorials (`level-001` to `level-005`) with command intro screens.
- Automatic transition to score mode when tutorials are completed.
- Score/ranking levels from `level-006` onward.
- Visual path trail shown during execution.

### Requirements
- Modern web browser.
- Local HTTP server (included in this repository with scripts for Windows and Linux/macOS).

### Run locally
This repository includes two scripts to start a local server from the project root:

1. Windows (PowerShell):
```powershell
.\server.ps1
```
Default port: `8000`

Custom port:
```powershell
.\server.ps1 -Port 8080
```

2. Linux/macOS (Bash):
```bash
chmod +x server.sh
./server.sh
```
Default port: `8000`

Custom port:
```bash
./server.sh 8080
```

Then open in your browser:
- http://localhost:8000
- or the selected port.

### Level flow
1. Tutorials:
	- `level-001`: move right.
	- `level-002`: move down.
	- `level-003`: move up.
	- `level-004`: move left.
	- `level-005`: `repeat` and `enter` blocks.
2. After the last tutorial, the game shows a tutorials-completed message and switches to score mode.
3. Score/ranking:
	- enabled from `level-006`.
	- asks for player name on win.
	- stores per-level top 10 in `localStorage`.

### Tutorial behavior
- A tutorial intro screen explains the command taught in that level.
- The tutorial screen displays command icons (for example `➡️`, `⬇️`, `⬆️`, `⬅️`, `🔁 + ↵`).
- While the tutorial overlay is open, sequence editing and execution are blocked.
- Tutorial wins do not request player name and do not display ranking.

### Main structure
- `index.html`: web app entrypoint.
- `styles.css`: UI styles.
- `src/`: modular architecture (core, content, ui, services, utils).
- `src/content/levels/`: JSON levels (`level-001` ...), index (`levelIndex.json`), and fallback (`levelsFallback.js`).
- `Docs/`: roadmap, prompts, and support docs.
- `server.ps1`: local server script for Windows.
- `server.sh`: local server script for Linux/macOS.

### License
This project is distributed under the MIT License.

Copyright holder:
Institute of Informatics, School of Exact, Physical and Natural Sciences, National University of San Juan.

License files:
- English: `LICENSE`
- Spanish: `LICENCIA.md`
