# Quick prompt form (30 seconds)

Copy this block, fill in the fields, and paste it into another AI chat.

```text
Act as a senior JavaScript developer for a modular educational maze web game (folders: core, content, ui, services, utils).

REQUESTED CHANGE:
- Type: [bugfix | feature | refactor]
- Goal: [what you want to achieve]
- Scope: [modules/files if known]

FUNCTIONAL RULES:
1. [rule 1]
2. [rule 2]
3. [rule 3]

TECHNICAL CONSTRAINTS:
1. Do not mix game logic with UI.
2. Keep levels declarative in JSON.
3. Do not break timer, score, ranking, retry, or sequence execution.
4. Keep changes minimal and compatible with the current code.

MANDATORY OUTPUT:
1. Short impact diagnosis.
2. File-by-file changes and why.
3. Final code ready to apply.
4. Manual validation checklist.
5. Regression risks and mitigation.

IF THERE IS AMBIGUITY:
- List assumptions and propose a recommended decision before implementation.
```

## Example filled request

```text
Act as a senior JavaScript developer for a modular educational maze web game (folders: core, content, ui, services, utils).

REQUESTED CHANGE:
- Type: feature
- Goal: add a jump command
- Scope: commandRegistry, commandEvaluator, sequenceView, level validation

FUNCTIONAL RULES:
1. Jump moves 2 cells in the selected direction.
2. If it lands out of bounds, immediate defeat.
3. If it lands on a wall, immediate defeat.

TECHNICAL CONSTRAINTS:
1. Do not mix game logic with UI.
2. Keep levels declarative in JSON.
3. Do not break timer, score, ranking, retry, or sequence execution.
4. Keep changes minimal and compatible with the current code.

MANDATORY OUTPUT:
1. Short impact diagnosis.
2. File-by-file changes and why.
3. Final code ready to apply.
4. Manual validation checklist.
5. Regression risks and mitigation.

IF THERE IS AMBIGUITY:
- List assumptions and propose a recommended decision before implementation.
```
