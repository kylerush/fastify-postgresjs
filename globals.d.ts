export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PGUSER: string;
      PGHOST: string;
      PGPASSWORD: string;
      PGDATABASE: string;
      PGPORT: string;
    }
  }
}
