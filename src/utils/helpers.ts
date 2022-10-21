import { RequestHandler } from "express";

async function createRequestHandler(
  fn: (...agrs: Parameters<RequestHandler>) => Promise<void> | void,
  ...args: Parameters<RequestHandler>
): Promise<void> {
  try {
    // will not be able to handle errors inside .then or .catch in promise chain
    await fn(...args);
  } catch (err) {
    // Goes to default error handlers once error occurs inside requestHandler
    args[2](err);
  }
}

export { createRequestHandler };
