import { body, query } from "express-validator";
import { Validator } from "../../typings";
import * as controllers from "./index";
const validators: Record<keyof typeof controllers, Validator> = {
  getPost: () => [
    query("page")
      .optional()
      .isNumeric({ no_symbols: true })
      .withMessage("'page' key must be a valid number")
      .toInt()
      .default(1),
    query("size")
      .optional()
      .isNumeric({ no_symbols: true })
      .withMessage("'size' key must be a valid number")
      .toInt()
      .default(10),
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
    body("coverImage")
      .exists()
      .withMessage("'coverImage' is required")
      .isURL()
      .withMessage("'coverImage' must be a URL"),
  ],
};

export default validators;
