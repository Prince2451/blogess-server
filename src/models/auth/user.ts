import { model, Schema } from "mongoose";
import { auth } from "../../typings";

const userSchema = new Schema<auth.User>({
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

const User = model("User", userSchema);

export default User;
