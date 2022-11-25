import { Router } from "express";
import { posts, validators } from "../../controllers";
import { createRequestHandler } from "../../utils/helpers";

const privateRoutes = Router();

privateRoutes.get(
  "/posts",
  validators.posts.getPost(),
  createRequestHandler(posts.getPost)
);
