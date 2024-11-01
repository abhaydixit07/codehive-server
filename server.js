// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);

// // Setup Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your client URL
//     methods: ["GET", "POST"],
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Track users in rooms
// const rooms = {}; // Example structure: { roomId: { userId: { code: "", cursorPosition: null } } }

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("join_room", (roomId) => {
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room ${roomId}`);

//     if (!rooms[roomId]) {
//       rooms[roomId] = {};
//     }
//     rooms[roomId][socket.id] = { code: "", cursorPosition: null };

//     // Broadcast the updated list of users in the room
//     io.in(roomId).emit("update_users", Object.keys(rooms[roomId]));
//   });

//   socket.on("code_change", ({ roomId, code, cursorPosition }) => {
//     if (rooms[roomId] && rooms[roomId][socket.id]) {
//       rooms[roomId][socket.id].code = code;
//       rooms[roomId][socket.id].cursorPosition = cursorPosition;

//       // Broadcast the code change to other users in the same room
//       socket.to(roomId).emit("receive_code_change", { code, cursorPosition });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);

//     for (const roomId in rooms) {
//       if (rooms[roomId][socket.id]) {
//         delete rooms[roomId][socket.id];
//         io.in(roomId).emit("update_users", Object.keys(rooms[roomId]));

//         if (Object.keys(rooms[roomId]).length === 0) {
//           delete rooms[roomId];
//         }
//         break;
//       }
//     }
//   });
// });

// // API route to check server status
// app.get("/", (req, res) => {
//   res.send("Server is up and running!");
// });

// // Start the server
// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Track users and their states in rooms
const rooms = {}; // Structure: { roomId: { userId: { code: "", cursorPosition: { lineNumber: number, column: number } } } }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }

    rooms[roomId][socket.id] = { code: "", cursorPosition: null };

    // Send current room state to the new user
    socket.emit("initial_data", { code: rooms[roomId][socket.id].code, users: Object.keys(rooms[roomId]) });

    // Broadcast the updated list of users in the room
    io.in(roomId).emit("update_users", Object.keys(rooms[roomId]));
  });

  socket.on("code_change", ({ roomId, code, cursorPosition }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      // Update the user's code and cursor position
      rooms[roomId][socket.id].code = code;
      rooms[roomId][socket.id].cursorPosition = cursorPosition;

      // Broadcast the code change and cursor position to other users in the same room
      socket.to(roomId).emit("receive_code_change", { code, cursorPosition });
    }
  });

  socket.on("cursor_position_change", ({ roomId, cursorPosition }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      // Update the user's cursor position only
      rooms[roomId][socket.id].cursorPosition = cursorPosition;

      // Broadcast the cursor position change to other users in the room
      socket.to(roomId).emit("receive_cursor_position", { userId: socket.id, cursorPosition });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        io.in(roomId).emit("update_users", Object.keys(rooms[roomId]));

        if (Object.keys(rooms[roomId]).length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

// API route to check server status
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
