const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("create_room", (callback) => {
    const roomId = uuidv4();
    rooms[roomId] = {
      users: {},
      code: "",
      hostId: socket.id,
    };
    callback(roomId);
  });

  socket.on("join_room", ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      socket.emit("room_not_found");
      return;
    }

    socket.join(roomId);

    rooms[roomId].users[socket.id] = {
      userName,
      videoEnabled: true,
      audioEnabled: true,
      code: rooms[roomId].code || "",
      cursorPosition: null,
    };
    socket.emit("initial_room_data", {
      code: rooms[roomId].code,
      users: rooms[roomId].users,
    });
    socket.to(roomId).emit("user_joined", {
      userId: socket.id,
      userName,
      users: rooms[roomId].users,
    });
  });

  socket.on("code_change", ({ roomId, code, cursorPosition }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].code = code;
      rooms[roomId].users[socket.id].cursorPosition = cursorPosition;

      socket.to(roomId).emit("receive_code_change", {
        code,
        cursorPosition,
        userId: socket.id,
      });
    }
  });

  socket.on("cursor_position_change", ({ roomId, cursorPosition }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].users[socket.id].cursorPosition = cursorPosition;

      socket.to(roomId).emit("receive_cursor_position", {
        userId: socket.id,
        cursorPosition,
      });
    }
  });
  socket.on("sending_signal", ({ userToSignal, signal, roomId }) => {
    io.to(userToSignal).emit("user_joined_with_signal", {
      signal,
      callerID: socket.id,
      userName: rooms[roomId]?.users[socket.id]?.userName,
    });
  });

  socket.on("returning_signal", ({ signal, callerID }) => {
    io.to(callerID).emit("receiving_returned_signal", {
      signal,
      id: socket.id,
    });
  });
  socket.on("toggle_video", ({ roomId, enabled }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].users[socket.id].videoEnabled = enabled;
      socket.to(roomId).emit("user_toggled_video", {
        userId: socket.id,
        enabled,
      });
    }
  });

  socket.on("toggle_audio", ({ roomId, enabled }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].users[socket.id].audioEnabled = enabled;
      socket.to(roomId).emit("user_toggled_audio", {
        userId: socket.id,
        enabled,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      if (rooms[roomId].users[socket.id]) {
        delete rooms[roomId].users[socket.id];

        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
        } else {
          socket.to(roomId).emit("user_left", {
            userId: socket.id,
            users: rooms[roomId].users,
          });
        }
        break;
      }
    }
  });
});

// Basic health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
