import { io, server } from "./http";

import './websocket/ChatService';

server.listen(3000, () => console.log("Rocking 👶!"));

io.on("connection", (socket) => {
  console.log("Socket", socket.id);
});