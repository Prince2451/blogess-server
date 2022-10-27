import { pbkdf2, randomBytes } from "crypto";
import { Model, model, Schema } from "mongoose";
import { promisify } from "util";
import { auth } from "../../typings";

interface UserStatics {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hasedPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<
  auth.User,
  Model<auth.User>,
  {},
  {},
  {},
  UserStatics
>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin"],
    required: true,
  },
});

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

const User = model("User", userSchema);

export default User;
