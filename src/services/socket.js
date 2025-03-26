import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "http://192.168.1.129:3001/";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensure WebSocket transport is used
  forceNew: true,
  reconnectionAttempts: 10, // Retry connection
  timeout: 5000, // Timeout after 5 seconds
});

export default socket;
