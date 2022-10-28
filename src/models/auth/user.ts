import { pbkdf2, randomBytes } from "crypto";
import { Secret, sign, SignOptions } from "jsonwebtoken";
import { Model, model, Schema, Types } from "mongoose";
import { promisify } from "util";
import { auth } from "../../typings";
import { JWT_EXPIRY } from "../../utils/constants";

interface UserStatics {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hasedPassword: string) => Promise<boolean>;
  createAccessToken: (id: Types.ObjectId, email: string) => Promise<string>;
}

const userSchema = new Schema<
  auth.User,
  Model<auth.User>,
  {},
  {},
  {},
  UserStatics
>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.hashPassword = async function (password) {
  const salt = (await promisify(randomBytes)(16)).toString("hex");
  return (
    (await promisify(pbkdf2)(password, salt, 1000, 64, "sha512")).toString(
      "hex"
    ) +
    "." +
    salt
  );
};

userSchema.statics.verifyPassword = async function (password, hasedPassword) {
  const [storedHash, salt] = hasedPassword.split(".");
  const hash = (
    await promisify(pbkdf2)(password, salt, 1000, 64, "sha512")
  ).toString("hex");
  return storedHash === hash;
};

userSchema.statics.createAccessToken = async function (id, email) {
  return await promisify<object, Secret, SignOptions, string>(sign)(
    { email, id },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

const User = model("User", userSchema);

export default User;
