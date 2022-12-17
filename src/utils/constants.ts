import path from "path";

const REFRESH_TOKEN_EXPIRY_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
const JWT_EXPIRY = 5 * 60;
const STATIC_FILES_BASE_PATH = path.join(process.cwd(), "public");
const STATIC_FILES_ROUTE = "/static";

export {
  REFRESH_TOKEN_EXPIRY_TIME,
  JWT_EXPIRY,
  STATIC_FILES_BASE_PATH,
  STATIC_FILES_ROUTE,
};
