import { StatusCodes } from "http-status-codes";
import {
  Secret,
  verify,
  GetPublicKeyOrSecret,
  VerifyCallback,
  JwtPayload,
} from "jsonwebtoken";
import { promisify } from "util";
import { PrivateRequestHandler } from "../typings";
import { createRequestHandler, throwError } from "../utils/helpers";

const authMiddleware: PrivateRequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  let decodedToken: JwtPayload | undefined | null;

  if (token) {
    try {
      decodedToken = await promisify(
        verify as (
          token: string,
          secret: Secret | GetPublicKeyOrSecret,
          callback: VerifyCallback<JwtPayload>
        ) => void
      )(token, process.env.JWT_SECRET);
    } catch (err) {
      // verfication failed
      decodedToken = null;
    }
  }

  if (!decodedToken)
    throwError(StatusCodes.UNAUTHORIZED, "Access token is not valid");

  res.locals.user = {
    email: decodedToken.email,
    id: decodedToken.id,
  };
  next();
};

export default createRequestHandler(authMiddleware, {
  handleErrors: false,
  onlyMatchedData: false,
});
