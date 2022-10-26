import { RequestHandler } from "express";

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
  fn: (...agrs: Parameters<RequestHandler>) => Promise<void> | void
): (...args: Parameters<RequestHandler>) => void {
  return async function (...args: Parameters<RequestHandler>) {
    try {
      // will not be able to handle errors inside .then or .catch in promise chain
      // only returned promises will be handled
      await fn(...args);
    } catch (err) {
      // Goes to default error handlers once error occurs inside requestHandler
      args[2](err);
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
