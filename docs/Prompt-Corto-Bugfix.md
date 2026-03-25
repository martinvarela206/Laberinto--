# Prompt corto para bugfix o cambio puntual

Actua como desarrollador senior JavaScript y realiza cambios directamente sobre mi juego web de laberinto didactico.

## Contexto del proyecto
1. Proyecto sin framework (HTML, CSS, JS modular).
2. Arquitectura actual en /src: core, content, ui, services, utils.
3. Comandos con secuencias (incluye repeat y enter), niveles en JSON, ranking en localStorage.

## Solicitud
[Describe en 1 a 3 lineas el cambio exacto]

## Restricciones obligatorias
1. No mezclar logica de juego con UI.
2. Mantener niveles declarativos en JSON.
3. No romper timer, score, ranking, retry y ejecucion de secuencia.
4. Hacer cambios minimos y consistentes con el estilo actual del proyecto.
5. Si hay ambiguedad funcional, explicarla primero y proponer decision concreta.

## Entregables esperados
1. Resumen de solucion.
2. Archivos modificados y motivo.
3. Codigo final.
4. Checklist de validacion manual.
5. Riesgos de regresion.

## Formato de salida
1. Diagnostico corto del impacto.
2. Implementacion propuesta.
3. Patch o bloques completos por archivo.
4. Checklist de validacion.
5. Siguientes pasos opcionales.

## Ejemplo de solicitud
Agregar comando "saltar" que avance 2 celdas y pierda si aterriza fuera o en pared. Actualizar paleta de comandos, evaluator y validacion de nivel. Incluir pruebas manuales.
