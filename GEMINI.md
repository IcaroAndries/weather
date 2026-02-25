# Weather App

A modern weather application prototype built with Svelte, TypeScript, and Vite. This project features a clean glassmorphism UI and fluid background animations.

## Project Overview

- **Purpose:** A prototype weather dashboard showcasing current conditions with a modern aesthetic.
- **Main Technologies:**
    - **Svelte 4:** Frontend framework for reactive UI components.
    - **TypeScript:** Ensuring type safety across the codebase.
    - **Vite:** High-performance build tool and development server.
    - **Sass:** Used for component-level and global styling (utilizing indented syntax).
- **Architecture:**
    - **Components:** Modular UI elements located in `src/components/`.
    - **Styles:** Global styles are defined in `src/app.sass`, while component-specific styles are scoped within `.svelte` files.
    - **Lib:** Shared utilities and types are stored in `src/lib/`, with a `~lib` alias configured in `vite.config.ts`.

## Building and Running

The project uses standard npm scripts for development and production:

- **Development:** `npm run dev` starts the Vite development server.
- **Production Build:** `npm run build` compiles the application into the `dist/` directory.
- **Preview:** `npm run preview` serves the production build locally.
- **Type Checking:** `npm run check` runs `svelte-check` to validate TypeScript and Svelte components.
- **Linting:** `npm run lint` runs ESLint to find and fix code style issues.

## Development Conventions

- **TypeScript:** All new components and logic should use TypeScript (`<script lang="ts">`).
- **Styling:** Prefer Sass for styling. For components, use `<style lang="sass">` with indented syntax to match existing patterns.
- **Imports:** Use the `~lib` alias when importing from the `src/lib` directory.
- **Components:** Follow the directory structure of `src/components/[ComponentName]/index.svelte` for better organization.
- **Glassmorphism:** Maintain the glassmorphism aesthetic (blur, semi-transparent backgrounds, subtle borders) as seen in `MainCard`.
