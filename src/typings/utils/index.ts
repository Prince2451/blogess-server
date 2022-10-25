import type { RequestHandler } from "express";
import type { auth } from "..";
import type { ValidationChain } from "express-validator";

interface PrivateRequestLocals {
  user: auth.User;
}

export type PrivateRequestHandler<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> = RequestHandler<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  Locals & PrivateRequestLocals
>;

export type PublicRequestHandler<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> = RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;

export type Validator = () => ValidationChain[] | ValidationChain;
