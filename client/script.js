import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

const from = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
});

from.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
    input.style.height = "1.5rem";
  }
});

input.addEventListener("input", (event) => {
  const element = event.target;
  element.style.height = "auto";
  const newHeight = Math.min(element.scrollHeight, 225);
  console.log(newHeight);
  element.style.height = `${newHeight}px`;
});
