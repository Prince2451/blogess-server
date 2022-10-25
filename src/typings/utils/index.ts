import { RequestHandler } from "express";
import { auth } from "..";

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
