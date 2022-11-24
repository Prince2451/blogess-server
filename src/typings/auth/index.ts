import { DocRef, MongooseTimestamp } from "../utils";

export type UserRole = "admin";

export interface RefreshToken {
  token: string;
  expiresAt: Date;
  user: DocRef<User>;
  createdAt: Date;
}

export interface User extends MongooseTimestamp {
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  password: string;
}
