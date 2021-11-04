import { container } from "tsyringe";
import { io } from "../http";
import { ChatRoom } from "../schemas/ChatRoom";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetChatRoomByIdService } from "../services/GetChatRoomByIdService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";

io.on("connect", (socket) => {
  socket.on("start", async (data) => {
    const { email, avatar, name } = data;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email, 
      avatar, 
      name,
      socketId: socket.id,
    });

    
    socket.broadcast.emit("new_users", user);
  });

  socket.on("get_users", async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService);

    const users = await getAllUsersService.execute();

    callback(users);
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
    const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);

    let room: ChatRoom;

    const user = await getUserBySocketIdService.execute(socket.id);

    const idUsers = [data.idUser, user._id];

    const roomAlreadyExists = await getChatRoomByUsersService.execute(idUsers);

    if (roomAlreadyExists) {
      room = roomAlreadyExists;
    }
    else {
      room = await createChatRoomService.execute(idUsers);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesByChatRoomService.execute(room.idChatRoom);

    callback({ room, messages });
  });

  socket.on("message", async (data) => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

    const { message: text, idChatRoom } = data;

    const user = await getUserBySocketIdService.execute(socket.id);
    const room = await getChatRoomByIdService.execute(idChatRoom);
    const userFrom = room.idUsers.find(item => String(item._id) !== String(user._id));

    const message = await createMessageService.execute({
      to: user._id,
      text,
      roomId: idChatRoom
    });

    io.to(idChatRoom).emit("message", {
      message,
      user
    });

    io.to(userFrom.socketId).emit("notification", {
      newMessage: true,
      from: user,
      roomId: idChatRoom
    });
  });
});