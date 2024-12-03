import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

const from = document.getElementById("form");
const input = document.getElementById("input");

from.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});
