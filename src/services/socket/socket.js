const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

global.onlineUsers = new Map();
const SECRET_KEY = process.env.JWT_SECRET;

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.query.token; // Get token from query

    if (token) {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log("Invalid token, disconnecting user:", err.message);
          socket.disconnect(); // Disconnect if token is invalid
        } else {
          console.log("Decoded Token:", decoded); // Log the whole decoded token
          const userId = decoded.id; // Extract user ID
          onlineUsers.set(userId, socket.id); // Add to online users map
          console.log(`User ${userId} connected`);
        }
      });
    } else {
      console.log("No token found in connection request");
      socket.disconnect(); // Disconnect if no token is found
    }

    socket.on("send-msg", (data) => {
      console.log("Received Data:", data);

      // Correct validation to match frontend
      if (!data.receiverId || !data.senderId || !data.message) {
        console.log("Invalid message data received:", data);
        return;
      }

      const sendUserSocket = onlineUsers.get(data.receiverId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", {
          senderId: data.senderId,
          message: data.message,
        });
        console.log("Message sent to user", data.receiverId, ":", data.message);
      } else {
        console.log(`User ${data.receiverId} not connected`);
      }
    });

    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers.get(userId) === socket.id) {
          onlineUsers.delete(userId); // Remove the user from the online users map
          console.log(`Removed user ${userId} from online users map`);
          break;
        }
      }
    });
  });
};

module.exports = initializeSocket;
