/**
 * Lore Configuration
 * Central repository for narrative content
 * 
 * Separating data from logic allows multiple team members
 * to edit narrative content without merge conflicts
 */

export const LORE_STEPS = [
    {
        kicker: 'Instituto de Informática',
        title: 'Bienvenido a Laberinto++',
        description: 'Este es un juego didáctico desarrollado por el Instituto de Informática de la Facultad de Ciencias Exactas, Físicas y Naturales de la Universidad Nacional de San Juan.',
        story: 'Aquí comienza la misión de un pequeño robot que todavía no entiende cómo moverse por el laberinto.',
        objective: 'Cada comando que programes será una nueva lección para enseñarle a avanzar.'
    },
    {
        kicker: 'Proyecto de aprendizaje',
        title: 'Un robot que debe aprender',
        description: 'El robot no improvisa: necesita instrucciones claras, ordenadas y precisas para no chocar, no perderse y llegar a la meta.',
        story: 'Primero aprenderá movimientos simples, luego patrones más complejos y estrategias para resolver recorridos más difíciles.',
        objective: 'Tu trabajo será pensar como programador y construir secuencias que el robot pueda ejecutar con éxito.'
    },
    {
        kicker: 'Tu misión',
        title: 'Tú debes programarlo',
        description: 'Te hemos contratado para entrenar al robot paso a paso. Si programas bien, avanzará. Si te equivocas, aprenderás del error y volverás a intentarlo.',
        story: 'Cuando superes niveles, el robot recordará hasta dónde llegó y podrás continuar desde ese progreso.',
        objective: 'Elige Iniciar para comenzar desde el principio o Continuar para retomar desde el próximo nivel disponible.'
    }
];

export const LORE_CONFIG = {
    totalSteps: LORE_STEPS.length,
    showOnFirstVisit: true,
    storageKey: 'lore_seen'
};
