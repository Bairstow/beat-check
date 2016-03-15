var $ = require('jquery');

var data = {
  socket: io.connect(),
  socketId: null,
  room: null,
  role: null,
  gameData: null,
  players: [],
  instructions: ''
};

var func = {
  initGameBindings: function() {
    data.socket.on('connected', listener.connected);
    data.socket.on('logBack', listener.logBack);
    data.socket.on('gameCreated', listener.gameCreated);
    data.socket.on('confirmJoin', listener.confirmJoin);
    data.socket.on('unableToJoin', listener.unableToJoin);
    data.socket.on('gameStateUpdate', listener.gameStateUpdate);
    data.socket.on('newRound', listener.newRound);
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
    if (data.role === 'host') {
      data.gameData = eventData;
      // update player data list
      var newplayerData = [];
      var currPlayers = Object.keys(data.gameData.playerData);
      for (var i = 0; i < currPlayers.length; i++) {
        newplayerData.push({
          playerName: data.gameData.playerData[currPlayers[i]].playerName,
          playerId: currPlayers[i]
        });
      }
      data.players = newplayerData;
    }
  },
  newRound: function(eventData) {
    // logic for the host client
    if (eventData.hostId === data.socketId) {
      // #logic
    }
    // at the beginning of the new round display the round letter for players to guess.
    data.instructions = 'Artist letter for round ' + eventData.roundNumber + ' is: ' + eventData.roundLetter;
    // check if receiving client is one of the players
    var playerFound = false;
    var currPlayers = Object.keys(eventData.playerData);
    for (var i = 0; i < currPlayers.length; i++) {
      if (currPlayers[i] === data.socketId) { playerFound = true; }
    }
    if (playerFound) {
      console.log('New Round');
      // make sure that player registration is hidden from the player
      $('#player-reg').css('display', 'none');
      $('#playerArtistInput').val('');
      $('#player-board').css('display', 'block');
    }
  }
};

module.exports = {
  data: data,
  func: func,
  listener: listener
};
