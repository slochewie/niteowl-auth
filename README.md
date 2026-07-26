# NiteOwl Auth

A minimal Docker Compose stack with:

- Better Auth API, available to the UI through `/api/auth/*`
- BTST admin and Better Auth UI on `http://localhost:3030`
- PostgreSQL 18
- Redis 8

## Start

```bash
cp env.example .env
```

Replace every placeholder secret in `.env`, then run:

```bash
docker compose up -d
docker compose logs -f auth admin
```

Open `http://localhost:3030`.

If another computer will open the admin by IP address or hostname, set `ADMIN_URL`
to that exact public origin before starting the stack. For example:

```dotenv
ADMIN_URL=http://192.168.111.27:3030
```

The first startup installs locked npm dependencies, applies Better Auth migrations,
builds the BTST admin, and starts both Node services. Later starts skip installation
and rebuilding unless their inputs changed.

## Services

```text
Browser -> BTST admin (3030) -> /api/auth/* -> Better Auth
                                                 |     |
                                            PostgreSQL Redis
```

The browser uses the admin origin for authentication. The admin container proxies
those requests to the auth container over the private Compose network. PostgreSQL
and Redis are internal-only and are not exposed on host ports.
