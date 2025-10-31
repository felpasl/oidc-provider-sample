# OIDC Monorepo

A monorepo with an OIDC provider and a client app for testing authentication.

## Setup

Install dependencies:
```bash
pnpm install
```

Build the project:
```bash
pnpm build
```

## Running

Start the OIDC provider:
```bash
pnpm start:provider
```

In another terminal, start the client app:
```bash
pnpm start:client
```

## Usage

- OIDC Provider runs on http://localhost:3000
- Client app runs on http://localhost:3001

Visit http://localhost:3001 to test login.