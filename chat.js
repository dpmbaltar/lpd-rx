const cron = require("node-cron");
const http = require("http");
const WebSocketServer = require("websocket").server;

const server = http.createServer(function(request, response) {
  console.log((new Date()) + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
}).listen(8080, function() {
  console.log((new Date()) + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on("request", function(request) {

  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
    return;
  }

  const connection = request.accept("echo-protocol", request.origin);
  console.log((new Date()) + " Connection accepted.");

  connection.on("message", function(message) {
    if (message.type === "utf8") {
      console.log("Received message: " + message.utf8Data);
      wsServer.broadcastUTF(message.utf8Data);
      /*let counter = 0;
      cron.schedule("* * * * * *", function() {
        counter++;
        connection.sendUTF("Message " + counter);
      });*/
    } else if (message.type === "binary") {
      console.log("Received Binary Message of " + message.binaryData.length + " bytes");
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on("close", function(reasonCode, description) {
    console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
  });

});
