import { Router } from "express";
import { posts, validators } from "../../controllers";
import helpers from "../../utils/helpers";

const publicRoutes = Router();
const privateRoutes = Router();

publicRoutes.get(
  "/public/:slug",
  validators.posts.getPublicPost(),
  helpers.request.requestHandler(posts.getPublicPost)
);

privateRoutes.get(
  "/",
  validators.posts.getPost(),
  helpers.request.requestHandler(posts.getPost)
);
privateRoutes.post(
  "/",
  validators.posts.createPost(),
  helpers.request.requestHandler(posts.createPost)
);
privateRoutes.get(
  "/:id",
  validators.posts.getPostDetails(),
  helpers.request.requestHandler(posts.getPostDetails)
);
privateRoutes.put(
  "/:id",
  validators.posts.updatePost(),
  helpers.request.requestHandler(posts.updatePost)
);
privateRoutes.delete(
  "/:id",
  validators.posts.deletePost(),
  helpers.request.requestHandler(posts.deletePost)
);
privateRoutes.post(
  "/cover-image",
  helpers.multer.imageUpload.single("image"),
  validators.posts.uploadCoverImage(),
  helpers.request.requestHandler(posts.uploadCoverImage)
);

export { privateRoutes, publicRoutes };
