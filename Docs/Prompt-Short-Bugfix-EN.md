# Short Prompt for bugfixes or small changes

Act as a senior JavaScript developer and apply changes directly to my educational maze web game.

## Project context
1. No framework project (HTML, CSS, modular JS).
2. Current architecture in /src: core, content, ui, services, utils.
3. Command sequences are supported (including repeat and enter), levels are JSON-driven, ranking uses localStorage.

## Request
[Describe the exact change in 1 to 3 lines]

## Mandatory constraints
1. Do not mix game logic with UI.
2. Keep levels declarative in JSON.
3. Do not break timer, score, ranking, retry, or sequence execution.
4. Keep changes minimal and consistent with the current code style.
5. If behavior is ambiguous, explain it first and propose a concrete decision.

## Expected deliverables
1. Solution summary.
2. Modified files and why.
3. Final code.
4. Manual validation checklist.
5. Regression risks.

## Output format
1. Short impact diagnosis.
2. Proposed implementation.
3. Patch or complete file blocks.
4. Validation checklist.
5. Optional next steps.

## Example request
Add a "jump" command that moves 2 cells and loses if it lands out of bounds or on a wall. Update command palette, evaluator, and level validation. Include manual test steps.
