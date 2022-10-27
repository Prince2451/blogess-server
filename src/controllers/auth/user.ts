import { PublicRequestHandler, Validator } from "../../typings";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { RefreshToken, User } from "../../models/auth";
import { throwError } from "../../utils/helpers";
import { Secret, sign, SignOptions } from "jsonwebtoken";
import { JWT_EXPIRY } from "../../utils/constants";
import { promisify } from "util";

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

const login: PublicRequestHandler<{}, LoginResBody, LoginReqBody> = async (
  req,
  res
) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throwError(StatusCodes.NOT_FOUND, "User with email does not exists");
  const isPassCorrect = await User.verifyPassword(
    req.body.password,
    user.password
  );
  if (!isPassCorrect)
    throwError(StatusCodes.UNAUTHORIZED, "Password does not match");
  const refreshToken = new RefreshToken({
    token: RefreshToken.createToken(),
    user,
  });
  const token = await promisify<object, Secret, SignOptions, string>(sign)(
    {
      email: user.email,
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );
  await refreshToken.save();

  res.status(StatusCodes.OK).json({
    refreshToken: refreshToken.token,
    token,
  });
};

export { login, validators };
