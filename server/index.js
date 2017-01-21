var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var http = require('http');
var express = require('express');
var app = express();

var PORT = process.env.PORT || 5000;

var VISOR_INDEX = '/../visor/';
var SIMULATION_INDEX = '/../simulation/';

/**
 HTTP server
 Serves two HTML pages:
  - Simulation view on route /
  - Visor view on route /visor
**/

app.use('/', express.static(__dirname + SIMULATION_INDEX));
app.use('/visor', express.static(__dirname + VISOR_INDEX));

var server = http.createServer(app);
server.listen(PORT);

console.log('HTTP server listening on %d', PORT);
console.log('\nSIMULATION VIEW at http:/localhost:%d', PORT);
console.log('VISOR VIEW at http:/localhost:%d/visor', PORT);

/**
 Socket server
 Handles all comms:
  - Visor -> Simulation (movement, rotation etc)
  - Simulation -> Visor (time, triggers, etc)
**/

var wss = new WebSocketServer({server: server});
console.log('\nSocket server listening on port %d', PORT);

/**

 ON CONNECT
 - Acknowledge
 - Display status message

 ON MESSAGE
  - Determine sender ('visor' or 'simulation')
  - Broadcast accordingly

 ON CLOSE
  - Acknowledge
  - Display status message

**/

function encode(payload) {
  return (typeof payload !== 'string') ? JSON.stringify(payload) : payload;
}

wss.on('connection', function(ws) {

  function serverMsg(msg) {
    console.log('SERVER: ' + msg);
    broadcast({
      sender: 'SERVER',
      value: msg
    });
  }

  // Broadcast to all clients
  function broadcast(payload) {
    //console.log('BROADCAST', payload);
    wss.clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(encode(payload));
      }
    });
  }

  // Notify clients other than this one
  function relay(payload) {
    var m = JSON.stringify(payload);

    wss.clients.forEach(function(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(encode(payload));
      }
    });
  }

  // Respond to this client only
  function respond(payload) {
    ws.send(encode(payload));
  }

  // On incoming message, just bounce them back for now
  ws.on('message', function(msg) {
    relay(msg);
  });

  // On close, notify
  ws.on('close', function() {
    serverMsg('Client connection closed.');
  });

  serverMsg('Client connected, connection open.');
  console.log('CLIENTS ', wss.clients.length);
});