import Fastify from "fastify";
import { fastifyPostgresJs } from "../";

const fastify = Fastify({
  logger: true,
});

void fastify.register(fastifyPostgresJs, {
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
