/**
 * Cliente del chat.
 */
let connected = false;
let socket;
let errorAlert;
let errorText;
let urlInput;
let statusText;
let contentBox;
let nameInput;
let textInput;
let sendButton;
let openCloseButton;

/**
 * Arma el HTML para mostrar un mensaje.
 */
function createMessageHtml(user, text) {
  const messageTitle = document.createElement("h6");
  const messageText = document.createElement("div");
  const messageBody = document.createElement("div");
  const messageCard = document.createElement("div");

  messageText.textContent = text;
  messageTitle.textContent = user + " dice:"
  messageTitle.className = "card-subtitle text-body-secondary";
  messageBody.className = "card-body";
  messageCard.className = "card mb-2";
  messageBody.appendChild(messageTitle);
  messageBody.appendChild(messageText);
  messageCard.appendChild(messageBody);

  if (nameInput.value === user) {
    messageTitle.classList.add("text-end");
    messageText.classList.add("text-end");
  }

  return messageCard;
}

/**
 * Se conecta al servidor del chat.
 */
function connect() {
  if (urlInput.value.length == 0)
    return alert("Ingresar URL");
  if (nameInput.value.length == 0)
    return alert("Ingresar nombre");

  urlInput.setAttribute("disabled", true);
  nameInput.setAttribute("disabled", true);
  openCloseButton.setAttribute("disabled", true);
  statusText.textContent = "Conectando...";

  socket = new WebSocket(urlInput.value, "echo-protocol");

  socket.addEventListener("open", function() {
    connected = true;
    errorAlert.classList.add("collapse");
    errorAlert.classList.remove("show");
    statusText.textContent = "Conectado";
    statusText.className = "badge rounded-pill text-bg-success";
    openCloseButton.className = "btn btn-danger";
    openCloseButton.textContent = "Desconectarse";
    openCloseButton.removeAttribute("disabled");
    sendButton.removeAttribute("disabled");
    textInput.removeAttribute("disabled");
    textInput.focus();
  });

  socket.addEventListener("close", function() {
    connected = false;
    statusText.textContent = "Desconectado";
    statusText.className = "badge rounded-pill text-bg-danger";
    textInput.value = "";
    textInput.setAttribute("disabled", true);
    sendButton.setAttribute("disabled", true);
    openCloseButton.removeAttribute("disabled");
    openCloseButton.className = "btn btn-success";
    openCloseButton.textContent = "Conectarse";
    nameInput.removeAttribute("disabled");
    urlInput.removeAttribute("disabled");
  });

  socket.addEventListener("message", function(messageEvent) {
    const message = JSON.parse(messageEvent.data);
    const messageHtml = createMessageHtml(message.usr, message.txt);
    contentBox.appendChild(messageHtml);
    contentBox.scrollTop = contentBox.scrollHeight;
  });

  socket.addEventListener("error", function(event) {
    errorText.textContent = "Error: " + event;
    errorAlert.className = "alert alert-danger alert-dismissible fade show";
  });
}

/**
 * Se desconecta del servidor.
 */
function disconnect() {
  socket.close();
}

/**
 * Envía el mensaje al servidor.
 */
function send() {
  if (textInput.value.length == 0)
    return;

  const message = { usr: nameInput.value, txt: textInput.value };
  textInput.value = "";
  socket.send(JSON.stringify(message));
}

window.addEventListener("load", function() {
  urlInput = this.document.getElementById("chat-input-url");
  errorAlert = this.document.getElementById("chat-error-alert");
  errorText = this.document.getElementById("chat-error-text");
  statusText = this.document.getElementById("chat-status-text");
  contentBox = this.document.getElementById("chat-content-box");
  nameInput = this.document.getElementById("chat-input-name");
  textInput = this.document.getElementById("chat-input-text");
  sendButton = this.document.getElementById("chat-input-send");
  openCloseButton = this.document.getElementById("chat-input-open-close");

  openCloseButton.addEventListener("click", function() {
    if (connected)
      disconnect();
    else
      connect();
  });

  sendButton.addEventListener("click", send);
  textInput.addEventListener("keydown", function(keyboardEvent) {
    if (keyboardEvent.key === "Enter")
      sendButton.click();
  });

  nameInput.value = "Usuario#" + Math.floor(Math.random() * 2**16);
});
