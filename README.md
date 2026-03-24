# Laberinto--

## Español
Juego didactico de laberinto para introducir conceptos de programacion mediante comandos secuenciales.

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

### Estructura principal
- `index.html`: entrada de la aplicacion web.
- `styles.css`: estilos de interfaz.
- `src/`: arquitectura modular (core, content, ui, services, utils).
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

### Main structure
- `index.html`: web app entrypoint.
- `styles.css`: UI styles.
- `src/`: modular architecture (core, content, ui, services, utils).
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
