import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import postgres from "postgres";

declare module "fastify" {
  interface FastifyInstance {
    sql: ReturnType<typeof postgres>;
  }
}

export type FastifyPostgresJsOptions<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  T extends Record<string, postgres.PostgresType<any>> = {}
> = postgres.Options<T>;

const fastifyPostgresJs: FastifyPluginCallback<FastifyPostgresJsOptions> = (
  fastify,
  options,
  done
) => {
  const sql = postgres(options);
  fastify.decorate("sql", sql);
  fastify.addHook("onClose", async () => {
    await sql.end();
  });
  done();
};

export default fp(fastifyPostgresJs);
export { fastifyPostgresJs };
