import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user has connected!");

  socket.on("disconnect", () => {
    console.log("an user has disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

app.use(morgan("dev"));

app.use(express.static(process.cwd() + "/client"));

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
