import { body } from "express-validator";
import { Optional, Validator } from "../../typings";
import * as controllers from "./index";
const validators: Optional<
  Record<keyof typeof controllers, Validator>,
  "getUser"
> = {
  login: () => [
    body("email", "Valid email address is required").isEmail(),
    body("password", "Password is required").notEmpty().isString(),
  ],
  register: () => [
    body("email", "Valid email address is required").isEmail(),
    body("firstName", "valid first name is required")
      .isString()
      .trim()
      .notEmpty(),
    body("lastName", "Valid last name is required").optional().isString(),
    body(
      "password",
      "Password must contain atleast 1 lowercase, 1 uppercase, 1 special character and of minimun 6 characters long"
    ).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    }),
  ],
  token: () => [
    body("refreshToken", "Valid refreshToken is required").exists().isString(),
  ],
};

export default validators;
