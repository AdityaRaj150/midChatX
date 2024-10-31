const { Server } = require("socket.io");
const { createServer } = require("http");
const { v4 } = require("uuid");
require("dotenv").config()
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
httpServer.listen(process.env.PORT || 3000, () => console.log("server runnig on port 3000"));

const getRoomMemberCount = (roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

let allData = {};

let allRooms = [];

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join-room", (room) => {
    socket.join(room);
    io.to(room).emit(room, allData[room].data);
  });

  socket.emit("fetch-room", allRooms);

  socket.on("create-room", (roomData) => {
    allData[roomData] = { host: socket.id, data: [] };
    allRooms.push({ host: socket.id, room: roomData, roomId: v4() });
    console.log(allData);
    socket.emit("fetch-room", allRooms);
  });

  socket.on("room-msg-from-client", (data) => {
    const roomId = data.room;
    const msgData = { id: socket.id, ...data.msg };
    allData[roomId].data.push(msgData);
    console.log(allData);
    io.to(roomId).emit(roomId, allData[roomId].data);
  });

  socket.on("delete-room", (room_Id) => {
    allRooms = allRooms.filter(({ roomId }) => roomId != room_Id);
    socket.emit("fetch-room", allRooms);
    //edit alldata as well
  });
  socket.on("disconnect", () => {
    const roomMemberCnt = getRoomMemberCount("Room1");
    console.log(roomMemberCnt);
  });
});
