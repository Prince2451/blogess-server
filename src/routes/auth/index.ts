import { Router } from "express";
import { auth } from "../../controllers";
import { createRequestHandler } from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.post(
  "/login",
  auth.validators.login(),
  createRequestHandler(auth.login)
);

export { publicRoutes, privateRoutes };
