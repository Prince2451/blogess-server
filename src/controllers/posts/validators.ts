import { query } from "express-validator";
import { Validator } from "../../typings";
import * as controllers from "./index";
const validators: Record<keyof typeof controllers, Validator> = {
  getPost: () => [
    query("page")
      .exists()
      .withMessage("'page' key is required")
      .isNumeric({ no_symbols: true })
      .withMessage("'page' key must be a valid number")
      .toInt(),
    query("limit")
      .exists()
      .withMessage("'limit' key is required")
      .isNumeric({ no_symbols: true })
      .withMessage("'limit' key must be a valid number")
      .toInt(),
  ],
};

export default validators;
