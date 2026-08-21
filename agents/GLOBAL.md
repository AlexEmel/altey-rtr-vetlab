# COMMON_INSTRUCTIONS.md

## 1. Purpose

This file defines the baseline project rules for AI agents creating and evolving modern web applications from scratch.

Primary goal:
- build features quickly without losing architectural consistency;
- prefer predictable, scalable, type-safe solutions;
- keep the project easy to extend by both humans and AI agents;
- optimize for delivery speed, maintainability, and low-friction onboarding.

This document is intentionally domain-agnostic and should be used as a reusable operating guide for similar frontend projects.

## 2. Agent Priorities

When building or extending a project, prefer the following order:

1. preserve clarity of architecture;
2. prefer simple and composable solutions over clever abstractions;
3. keep changes local and type-safe;
4. reuse existing patterns before introducing new ones;
5. optimize for future feature delivery by other agents.

## 3. Delivery Workflow For Agents

Preferred workflow:

1. inspect the nearest relevant files and patterns;
2. define the smallest change that solves the task;
3. implement code in the appropriate layer;
4. run lint, typecheck, and build when relevant;
5. document assumptions if context is missing.

Avoid:

- premature abstraction;
- broad refactors without request;
- mixing architecture changes with feature delivery unless necessary;
- creating duplicate utility layers;
- inventing a new pattern when a good local one already exists.

## 4. Definition Of Done

A change is considered complete when:

- the feature works in the intended flow;
- affected types are valid;
- lint passes or failures are understood and unrelated;
- build passes when the change can affect bundling or typing;
- styling respects the active theme system;
- the change follows the documented project structure.