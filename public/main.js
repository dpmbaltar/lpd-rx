
const url = "ws://localhost:8080";

let connected = false;
let socket;
let statusText;
let contentBox;
let nameInput;
let textInput;
let sendButton;
let openCloseButton;

function connect() {
  nameInput.setAttribute("disabled", true);
  openCloseButton.setAttribute("disabled", true);
  statusText.textContent = "Conectando...";

  // Create socket
  socket = new WebSocket(url, "echo-protocol");

  // Socket open event handler
  socket.addEventListener("open", function() {
    connected = true;
    statusText.textContent = "Conectado";
    textInput.removeAttribute("disabled");
    sendButton.removeAttribute("disabled");
    openCloseButton.removeAttribute("disabled");
    openCloseButton.className = "btn btn-danger";
    openCloseButton.textContent = "Desconectarse";
  });

  // Socket close event handler
  socket.addEventListener("close", function() {
    connected = false;
    statusText.textContent = "Desconectado";
    textInput.value = "";
    textInput.setAttribute("disabled", true);
    sendButton.setAttribute("disabled", true);
    openCloseButton.removeAttribute("disabled");
    openCloseButton.className = "btn btn-success";
    openCloseButton.textContent = "Conectarse";
    nameInput.removeAttribute("disabled");
  });

  // Socket message event handler
  socket.addEventListener("message", function(messageEvent) {
    const message = JSON.parse(messageEvent.data);
    const messageCard = document.createElement("div");
    const messageBody = document.createElement("div");

    messageBody.textContent = message.usr + ' dice: ' + message.txt;
    messageBody.className = "card-body";
    messageCard.className = "card mb-2";
    messageCard.appendChild(messageBody);
    contentBox.appendChild(messageCard);
    contentBox.scrollTop = contentBox.scrollHeight;
  });

  // Socket error event handler
  socket.addEventListener("error", function(event) {
    statusText.textContent = "Error: " + event;
  });
}

function disconnect() {
  socket.close();
}

function send() {
  const name = nameInput.value;
  const text = textInput.value;
  const message = { usr: name, txt: text };
  textInput.value = "";
  socket.send(JSON.stringify(message));
}

window.addEventListener("load", function() {

  // Get HTML elements
  statusText = this.document.getElementById("chat-status-text");
  contentBox = this.document.getElementById("chat-content-box");
  nameInput = this.document.getElementById("chat-input-name");
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
