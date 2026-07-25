# NiteOwl Auth

Git-first, production-mode NiteOwl application containing Better Stack, Better Auth,
React/Vite, Express, the Better Auth Organization plugin, and PostgreSQL.

## Prepare before the first Docker startup

```bash
cp env.example .env
nano .env

cd app
npm install
cd ..
```

`npm install` creates `app/package-lock.json`. Commit the scaffold and lockfile to Git.

## Start

```bash
docker compose up -d
docker compose logs -f niteowl-auth
```

The startup script does not scaffold application files. It:

1. verifies `package.json` and `package-lock.json`;
2. installs locked dependencies with `npm ci`;
3. applies Better Auth migrations;
4. builds the Vite frontend and TypeScript server;
5. starts the compiled Express server.

## URLs

- Application: http://localhost:3010
- Health: http://localhost:3010/health
- Better Auth API: http://localhost:3010/api/auth

Express serves the built frontend and API through the same port.

## Reverse proxy

For deployment at `auth.niteowl.dev`, change these values in `.env`:

```dotenv
BETTER_AUTH_URL=https://auth.niteowl.dev
BETTER_AUTH_TRUSTED_ORIGINS=https://auth.niteowl.dev
VITE_API_URL=https://auth.niteowl.dev
```
