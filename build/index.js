import fp from "fastify-plugin";
import postgres from "postgres";
const fastifyPostgresJs = (fastify, options, done) => {
    const sql = postgres(options);
    fastify.decorate("sql", sql);
    fastify.addHook("onClose", async () => {
        await sql.end();
    });
    done();
};
export default fp(fastifyPostgresJs);
export { fastifyPostgresJs };
