let io;
exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:3000", "https://team-sync-five.vercel.app"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on("join_room", (room) => {
      console.log("i am joing room " + room);
      socket.join(room);
    });
    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (roomId, eventName, data) =>
  io.to(roomId).emit(eventName, ...data);

exports.getRooms = () => io.sockets.adapter.rooms;
