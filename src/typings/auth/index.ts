import { Types } from "mongoose";
import { MongooseTimestamp } from "../utils";

export type UserRole = "admin";

export interface RefreshToken {
  token: string;
  expiresAt: Date;
  user: User | Types.ObjectId;
  createdAt: Date;
}

export interface User extends MongooseTimestamp {
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  password: string;
}
