import type { FastifyPluginCallback } from "fastify";
import postgres from "postgres";
declare module "fastify" {
    interface FastifyInstance {
        sql: postgres.Sql<{}>;
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
declare const _default: FastifyPluginCallback<fastifyPostgresJsOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default _default;
