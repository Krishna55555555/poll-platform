const { Server } = require("socket.io");

let io;

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Join poll room
    socket.on("join_poll", (pollId) => {

      socket.join(pollId);

      console.log(`Socket joined poll room: ${pollId}`);

    });

    socket.on("disconnect", () => {

      console.log("User disconnected");

    });

  });

};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO
};