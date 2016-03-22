var $ = require('jquery');
var _ = require('lodash');

var data = {
  socket: io.connect(),
  socketId: null,
  room: null,
  role: null,
  gameData: null,
  gameStatus: null,
  players: []
};

var func = {
  initGameBindings: function() {
    data.socket.on('connected', listener.connected);
    data.socket.on('logBack', listener.logBack);
    data.socket.on('gameCreated', listener.gameCreated);
    data.socket.on('confirmJoin', listener.confirmJoin);
    data.socket.on('unableToJoin', listener.unableToJoin);
    data.socket.on('gameStateUpdate', listener.gameStateUpdate);
    data.socket.on('gameEnded', listener.gameEnded);
  },
  clickCreate: function() {
    console.log('Sending request to host new game.');
    data.socket.emit('hostNewGame', { hostId: data.socketId });
  },
  clickBegin: function() {
    console.log('Sending request from host to begin game');
    data.socket.emit('beginGame', {
      room: data.room,
      hostId: data.socketId
    });
  },
  clickExit: function() {
    // logic for handling host/player exiting the game.
  },
  logSocket: function() {
    console.log('Log socket call from client with socket ID: ', data.socketId);
    data.socket.emit('logSocket', { clientId: data.socketId });
  },
  submitGuess: function(guess) {
    console.log('Sending player guess: ', guess);
    data.socket.emit('submitGuess', {
      room: data.room,
      playerId: data.socketId,
      guess: guess
    });
  }
};

var listener = {
  connected: function(eventData) {
    // cache a copy of the client's socket.IO session ID
    data.socketId = data.socket.io.engine.id;
    console.log('Client connected with socket ID: ', data.socketId);
  },
  logBack: function(eventData) {
    console.log(eventData);
  },
  gameCreated: function(eventData) {
    console.log('New game created with room code: ', eventData.roomCode);
    data.room = eventData.roomCode;
    data.role = 'host';
    data.gameData = eventData.gameData;
    data.gameStatus = eventData.gameData.gameStatus;
  },
  confirmJoin: function(eventData) {
    console.log('Confirmed to join game: ', eventData.room);
    data.room = eventData.room;
    data.role = 'player';
    // update message to screen to let player know that they have joined
    $('#waitMsg').text("You're in! Waiting on game to start...");
  },
  unableToJoin: function(eventData) {
    console.log('Unable to join requested game.');
    $('#waitMsg').text(eventData);
  },
  gameStateUpdate: function(eventData) {
    console.log('Game state updated');
    // updating gameData, and gameStatus
    data.gameData = eventData;
    data.gameStatus = eventData.gameStatus
    // move player data to an array that can be iterated with vue player template
    var currPlayers = Object.keys(data.gameData.playerData);
    data.players = [];
    _(currPlayers).forEach(function(player) {
      data.players.push([
        player,
        data.gameData.playerData[player]
      ]);
    });
    // run conditional logic specific to certain game states.
  },
  gameEnded: function(eventData) {
    // emit an unsub event to the server to be removed from the game (so can then join further games)
    data.socket.emit('leaveRoom', {
      room: data.room,
      socketId: data.socketId
    });
    // reset the game data and game status.
    data.gameData = null;
    data.room = null;
    data.role = null;
    data.players = [];
    data.gameStatus = null;
  }
};

module.exports = {
  data: data,
  func: func,
  listener: listener
};
