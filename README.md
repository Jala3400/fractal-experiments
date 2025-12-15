# Fractal Experiments

![Fractal Experiments](./images/image.png)

A Svelte-based web application for exploring and visualizing fractals with interactive controls and real-time rendering.

## Project Overview

This project provides an interactive environment for generating and experimenting with fractals. It features a modern UI built with Svelte and SvelteKit, allowing users to adjust parameters and see the results instantly.

It is a side project in early development.

## Index

- [Fractal Experiments](#fractal-experiments)
  - [Project Overview](#project-overview)
  - [Index](#index)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Building](#building)
  - [Project Structure](#project-structure)

## Features

- **Interactive Fractal Controls** - Adjust fractal parameters in real-time
- **Visual Feedback** - Instant rendering updates as you modify settings
- **Modular Components** - Well-organized atomic, molecular, and organism-based UI components

## Tech Stack

- **Framework**: Svelte + SvelteKit
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm

### Installation

```sh
# Install dependencies
pnpm install
```

### Development

Start the development server:

```sh
pnpm run dev

# Open in browser (optional)
pnpm run dev -- --open
```

The app will be available at `http://localhost:5173`

### Building

To create a production build:

```sh
pnpm run build
```

Preview the production build:

```sh
pnpm run preview
```

## Project Structure

```txt
src/
├── lib/
│   ├── components/       # Reusable UI components
│   │   ├── atoms/        # Basic components (Button, Input, etc.)
│   │   ├── molecules/    # Composite components (Controls)
│   │   └── organisms/    # Complex components (FractalControls)
│   ├── fractals.ts       # Fractal generation logic
├── routes/               # SvelteKit pages and layouts
└── app.css               # Global styles
```
