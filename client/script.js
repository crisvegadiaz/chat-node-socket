import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js";

const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const emojiButton = document.getElementById("emoji-button");

// Configurar Emoji Button
const picker = new EmojiButton({
  theme: "dark",
  emojiSize: "34px",
  emojisPerRow: 5,
  rows: 5,
});

emojiButton.addEventListener("click", () => {
  picker.togglePicker(emojiButton);
});

picker.on("emoji", (selection) => {
  input.value += selection.emoji; // Accede al emoji como texto
});

// Ajustar altura del textarea
input.addEventListener("input", (event) => {
  const element = event.target;
  element.style.height = "auto";
  const newHeight = Math.min(element.scrollHeight, 225);
  element.style.height = `${newHeight}px`;
});

// Recibir mensajes desde el servidor
socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Enviar mensaje
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat message", input.value); // Enviar al servidor
    input.value = "";
  }
});
