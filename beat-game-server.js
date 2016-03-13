var io;
var gs;

module.exports = {
  initGame: function(req, res) {
    io = req;
    gs = res;
    gs.emit('connected', { message: "beat-game-server init call." });
    // host events
    gs.on('hostCreateNewGame', hostCreateNewGame);
    gs.on('hostPrepGame', hostPrepareGame);
    gs.on('countdownFinished', hostStartGame);
    gs.on('hostNextRound', hostNextRound);
    // player events
    gs.on('playerJoinGame', playerJoinGame);
    gs.on('playerAnswer', playerAnswer);
  }
};

//===================
// host functions
//===================
function hostCreateNewGame() {
    console.log('server hostCreateNewGame function called');
    // return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    gs.emit('newGameCreated', {mySocketId: gs.id});
};

// triggered when room is full (8 people)
function hostPrepareGame(gameId) {
    var socket = this;
    var data = {
        mySocketId : socket.id
    };
    io.sockets.emit('beginNewGame', data);
};

// Start game!
function hostStartGame(gameId) {
    console.log('Game Started.');
    sendRiddle(0, gameId);
};

// When correct guess, move on to next round
function hostNextRound(data) {
    if(data.round < riddlePool.length ){
        // Send a new set of words back to the host and players.
        sendRiddle(data.round, data.gameId);
    } else {
        // If the current round exceeds the number of words, send the 'gameOver' event.
        io.sockets.in(data.gameId).emit('gameOver',data);
    }
}


//===================
// Player functions
//===================

function playerJoinGame(data) {
    console.log('new player registered');
    // A reference to the player's Socket.IO socket object
    var socket = this;
    // // Look up the room ID in the Socket.IO manager object.
    // var room = gs.rooms['' + data.gameId];
    // console.log(data.gameId);
    // console.log(gs.rooms);
    // console.log('room', room);
    // // If the room exists...
    // if( room != undefined ){
    //     // attach the socket id to the data object.
    //     data.mySocketId = socket.id;
    //     // Join the room
    //     socket.join(data.gameId);
    //     // Emit an event notifying the clients that the player has joined the room.
    //     io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
    // } else {
    //     // Otherwise, send an error message back to the player.
    //     // this.emit('error', {message: "This room does not exist."} );
    // }
    data.mySocketId = socket.id;
    io.sockets.emit('playerJoinedRoom', data);
};

// Check answer
function playerAnswer(data) {
    // Emit an event with the answer so it can be checked by the 'Host'
    io.sockets.in(data.gameId).emit('hostCheckAnswer', data);
}


//===================
// Game Logic
//===================

function sendRiddle(index, gameId) {
    var data = {
      riddle: riddlePool[index][0],
      question: riddlePool[index][1],
      answer: riddlePool[index][2],
      gameId: gameId,
      round: index + 1
    }
    io.sockets.in(data.gameId).emit('newRiddleData', data);
    console.log(data.gameId);
}


var riddlePool = [
  ['- Poor people have it. Rich people need it. If you eat it you die. - ', 'What is it?', 'Nothing'],
  ['- If I drink, I die. If I eat, I am fine. -', 'What am I?', 'Fire'],
  ['- What word becomes shorter when you add two letters to it? -', '', 'Short'],
  ['- If I have it, I don’t share it. If I share it, I don’t have it. -', 'What is it?', 'Secrets']
]
