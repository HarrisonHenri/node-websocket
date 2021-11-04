import { Document, model, Schema } from "mongoose";

type User = Document & {
  email: string;
  socketId: string;
  avatar: string;
  name: string;
}

const UserSchema = new Schema({
  email: String,
  socketId: String,
  avatar: String,
  name: String,
})

const User = model<User>("Users", UserSchema);

export { User }