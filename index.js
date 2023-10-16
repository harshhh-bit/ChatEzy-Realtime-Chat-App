// Node Server which will handle socket io connections
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

const users = {};

app.use(express.static(join(__dirname, "public")));



io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;

    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);

    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
