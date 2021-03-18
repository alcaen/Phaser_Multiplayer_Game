// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
const {
    disconnect
} = require('process');
var socketIO = require('socket.io');

var port = 8080;
var players = {};
// Instancing
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', port);
// 
app.use('/public', express.static(__dirname + '/public'))

server.listen(port, function() {
    console.log("I'm listening");
});

app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, 'landing.html'))
});

io.on('connection', function(socket) {
    console.log('Someone Connected ' + String(socket.id));
    players[socket.id] = {
        player_id: socket.id,
        x: 500,
        y: 500,
    };
    socket.emit('actualPlayers', players);

    socket.broadcast.emit('new_player', players[socket.id]);

    // When player moves send data to others
    socket.on('player_moved', function(movement_data) {
        players[socket.id].x = movement_data.x;
        players[socket.id].y = movement_data.y;
        players[socket.id].angle = movement_data.angle;

        // Send To All Players
        socket.broadcast.emit('enemy_moved', players[socket.id]);
    });
    socket.on('new_bullet', function(bullet_data) {
        socket.emit('new_bullet', bullet_data);
        socket.broadcast.emit('new_bullet', bullet_data);
    });

    socket.on('disconnect', function() {
        console.log('Someone Disconnected ' + String(socket.id));
        delete players[socket.id];
        socket.broadcast.emit('player_disconnect', socket.id);
    });

});