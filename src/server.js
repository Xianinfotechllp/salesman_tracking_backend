const http = require("http");
const app = require("./app");
const initializeSocket = require("./services/socket/socket");
// const scheduleOutstandingDue = require("./jobs/outstaningDue");

const PORT = process.env.PORT || 3000;


const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Cron Job
// scheduleOutstandingDue();

server.listen(PORT, () => {
  console.log(`Server running @ PORT:${PORT}`);
});
