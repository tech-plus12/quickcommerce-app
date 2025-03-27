import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "https://ecom-backend.plusdistribution.in/";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  forceNew: true,
  reconnectionAttempts: 10,
  timeout: 5000,
});

export default socket;
