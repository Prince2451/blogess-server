import { PublicRequestHandler, Validator } from "../../typings";
import { body } from "express-validator";

interface LoginReqBody {
  email: string;
  password: string;
}
interface LoginResBody {
  refreshToken: string;
  token: string;
}

const validators: Record<string, Validator> = {
  login: () => [
    body("email").isEmail().withMessage("Valid email address is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
};

const login: PublicRequestHandler<
  {},
  LoginResBody | any,
  LoginReqBody
> = async (req, res, next) => {
  res.status(200);
};

export { login, validators };
