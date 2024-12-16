import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js";

const socket = io({
  auth:{
    serverOffset:0
  }
});

const chat = document.querySelector(".chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const emojiButton = document.getElementById("emoji-button");
const windowButton = document.getElementById("fullscreen-button");


function getOS() {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf("Android") !== -1) return "Android"; // Verificar Android primero
  if (userAgent.indexOf("like Mac") !== -1) return "iOS";
  if (userAgent.indexOf("Win") !== -1) return "Windows";
  if (userAgent.indexOf("Mac") !== -1) return "MacOS";
  if (userAgent.indexOf("X11") !== -1 || userAgent.indexOf("Linux") !== -1) return "Linux";

  return "Unknown OS";
}

// Configurar Emoji Button
const picker = new EmojiButton({
  emojiSize: "34px",
  emojisPerRow: 5,
  rows: 5,
  autoHide: false,
  styleProperties: {
    '--background-color': '#1b1b3a',
    '--category-button-color': '#99AABB',
    '--text-color':'#fff'
  }
});

emojiButton.addEventListener("click", () => {
  picker.togglePicker(emojiButton);
});

picker.on("emoji", (selection) => {
  input.value += selection.emoji;
});

// Ajustar altura del textarea
input.addEventListener("input", (event) => {
  const element = event.target;
  element.style.height = "auto";
  const newHeight = Math.min(element.scrollHeight, 225);
  element.style.height = `${newHeight}px`;
});

input.addEventListener("focus", () => {
  if(getOS() == "Android" || getOS() == "iOS"){
    chat.classList.add("chat-adjusted");
  }
});

input.addEventListener("blur", () => {
  if(getOS() == "Android" || getOS() == "iOS"){
    setTimeout(() => {
      chat.classList.remove("chat-adjusted");
    }, 100);
  }
});

// Recibir mensajes desde el servidor
socket.on("chat message", (msg, serverOffset) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  socket.auth.serverOffset = serverOffset;

  messages.scrollTop = messages.scrollHeight;
  input.placeholder = "Escribe aquí...";
  input.classList.remove("input-error")
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión con el servidor:", err.message);
  input.classList.add("input-error");
  input.placeholder = `Error de conexión con el servidor...`;
});

socket.on("disconnect", () => {
  input.classList.add("input-error");
  input.placeholder = `Desconectado del servidor. Intentando reconectar...`;
});

// Enviar mensaje
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat message", input.value);
    input.value = "";
    input.style.height = `77px`;
  }
});

windowButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error al intentar entrar en pantalla completa: ${err.message}`
      );
    });
  } else {
    document.exitFullscreen();
  }
});
