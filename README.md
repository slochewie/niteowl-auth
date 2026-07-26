# NiteOwl Auth

A minimal Docker Compose stack with:

- Better Auth API on `http://localhost:3031`
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

The first startup installs locked npm dependencies, applies Better Auth migrations,
builds the BTST admin, and starts both Node services. Later starts skip installation
and rebuilding unless their inputs changed.

## Services

```text
Browser -> BTST admin (3030) -> Better Auth API (3031)
                                   |           |
                              PostgreSQL     Redis
```

PostgreSQL and Redis are internal-only and are not exposed on host ports.
