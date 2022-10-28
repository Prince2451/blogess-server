import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrivateRequestHandler, PublicRequestHandler } from "../typings";

class HTTPError<T extends object = object> extends Error {
  status: number;
  error?: object;
  constructor(
    status: number,
    message: string = "Something went wrong",
    err?: T
  ) {
    super(message);
    this.status = status;
    if (err) this.error = err;
  }
}

function createRequestHandler<
  T extends PublicRequestHandler | PrivateRequestHandler =
    | PublicRequestHandler
    | PrivateRequestHandler
>(
  fn: T,
  options: {
    handleErrors?: boolean;
  } = { handleErrors: true }
): (
  ...args: Parameters<
    T extends PrivateRequestHandler
      ? PrivateRequestHandler
      : PublicRequestHandler
  >
) => Promise<void> {
  return async function (req, res, next) {
    try {
      if (options.handleErrors) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(errors.array({ onlyFirstError: true }));
          return;
        }
      }
      // will not be able to handle errors inside .then or .catch in promise chain
      // only returned promises will be handled
      await fn(req, res, next);
    } catch (err) {
      // Goes to default error handlers once error occurs inside requestHandler
      next(err);
    }
  };
}

function throwError<T extends object = object>(
  status: number,
  message?: string,
  error?: T
): never {
  const err = new HTTPError(status, message, error);
  throw err;
}

export { createRequestHandler, throwError, HTTPError };
