import app from "./src/app.js";
import ENV_CONFIG from "./src/config/env.config.js";
import { Server } from "socket.io";

const { port } = ENV_CONFIG;

const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

server.on("error", (err) => {
  switch (err.code) {
    case "EACCES":
      console.error("Require elevated privileges..");
      return process.exit(1);
    case "EADDRINUSE":
      console.error(`${port} is already in use..`);
      return process.exit(1);
    default:
      throw err;
  }
});

// Create socket server
//TODO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

//  Use socket events
io.on("connection", (socket) => {
  console.log("Socket Connection", socket.id);

  // console.log("Connection is established");
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log("User", email, "Joined Room", room);

    emailToSocketMapping.set(email, socket.id);
    socketToEmailMapping.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

io.listen(3000);

export default io;
