import { query } from "express-validator";
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
};

export default validators;
