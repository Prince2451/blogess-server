import { RequestHandler } from "express";

function createRequestHandler(
  fn: (...agrs: Parameters<RequestHandler>) => Promise<void> | void
): (...args: Parameters<RequestHandler>) => void {
  return function (...args: Parameters<RequestHandler>) {
    // will not be able to handle errors inside .then or .catch in promise chain
    const returnedValue = fn(...args);
    if (returnedValue instanceof Promise) {
      returnedValue.catch((err) => {
        // Goes to default error handlers once error occurs inside requestHandler
        args[2](err);
      });
    }
  };
}

export { createRequestHandler };
