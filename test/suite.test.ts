import "dotenv/config";
import { describe, expect, test, vi } from "vitest";
import { faker } from "@faker-js/faker";
import Fastify from "fastify";
import type postgres from "postgres";

describe("fastify-postgresjs test suite", async () => {
  const fastify = Fastify({
    logger: false,
  });

  // Create some spies to use for the tests
  let postgresJsSpy: typeof postgres;
  // @ts-expect-error not sure how to fix this
  let sqlEndSpy;

  // Mock the Postgresjs module so we can spy on it
  vi.doMock("postgres", async () => {
    const actualPostgresImport = await vi.importActual<{
      default: typeof postgres;
    }>("postgres");
    const actualPostgres = actualPostgresImport.default;

    // The postgres function has a function overload type we have to explicitly cast here
    postgresJsSpy = vi.fn(actualPostgres) as unknown as typeof postgres;
    const mockPostgres = (options = {}) => {
      const postgresJsInstance = postgresJsSpy(options);
      sqlEndSpy = vi.spyOn(postgresJsInstance, "end");
      return postgresJsInstance;
    };

    return {
      default: mockPostgres,
    };
  });

  // Import the fastify-postgresjs plugin
  const { fastifyPostgresJs } = await import("../index.js");

  test("Connection options work", async () => {
    const connectionDetails = {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT),
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    };
    await fastify.register(fastifyPostgresJs, connectionDetails);
    expect(postgresJsSpy).toBeCalledWith(connectionDetails);
  });

  // Create a POST endpoint to test a DB INSERT
  fastify.post("/create-user", async (request) => {
    const { userName } = request.body as User;

    if (!userName && typeof userName !== "string") {
      throw new Error("You must supply a userName.");
    }

    const newUser = await request.server.sql<User[]>`
      INSERT INTO "users" ("username") VALUES (${userName})
        RETURNING "pk" as "id", "username" as "userName";
    `;

    if (!newUser[0]) {
      throw new Error("Expected 1 row returned but got 0.");
    }

    return newUser[0];
  });

  fastify.get("/get-user:id", async (request) => {
    const { id } = request.query as GetUserParams;

    if (!id && typeof id !== "string") {
      throw new Error("You must provide an id query parameter.");
    }

    const user = await request.server.sql<User[]>`
      SELECT "pk" as "id", "username" as "userName" from "users"
        WHERE "pk" = ${parseInt(id)};
    `;

    if (!user[0]) {
      throw new Error("No user found.");
    }

    return user[0];
  });

  let newUser: User;

  test("Create a new user", async () => {
    const userName = faker.word.noun();
    const createUserReq = await fastify.inject({
      method: "POST",
      payload: {
        userName: userName,
      },
      url: "/create-user",
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const createdUser = createUserReq.json() as User;

    expect(createdUser).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number) as boolean,
        userName: expect.stringContaining(userName) as boolean,
      })
    );

    newUser = createdUser;
  });

  test("Get user", async () => {
    const id = newUser.id?.toString() as string;

    const getUserReq = await fastify.inject({
      method: "GET",
      url: `/get-user`,
      query: { id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const user = getUserReq.json() as User;

    expect(user).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number) as boolean,
        userName: expect.stringContaining(
          newUser.userName as string
        ) as boolean,
      })
    );
  });

  test("Close db connections", async () => {
    await fastify.close();
    // @ts-expect-error not sure how to fix this
    expect(sqlEndSpy).toHaveBeenCalled();
  });
});

interface GetUserParams {
  id: string;
}

export interface User {
  id?: number;
  userName?: string;
}
