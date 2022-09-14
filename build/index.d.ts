import type { FastifyPluginCallback } from "fastify";
import postgres from "postgres";
declare module "fastify" {
    interface FastifyInstance {
        sql: ReturnType<typeof postgres>;
    }
}
export type FastifyPostgresJsOptions<T extends Record<string, postgres.PostgresType<any>> = {}> = postgres.Options<T>;
declare const fastifyPostgresJs: FastifyPluginCallback<FastifyPostgresJsOptions>;
declare const _default: FastifyPluginCallback<FastifyPostgresJsOptions<{}>, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault, import("fastify").FastifyBaseLogger>;
export default _default;
export { fastifyPostgresJs };
