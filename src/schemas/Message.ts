import { Document, model, Schema } from "mongoose";

type Message = Document & {
  to: string;
  text: string;
  createdAt: Date;
  roomId: string;
}

const MessageSchema = new Schema({
  to: { 
    type: String,
    ref: "Users"
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  roomId: { 
    type: String,
    ref: "Users"
  },
})

const Message = model<Message>("Messages", MessageSchema);

export { Message }