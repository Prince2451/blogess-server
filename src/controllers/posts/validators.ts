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
    query("limit")
      .optional()
      .isNumeric({ no_symbols: true })
      .withMessage("'limit' key must be a valid number")
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
      .withMessage(
        "'title' must be greater than 0 and less than 64 characters"
      ),
    body("description")
      .exists()
      .withMessage("'description' is required")
      .isString()
      .withMessage("'description' must be a valid string")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("'description' must be greater than 0 characters"),
    body("content")
      .exists()
      .withMessage("'content' is required")
      .isString()
      .withMessage("'content' must be a valid string")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("'content' must be greater than 0 characters"),
    body("categories")
      .exists()
      .withMessage("'categories' is required")
      .isArray({ max: 1 })
      .isString()
      .withMessage("'categories' must be tuple containing one element"),
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
