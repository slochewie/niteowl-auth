# NiteOwl Auth

NiteOwl Auth is a Docker-first full-stack application built with:

- React Router v7 framework mode
- BTST backend and client stacks
- BTST Drizzle adapter
- BTST Better Auth UI routes
- Better Auth with the Organization plugin
- PostgreSQL 18
- Tailwind CSS v4
- Sonner

## First startup

```bash
cp env.example .env
nano .env
docker compose up -d
docker compose logs -f niteowl-auth
```

No local scaffolding or npm command is required before the first startup. The committed application scaffold is complete. `scripts/start.sh` will:

1. install dependencies and create `app/package-lock.json` when it does not exist;
2. use `npm ci` on later starts when the lockfile exists;
3. apply Better Auth database migrations;
4. run React Router type generation and TypeScript checks;
5. build the production React Router application;
6. start the production server.

## Routes

- Application: `http://localhost:3010/`
- Health: `http://localhost:3010/health`
- Better Auth API: `http://localhost:3010/api/auth/*`
- BTST data API: `http://localhost:3010/api/data/*`
- BTST pages: `http://localhost:3010/p/*`
- Sign in: `http://localhost:3010/p/auth/sign-in`
- Account settings: `http://localhost:3010/p/account/settings`
- Organization members: `http://localhost:3010/p/org/members`

The application exposes one container port, `3000`, mapped to host port `3010` by default. BTST does not require a separate port.

## Reverse proxy

For deployment at `auth.example.com`, set:

```dotenv
BETTER_AUTH_URL=https://auth.example.com
BETTER_AUTH_TRUSTED_ORIGINS=https://auth.example.com
PUBLIC_SITE_URL=https://auth.example.com
```
