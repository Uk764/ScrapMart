import { io } from "socket.io-client";


export const socket = io("https://scrapmart-backend.onrender.com", {
    transports: ['websocket'], // optional, can fix some polling issues
    withCredentials: true
  });
