import type { RequestHandler } from "express";
import type { ValidationChain } from "express-validator";

interface PrivateRequestLocals {
  user: { id: string; email: string };
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

export interface MongooseTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export type Optional<T extends object, K extends keyof T> = Partial<
  Pick<T, K>
> &
  Omit<T, K>;
