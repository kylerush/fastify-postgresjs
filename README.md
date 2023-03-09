# fastify-postgresjs

An ESM only Fastify plugin for [Postgres.js](https://github.com/porsager/postgres) with full TypeScript support.

This plugin has two features:

1. Initliazes the `postgres` module with the supplied options and adds it to the Fastify server instance;
2. Calls `sql.end()` in the Fastify `onClose` hook to close all database connections.

## Getting started

### Installation

`npm install fastify-postgres-dot-js`

### Usage

Import the plugin, pass it to the `.register` method on your Fastify instance and optionally pass `postgres` module options.

```ts
import Fastify from "fastify";
import { fastifyPostgresJs } from "../";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgresJs, {
  host: "localhost",
  port: 5431,
  database: "postgres",
  username: "some_user",
  password: "some_password",
});

interface Foo {
  foo: string;
}

fastify.get("/:id", async function (request) {
  interface Params {
    id: string;
  }
  const { id } = request.params as Params;
  const foo = await request.server.sql<Foo[]>`
    SELECT "bar" FROM "foo" WHERE id = ${id};
  `;
  return foo[0];
});

try {
  await fastify.listen({
    port: 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
```

If your Postgres connection details are environment variables, you may not need to pass any options.

.env file:

```
PGUSER=some_user
PGHOST=localhost
PGPASSWORD=some_password
PGDATABASE=postgres
PGPORT=5432
```

TypeScript file:

```ts
import "dotenv/config";
import Fastify from "fastify";
import { fastifyPostgresJs } from "../";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgresJs);

interface Foo {
  foo: string;
}

fastify.get("/:id", async function (request) {
  interface Params {
    id: string;
  }
  const { id } = request.params as Params;
  const foo = await request.server.sql<Foo[]>`
    SELECT "bar" FROM "foo" WHERE id = ${id};
  `;
  return foo[0];
});

try {
  await fastify.listen({
    port: 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
```

## Development and testing

First, start postgres with:

```sh
npm run postgres
```

Then run the database migration:

```sh
npm run migrate
```
