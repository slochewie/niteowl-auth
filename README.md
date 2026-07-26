# NiteOwl Auth

A minimal Docker Compose stack with:

- Better Auth API, available to the UI through `/api/auth/*`
- BTST admin and Better Auth UI on `http://localhost:3030`
- BTST CMS, UI Builder, Form Builder, Blog, and Comments plugins
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

After signing in, open:

- `http://localhost:3030/p/cms` for CMS content
- `http://localhost:3030/p/ui-builder` for the visual page builder
- `http://localhost:3030/p/forms` for the visual form builder
- `http://localhost:3030/p/blog` for published posts
- `http://localhost:3030/p/blog/drafts` for drafts
- `http://localhost:3030/p/blog/new` to create a post
- `http://localhost:3030/p/comments` for your comments
- `http://localhost:3030/p/comments/moderation` for comment moderation

If another computer will open the admin by IP address or hostname, set `ADMIN_URL`
to that exact public origin before starting the stack. For example:

```dotenv
ADMIN_URL=http://192.168.111.27:3030
```

The first startup installs locked npm dependencies, applies Better Auth and BTST
plugin migrations, builds the BTST admin, and starts both Node services. Later
starts skip installation and rebuilding unless their inputs changed.

Email verification is intentionally disabled in this baseline because no mail
delivery service is configured. New and existing local accounts are treated as
verified so organization and invitation screens remain usable.

## Services

```text
Browser -> BTST admin (3030) -> /api/auth/* -> Better Auth
                                                 |     |
                                            PostgreSQL Redis
```

The browser uses the admin origin for authentication. The admin container proxies
those requests to the auth container over the private Compose network. PostgreSQL
and Redis are internal-only and are not exposed on host ports.
