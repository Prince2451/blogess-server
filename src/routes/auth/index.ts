import { Router } from "express";
import { auth, validators } from "../../controllers";
import helpers from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.post(
  "/login",
  validators.auth.login(),
  helpers.request.requestHandler(auth.login)
);
publicRoutes.post(
  "/register",
  validators.auth.register(),
  helpers.request.requestHandler(auth.register)
);
publicRoutes.post(
  "/token",
  validators.auth.token(),
  helpers.request.requestHandler(auth.token)
);
privateRoutes.get("/user", helpers.request.requestHandler(auth.getUser));

export { publicRoutes, privateRoutes };
