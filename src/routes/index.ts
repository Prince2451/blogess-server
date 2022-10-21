import { Router } from "express";
import * as auth from "./auth";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.use("/auth", auth.publicRoutes);
privateRoutes.use("/auth", auth.privateRoutes);

export { publicRoutes, privateRoutes };
