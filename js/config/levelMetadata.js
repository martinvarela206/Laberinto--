/**
 * Level Metadata Configuration
 * Centralized repository for level ordering/progression
 * 
 * NOTE:
 * Tutorial content, allowed commands and scripted sequences now live
 * inside each level file (single source of truth per level).
 */

export const LEVEL_METADATA = {
    'level-001': {
        id: 'level-001',
        name: 'Primeros pasos',
        order: 1
    },
    'level-002': {
        id: 'level-002',
        name: 'Tutorial: Giro simple',
        order: 2
    },
    'level-003': {
        id: 'level-003',
        name: 'Tutorial: Subir',
        order: 3
    },
    'level-004': {
        id: 'level-004',
        name: 'Tutorial: Izquierda',
        order: 4
    },
    'level-005': {
        id: 'level-005',
        name: 'Tutorial: Repetir bloques',
        order: 5
    },
    'level-006': {
        id: 'level-006',
        name: 'Tutorial: Enter y bloques',
        order: 6
    },
    'level-007': {
        id: 'level-007',
        name: 'Aventura libre',
        order: 7
    },
    'level-008': {
        id: 'level-008',
        name: 'Tutorial: Borrar comandos',
        order: 8
    }
};

/**
 * Get all level IDs in order
 */
export function getAllLevelIds() {
    return Object.values(LEVEL_METADATA)
        .sort((a, b) => a.order - b.order)
        .map(meta => meta.id);
}

export function getAllLevelMetadata() {
    return Object.values(LEVEL_METADATA)
        .sort((a, b) => a.order - b.order);
}
