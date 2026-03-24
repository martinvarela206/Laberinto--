# Prompt formulario rapido (30 segundos)

Copia este bloque, rellena los campos y pegalo en otro chat de IA.

```text
Actua como desarrollador senior JavaScript sobre un juego web de laberinto didactico modular (carpetas: core, content, ui, services, utils).

CAMBIO SOLICITADO:
- Tipo: [bugfix | feature | refactor]
- Objetivo: [que quieres lograr]
- Alcance: [modulos/archivos si los conoces]

REGLAS FUNCIONALES:
1. [regla 1]
2. [regla 2]
3. [regla 3]

RESTRICCIONES TECNICAS:
1. No mezclar logica de juego con UI.
2. Mantener niveles declarativos en JSON.
3. No romper timer, score, ranking, retry y ejecucion de secuencia.
4. Hacer cambios minimos y compatibles con el codigo actual.

ENTREGA OBLIGATORIA:
1. Diagnostico corto del impacto.
2. Cambios por archivo y por que.
3. Codigo final listo para aplicar.
4. Checklist de validacion manual.
5. Riesgos de regresion y mitigacion.

SI HAY AMBIGUEDAD:
- Lista supuestos y propone decision recomendada antes de implementar.
```

## Version con ejemplo rellenado

```text
Actua como desarrollador senior JavaScript sobre un juego web de laberinto didactico modular (carpetas: core, content, ui, services, utils).

CAMBIO SOLICITADO:
- Tipo: feature
- Objetivo: agregar comando saltar
- Alcance: commandRegistry, commandEvaluator, sequenceView, validacion de niveles

REGLAS FUNCIONALES:
1. Saltar avanza 2 celdas en la direccion indicada.
2. Si aterriza fuera del tablero, derrota inmediata.
3. Si aterriza en pared, derrota inmediata.

RESTRICCIONES TECNICAS:
1. No mezclar logica de juego con UI.
2. Mantener niveles declarativos en JSON.
3. No romper timer, score, ranking, retry y ejecucion de secuencia.
4. Hacer cambios minimos y compatibles con el codigo actual.

ENTREGA OBLIGATORIA:
1. Diagnostico corto del impacto.
2. Cambios por archivo y por que.
3. Codigo final listo para aplicar.
4. Checklist de validacion manual.
5. Riesgos de regresion y mitigacion.

SI HAY AMBIGUEDAD:
- Lista supuestos y propone decision recomendada antes de implementar.
```
