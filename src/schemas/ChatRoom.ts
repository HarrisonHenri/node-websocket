import { Document, model, Schema } from "mongoose";
import { v4 } from "uuid";
import { User } from "./User";

type ChatRoom = Document & {
  idUsers: User[];
  idChatRoom: string;
}

const ChatRoomSchema = new Schema({
  idUsers: [{ 
    type: String,
    ref: "Users"
  }],
  idChatRoom: {
    type: String, 
    default: v4
  }
})

const ChatRoom = model<ChatRoom>("ChatRooms", ChatRoomSchema);

export { ChatRoom }