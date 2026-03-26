/**
 * main.js - Bootstrap del juego.
 * Registra todos los comandos, niveles y sistemas.
 * Para agregar nuevos comandos/niveles/sistemas, solo importarlos y registrarlos aquí.
 * 
 * Design: Este archivo actúa como punto central que orquesta importaciones.
 * Mantenerlo limpio y conciso facilita el trabajo colaborativo.
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
// Importar module que carga todos los niveles
import './levels/levels.js';

// --- Iniciar Juego ---
import { init } from './Game.js';
init();
