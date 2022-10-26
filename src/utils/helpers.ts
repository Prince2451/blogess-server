import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

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

function createRequestHandler(
  fn: (...agrs: Parameters<RequestHandler>) => Promise<void> | void,
  options: {
    handleErrors?: boolean;
  } = { handleErrors: true }
): (...args: Parameters<RequestHandler>) => void {
  return async function (req, res, next) {
    try {
      if (options.handleErrors) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errors.array({ onlyFirstError: true }));
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
