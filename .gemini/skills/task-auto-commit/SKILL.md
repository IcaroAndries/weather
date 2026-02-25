---
name: task-auto-commit
description: Automatically stages and commits all changes after the successful completion and validation of a task. Use this when the user wants to maintain a clean git history without manual commit commands for every minor change.
---

# Task Auto Commit

This skill instructs Gemini CLI to automatically commit changes upon successful completion of a task.

## Workflow

1.  **Completion & Validation**: Once you have finished implementing a task and have successfully validated it (running tests, linting, or manual checks), proceed to the commit phase.
2.  **Staging**: Run `git add .` to stage all changes.
3.  **Commit Message**: Generate a concise, descriptive commit message based on the work performed. Follow the project's commit style if identifiable (e.g., conventional commits).
4.  **Commit**: Execute `git commit -m "<message>"`.
5.  **Confirmation**: Briefly inform the user that the changes have been committed automatically as per the `task-auto-commit` skill.

## Guidelines

-   Only commit after **full validation**.
-   If a task is part of a larger multi-step directive, wait until the final step is validated before committing the entire set of changes.
-   Do not push changes; only commit locally.
