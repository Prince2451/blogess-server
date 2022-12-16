declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    MONGO_DB_URL_STRING: string;
    JWT_SECRET: string;
    STATIC_URL_HOST: string;
  }
}
