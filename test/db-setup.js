import "dotenv/config";
import postgres from "postgres";

const sql = postgres();

await sql`
  CREATE TABLE users(
    "pk" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "username" VARCHAR (50) NOT NULL
  );
`;

await sql.end();
