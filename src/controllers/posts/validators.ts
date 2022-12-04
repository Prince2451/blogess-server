import { body, param, query } from "express-validator";
import { Validator } from "../../typings";
import * as controllers from "./index";
const validators: Record<keyof typeof controllers, Validator> = {
  getPost: () => [
    query("page")
      .optional()
      .default(1)
      .isInt({ min: 1 })
      .withMessage("'page' key must be a valid natural number")
      .toInt(),
    query("size")
      .optional()
      .default(10)
      .isInt({ min: 1 })
      .withMessage("'size' key must be a valid natural number")
      .toInt(),
  ],
  createPost: () => [
    body("title")
      .exists()
      .withMessage("'title' is required")
      .isString()
      .withMessage("'title' must be a valid string")
      .isLength({
        max: 64,
      })
      .notEmpty({ ignore_whitespace: true })
      .withMessage("'title' must be greater than 0 and less than 64 characters")
      .trim(),
    body("description")
      .exists()
      .withMessage("'description' is required")
      .isString()
      .withMessage("'description' must be a valid string")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("'description' must be greater than 0 characters")
      .trim(),
    body("content")
      .exists()
      .withMessage("'content' is required")
      .isString()
      .withMessage("'content' must be a valid string")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("'content' must be greater than 0 characters")
      .trim(),
    body("categories")
      .exists()
      .withMessage("'categories' is required")
      .isArray({ min: 1, max: 1 })
      .withMessage("'categories' must be tuple containing one element"),
    body("categories.*")
      .isString()
      .withMessage("'categories' must have string"),
    body("tags")
      .exists()
      .withMessage("'tags' is required")
      .isArray()
      .withMessage("'tags' must an array"),
    body("tags.*").isString().withMessage("'tags' must be array of strings"),
    body("coverImage").isObject().withMessage("'coverImage' must be an object"),
    body("coverImage.url")
      .exists()
      .withMessage("'coverImage.url' is required")
      .isURL()
      .withMessage("'coverImage.url' must be a URL"),
    body("coverImage.base64url")
      .exists()
      .withMessage("'coverImage' is required")
      .isBase64()
      .withMessage("'coverImage.base64url' must be a base64 string"),
  ],
  updatePost: () => [
    ...validators.createPost().map((validator) => validator.optional()),
    param("id").exists().isMongoId().withMessage("':id' is not a valid Id"),
  ],
  deletePost: () => [
    param("id").exists().isMongoId().withMessage("':id' is not a valid Id"),
  ],
  getPostDetails: () => [
    param("id").exists().isMongoId().withMessage("':id' is not a valid Id"),
  ],
  uploadCoverImage: () => [
    body("image")
      .exists()
      .isObject()
      .withMessage("'image' field must be a file"),
  ],
};

export default validators;
