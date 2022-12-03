import { Router } from "express";
import { auth, validators } from "../../controllers";
import helpers from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.post(
  "/login",
  validators.auth.login(),
  helpers.request.createRequestHandler(auth.login)
);
publicRoutes.post(
  "/register",
  validators.auth.register(),
  helpers.request.createRequestHandler(auth.register)
);
publicRoutes.post(
  "/token",
  validators.auth.token(),
  helpers.request.createRequestHandler(auth.token)
);
privateRoutes.get("/user", helpers.request.createRequestHandler(auth.getUser));

export { publicRoutes, privateRoutes };
