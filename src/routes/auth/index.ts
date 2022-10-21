import { Router } from "express";
import { auth } from "../../controllers";
import { createRequestHandler } from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.post("/login", (...args) => {
  createRequestHandler(auth.login, ...args).catch((err) => {
    console.log(err);
  });
});

export { publicRoutes, privateRoutes };
