# Upstream policy

This repository is a small downstream deployment of Better Stack (BTST) and
Better Auth. Upstream generators, templates, documentation, and examples are
the source of truth. Local integration code must not replace an upstream
implementation when an upstream implementation exists.

## Canonical upstream sources

Sources are consulted in this order:

1. [BTST code generator](https://github.com/better-stack-ai/better-stack/tree/main/scripts/codegen)
   and the `@btst/codegen` templates it exercises.
2. [BTST repository](https://github.com/better-stack-ai/better-stack) and
   package documentation.
3. [BTST Better Auth UI fork](https://github.com/better-stack-ai/better-auth-ui).
4. [Better Auth repository](https://github.com/better-auth/better-auth) and
   official documentation.
5. Official Docker image documentation for
   [Node.js](https://hub.docker.com/_/node),
   [PostgreSQL](https://hub.docker.com/_/postgres), and
   [Redis](https://hub.docker.com/_/redis).

The generated Next.js application is the baseline for `admin/`. Generated
files should remain unchanged unless a deviation is listed below.

The current baseline is pinned to the stable BTST `v2.12.2` tag and
`@btst/codegen` `0.1.3`. BTST `main` currently targets the unreleased
`@btst/stack` 3.0.0 API and is not mixed with the stable npm packages. Updating
this pin is a deliberate upstream-upgrade task.

## Deviation policy

Every deviation from generated or documented upstream behavior must:

- solve a requirement that upstream does not satisfy;
- be as small as possible;
- cite the upstream behavior it changes;
- be recorded in this file before or with the implementing commit; and
- be removable without rewriting unrelated generated files.

If a deviation is not documented here, treat it as accidental and remove it.
NiteOwl-specific features are added only after the stock scaffold and approved
deployment deviations work.

## Approved architectural deviations

### Dedicated Better Auth service

Better Auth runs in a separate Node.js service instead of being embedded in
the BTST Next.js application. This makes one identity authority available to
the admin application and future NiteOwl applications.

The BTST admin uses the `@btst/better-auth-ui` client plugin and Better Auth
client SDK. It must not initialize the Better Auth server or connect directly
to the identity database.

### Docker Compose deployment

The stack is orchestrated by Docker Compose so a fresh checkout can be started
with `docker compose up -d` after creating `.env` from `env.example`.

### PostgreSQL

PostgreSQL is the persistent database for Better Auth and BTST plugins that
require persistence.

### Redis

Redis is available to the Better Auth service for secondary storage and
cross-instance session/cache functionality.

### Node.js 24

Both Node.js applications run from the official `node:24` image.

### No Dockerfiles

The repository does not build custom container images. Application source and
relative `node_modules` directories are bind-mounted into official images and
the containers perform their documented install, migration, build, and start
commands.

## Not approved

The following require an explicit update to this file before implementation:

- custom replacements for generated BTST routes, layouts, page factories, or
  providers;
- custom replacements for Better Auth UI pages or navigation;
- undocumented plugin wrappers, aliases, callbacks, or authorization rules;
- NiteOwl branding or domain-specific features;
- additional infrastructure services; and
- Dockerfiles or auxiliary build containers.
