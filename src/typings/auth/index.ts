import { Types } from "mongoose";

export type UserRole = "admin";

export interface RefreshToken {
  token: string;
  expiresAt: Date;
  user: User | Types.ObjectId;
  createdAt: Date;
}

export interface User {
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
