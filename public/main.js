
const url = "ws://localhost:8080";

let connected = false;
let socket;
let statusBar;
let contentBox;
let textInput;
let sendButton;
let openCloseButton;

function connect() {
  openCloseButton.setAttribute("disabled", true);
  statusBar.textContent = "Conectando...";

  // Create socket
  socket = new WebSocket(url, "echo-protocol");

  // Socket open event handler
  socket.addEventListener("open", function() {
    connected = true;
    statusBar.textContent = "Conectado";
    textInput.removeAttribute("disabled");
    sendButton.removeAttribute("disabled");
    openCloseButton.removeAttribute("disabled");
    openCloseButton.setAttribute("value", "Desconectarse");
  });

  // Socket close event handler
  socket.addEventListener("close", function() {
    connected = false;
    statusBar.textContent = "Desconectado";
    textInput.value = "";
    textInput.setAttribute("disabled", true);
    sendButton.setAttribute("disabled", true);
    openCloseButton.setAttribute("value", "Conectarse");
    openCloseButton.removeAttribute("disabled");
  });

  // Socket message event handler
  socket.addEventListener("message", function(messageEvent) {
    const newMessage = document.createElement("div");
    newMessage.textContent = messageEvent.data;
    contentBox.appendChild(newMessage);
    contentBox.scrollTop = contentBox.scrollHeight;
  });

  // Socket error event handler
  socket.addEventListener("error", function(event) {
    statusBar.textContent = "Error: " + event;
  });
}

function disconnect() {
  socket.close();
}

function send() {
  const message = textInput.value;
  textInput.value = "";
  socket.send(message);
}

window.addEventListener("load", function() {

  // Get HTML elements
  statusBar = this.document.getElementById("chat-status-bar");
  contentBox = this.document.getElementById("chat-content-box");
  textInput = this.document.getElementById("chat-input-text");
  sendButton = this.document.getElementById("chat-input-send");
  openCloseButton = this.document.getElementById("chat-input-open-close");

  // Open/close button handler
  openCloseButton.addEventListener("click", function() {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  });

  // Send button handler
  sendButton.addEventListener("click", send);

});
