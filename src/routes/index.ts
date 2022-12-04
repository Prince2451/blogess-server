import { Router } from "express";
import * as auth from "./auth";
import * as posts from "./posts";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.use("/auth", auth.publicRoutes);
publicRoutes.use("/posts", posts.publicRoutes);
privateRoutes.use("/auth", auth.privateRoutes);
privateRoutes.use("/posts", posts.privateRoutes);

export { publicRoutes, privateRoutes };
