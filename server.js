const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, { cors: "*" });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("join-room", (roomId, userId) => {
      console.log("room joined", roomId, userId);
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);
    });

    socket.on("toggle-mute", (userId, roomId) => {
      socket?.broadcast.to(roomId).emit("toggle-mute", userId);
    });

    socket.on("toggle-video", (userId, roomId) => {
      socket?.broadcast.to(roomId).emit("toggle-video", userId);
    });
    socket.on("disconnect", () => {
      console.log("user discoinnded");
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
