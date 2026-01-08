# Contributing to Blobber Action

Thank you for your interest in contributing! This document provides guidelines for contributing to the Blobber GitHub Action.

## Code of Conduct

Be respectful and constructive in all interactions. Harassment or abusive behavior will not be tolerated.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your setup:
   ```bash
   npm run all
   ```

## Development Workflow

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the action |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run all` | Run all checks |

### Making Changes

1. Create a feature branch from `master`
2. Make your changes
3. Run `npm run all` to verify
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/)

## Commit Guidelines

Use Conventional Commits format:

```
<type>: <description>
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Maintenance

## Pull Request Process

1. Ensure `npm run all` passes
2. Update documentation if needed
3. Open a PR against `master`
4. Address review feedback

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
