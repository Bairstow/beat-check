var _ = require('lodash');
var gameChecker = require('./lib/gameChecker');

var data = {
  io: null,
  games: {},
  MAXPLAYERS: 8,
  ROOMCODELENGTH: 3
};

var func = {
  initGameListeners: function(socket) {
    socket.on('logSocket', listener.logSocket);
    socket.on('hostNewGame', listener.hostNewGame);
    socket.on('joinGameRequest', listener.joinGameRequest);
    socket.on('beginGame', listener.beginGame);
    socket.on('submitGuess', listener.submitGuess);
  },
  generateRoomCode: function() {
    // generate a unique room code for the game
    var roomCode = '';
    var alphas = _.range(
      'A'.charCodeAt(0),
      'Z'.charCodeAt(0)
    );
    for (var i = 0; i < data.ROOMCODELENGTH; i++) {
      roomCode += String.fromCharCode(_.sample(alphas));
    }
    // check that roomCode is unique for current games
    var games = Object.keys(data.games)
    _(games).forEach(function(game) {
      if (roomCode === game) {
        // condition matching code found in active game list make recursive call to generate new code.
        roomCode = generateRoomCode();
      }
    });
    return roomCode;
  },
  newGameRound: function(room) {
    // grab the current game data
    var currGame = data.games[room];
    // generate the target letter for the round
    var alphas = _.range(
      'A'.charCodeAt(0),
      'Z'.charCodeAt(0)
    );
    currGame.roundLetter = String.fromCharCode(_.sample(alphas));
    // reset player guesses
    var currPlayers = Object.keys(currGame.playerData);
    _(currPlayers).forEach(function(player) {
      currGame.playerData[player].roundGuess = null;
      currGame.playerData[player].roundResult = null;
    });
    console.log('Beginning round num: ' + currGame.roundNumber + ' with target letter: ' + currGame.roundLetter);
    // generate round details broadcast new round message to all room clients
    data.io.sockets.to(room).emit('newRound', currGame);
  },
  checkGuess: function(guessData) {
    console.log('Checking guess: ', guessData.guess);
    var currGame = data.games[guessData.room];
    var currPlayers = Object.keys(currGame.playerData);
    gameChecker(guessData.guess, function(result) {
      console.log('Results for guess: ' + guessData.guess + ' are:');
      console.log(result);
      // assign result to appropriate player data
      currGame.playerData[guessData.playerId].roundResult = result;
      // if last active player with submitted guess returns trigger end of round function.
      var allResultsCollected = true;
      _(currPlayers).forEach(function(player) {
        if (currGame.playerData[player].roundGuess !== null && currGame.playerData[player].roundResult === null) {
          allResultsCollected = false;
        }
      });
      if (allResultsCollected) {
        // trigger end of round conditions
        console.log('All results collected for submitted guesses this round.');
        func.endGameRound(guessData.room);
      }
    });
  },
  endGameRound: function(room) {
    
  }
};

var listener = {
  logSocket: function(eventData) {
    console.log('--------------------------------------------------------------');
    console.log('Server log socket request from client id: ', eventData.clientId);
    console.log('Number of active games: ', data.gameList.length);
    console.log('--------------------------------------------------------------');
    if (data.io.sockets.connected['/#' + eventData.clientId].connected) {
      data.io.to('/#' + eventData.clientId).emit('logBack', 'Socket logged successfully.');
    }
  },
  hostNewGame: function(eventData) {
    var socket = this;
    // new games are added to the data.game structure and accessed via the host socket.id
    var newRoomCode = func.generateRoomCode();
    console.log('New game creation call from host with id: ', eventData.hostId);
    console.log('New game room code generated: ', newRoomCode);
    // make new game data model and push to list of existing games.
    var newGame = {
      hostId: eventData.hostId,
      playerData: {},
      roundNumber: 0,
      roundLetter: '',
      gameStatus: 'waiting'
    };
    data.games[newRoomCode] = newGame;
    socket.join(newRoomCode);
    data.io.sockets.to(newRoomCode).emit('gameCreated', {
      gameData: newGame,
      roomCode: newRoomCode
    });
  },
  joinGameRequest: function(eventData) {
    console.log('Request to join room: ' + eventData.room + ' by player: ' + eventData.playerName);
    // handle player connection requests
    var socket = this;
    var targetGame = null;
    // check if requested game exists
    if (data.games[eventData.room]) {
      targetGame = data.games[eventData.room];
      // check if game is available to join
      var currPlayers = Object.keys(targetGame.playerData);
      if (currPlayers.length < data.MAXPLAYERS && targetGame.gameStatus === 'waiting') {
        // add player to game, game channel and send back confirmation
        targetGame.playerData[eventData.socketId] = { playerName: eventData.playerName };
        socket.join(eventData.room);
        socket.emit('confirmJoin', { room: eventData.room });
        // update gamedata to reflect player addition
        data.io.sockets.to(eventData.room).emit('gameStateUpdate', targetGame);
        // if player limit has been reached then automatically begin the game.
        // to be added!
      } else {
        // handle requests to full or active games
        socket.emit('unableToJoin', "Sorry we can't get you in there this time...");
      }
    } else {
      // handle requests to games that don't exist
      socket.emit('unableToJoin', "Sorry no dice... Sure that game exists?");
    }
  },
  beginGame: function(eventData) {
    // check the begin game event submitted only by the host and has more than one player
    var currGame = data.games[eventData.room];
    var currPlayers = Object.keys(currGame.playerData);
    if (currGame.hostId === eventData.hostId && currPlayers.length >= 1) {
      console.log('Received request to begin game in room: ' + eventData.room);
      // emit new round information to room
      currGame.gameStatus = 'active';
      currGame.roundNumber = 1;
      // set all players to active status. to be changed to eliminated as game progresses
      var currPlayers = Object.keys(currGame.playerData);
      for (var i = 0; i < currPlayers.length; i++) {
        currGame.playerData[currPlayers[i]].gameStatus = 'active';
      }
      data.io.sockets.to(eventData.room).emit('gameStateUpdate', currGame);
      func.newGameRound(eventData.room);
    }
  },
  submitGuess: function(eventData) {
    // grab copy of game data submit was made from
    var currGame = data.games[eventData.room];
    // check if guess already logged for that player and only can submit until all active players have finished guessing
    var currPlayers = Object.keys(currGame.playerData);
    var allActiveGuessed = true;
    _(currPlayers).forEach(function(player) {
      if (currGame.playerData[player].gameStatus === 'active' && currGame.playerData[player].roundGuess === null) {
        allActiveGuessed = false;
      }
    });
    _(currPlayers).forEach(function(player) {
      if (player === eventData.playerId && currGame.playerData[player].roundGuess === null && !allActiveGuessed) {
        // player hasn't yet submitted a guess for this round. append info to and call a checking function
        currGame.playerData[player].roundGuess = eventData.guess;
        data.io.sockets.to(eventData.room).emit('gameStateUpdate', currGame);
        func.checkGuess(eventData);
      }
    });
  }
}

module.exports = {
  data: data,
  func: func,
  listener: listener
}
