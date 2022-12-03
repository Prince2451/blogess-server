import { Router } from "express";
import { posts, validators } from "../../controllers";
import { imageUpload } from "../../services/multer";
import { createRequestHandler } from "../../utils/helpers";

const privateRoutes = Router();

privateRoutes.get(
  "/",
  validators.posts.getPost(),
  createRequestHandler(posts.getPost)
);
privateRoutes.post(
  "/",
  validators.posts.createPost(),
  createRequestHandler(posts.createPost)
);
privateRoutes.get(
  "/:id",
  validators.posts.getPostDetails(),
  createRequestHandler(posts.getPostDetails)
);
privateRoutes.put(
  "/:id",
  validators.posts.updatePost(),
  createRequestHandler(posts.updatePost)
);
privateRoutes.delete(
  "/:id",
  validators.posts.deletePost(),
  createRequestHandler(posts.deletePost)
);
privateRoutes.post(
  "/cover-image",
  imageUpload.single("image"),
  validators.posts.uploadCoverImage(),
  createRequestHandler(posts.uploadCoverImage)
);

export { privateRoutes };
