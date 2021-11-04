import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface CreateMessageService {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
class GetMessagesByChatRoomService {
  async execute (roomId: string) {
    const messages = await Message.find({ 
      roomId 
    }).populate("to").exec();

    return messages
  }
}

export { GetMessagesByChatRoomService }