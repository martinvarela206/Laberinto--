# Specialized Prompt for large MVP features

Act as a Tech Lead and Senior Engineer. I need to implement a large feature in my educational maze game, and I want both a technical proposal and an execution plan.

## Project context
1. Modular JS frontend, no framework.
2. Domain structure: core, content, ui, services, utils.
3. Engine supports command sequences, levels are JSON-based, ranking and persistence are local.
4. Product goal: scale through MVPs with new commands, interactions, decisions, and a stronger editor.

## Target feature
[Describe the large feature, for example: add conditionals + keys/doors + visual editor support]

## Functional requirements
1. [FR1]
2. [FR2]
3. [FR3]

## Technical requirements
1. Strict separation of responsibilities by module.
2. Clear contracts between evaluator/core and ui/editor.
3. Backward compatibility with existing levels.
4. Gradual migration without breaking the current flow.
5. If there are trade-offs, explain them and recommend one option.

## What you must do
1. Impact diagnosis (affected modules, risks, dependencies).
2. Technical design (data model, internal APIs, event flow).
3. Implementation plan by phases (PR1, PR2, PR3...).
4. Code implementation by phases.
5. Validation with manual and edge-case tests.
6. Rollback and mitigation plan.

## Output format
1. Brief, concrete architecture proposal.
2. File-by-file changes.
3. Final code ready to apply.
4. Verifiable acceptance criteria.
5. Potential regressions and how to prevent them.

## Quality condition
If rules are ambiguous, do not assume silently: list assumptions and propose a recommended decision before implementing.
