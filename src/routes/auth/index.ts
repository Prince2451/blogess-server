import { Router } from "express";
import { auth, validators } from "../../controllers";
import { createRequestHandler } from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.post(
  "/login",
  validators.auth.login(),
  createRequestHandler(auth.login)
);
publicRoutes.post(
  "/register",
  validators.auth.register(),
  createRequestHandler(auth.register)
);
publicRoutes.post(
  "/token",
  validators.auth.token(),
  createRequestHandler(auth.token)
);
privateRoutes.get("/user", createRequestHandler(auth.getUser));

export { publicRoutes, privateRoutes };
