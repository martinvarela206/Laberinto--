const ELEMENTS = [
    { id: 'wall', type: 'solid', icon: '🧱' },
    { id: 'trap', type: 'trap', icon: '🔥' },
    { id: 'goal', type: 'goal', icon: '🏁' }
];

const elementMap = new Map(ELEMENTS.map((element) => [element.id, element]));

export function getElements() {
    return ELEMENTS;
}

export function getElementById(id) {
    return elementMap.get(id) || null;
}
