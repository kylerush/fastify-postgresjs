import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import postgres from "postgres";

declare module "fastify" {
  interface FastifyInstance {
    sql: postgres.Sql<Record<string, unknown>>
  }
}

export interface fastifyPostgresJsOptions {
  host?: string;
  port?: number;
  path?: string;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  max?: number;
  max_lifetime?: number;
  idle_tieout?: number;
  connect_timeout?: number;
  prepare?: boolean;
  debug?: () => unknown;
  connection?: {
    application_name: "";
  };
  fetch_types?: boolean;
}

const fastifyPostgresJs: FastifyPluginCallback<fastifyPostgresJsOptions> = (
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
