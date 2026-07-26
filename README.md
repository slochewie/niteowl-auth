# NiteOwl Auth

A stock BTST Next.js application connected to a dedicated Better Auth service,
with PostgreSQL and Redis, running from official container images.

The intentional differences from upstream are documented in
[`UPSTREAM.md`](UPSTREAM.md).

## Start

```bash
cp env.example .env
```

Replace the placeholder passwords and secret in `.env`, then run:

```bash
docker compose up -d
docker compose logs -f auth admin
```

Open:

- BTST: `http://localhost:3030`
- Better Auth UI: `http://localhost:3030/pages/auth/sign-in`
- Better Auth API health: `http://localhost:3031/health`

The first startup installs the locked dependencies, migrates Better Auth,
builds both Node.js applications, and starts them. Later startups reuse the
installed dependencies and production builds until their inputs change.

## Access from another computer

Set both public URLs to the host name or IP address used by the browser:

```dotenv
AUTH_URL=http://192.168.111.27:3031
ADMIN_URL=http://192.168.111.27:3030
```

Then recreate the services:

```bash
docker compose down
docker compose up -d
```

PostgreSQL and Redis are only available on the private Compose network.

## Services

```text
Browser
  ├── BTST + Better Auth UI :3030
  └── Better Auth API      :3031
          ├── PostgreSQL
          └── Redis
```
