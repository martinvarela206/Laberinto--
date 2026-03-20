/**
 * main.js - Bootstrap del juego.
 * Registra todos los comandos y niveles, luego inicia el juego.
 * Para agregar nuevos comandos o niveles, solo hay que importarlos y registrarlos aquí.
 */

// --- Registrar Comandos ---
import { commandRegistry } from './commands/CommandRegistry.js';
import { MoveCommand } from './commands/MoveCommand.js';
import { RepeatCommand } from './commands/RepeatCommand.js';
import { EnterCommand } from './commands/EnterCommand.js';

commandRegistry.register(new MoveCommand('up',    'Arriba',    '⬆️',  0, -1));
commandRegistry.register(new MoveCommand('down',  'Abajo',     '⬇️',  0,  1));
commandRegistry.register(new MoveCommand('left',  'Izquierda', '⬅️', -1,  0));
commandRegistry.register(new MoveCommand('right', 'Derecha',   '➡️',  1,  0));
commandRegistry.register(new RepeatCommand());
commandRegistry.register(new EnterCommand());

// --- Registrar Niveles ---
// (cada nivel se auto-registra al importarse)
import './levels/levels/level1.js';

// --- Iniciar Juego ---
import { init } from './Game.js';
init();
