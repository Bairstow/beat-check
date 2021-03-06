var _ = require('lodash');
var gameChecker = require('./lib/gameChecker');

var data = {
  io: null,
  games: {},
  MAXPLAYERS: 6,
  ROOMCODELENGTH: 4
};

var func = {
  initGameListeners: function(socket) {
    socket.on('logSocket', listener.logSocket);
    socket.on('hostNewGame', listener.hostNewGame);
    socket.on('joinGameRequest', listener.joinGameRequest);
    socket.on('beginGame', listener.beginGame);
    socket.on('submitGuess', listener.submitGuess);
    socket.on('leaveRoom', listener.leaveRoom);
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
    currGame.roundNumber += 1;
    // reset player guesses
    var currPlayers = Object.keys(currGame.playerData);
    _(currPlayers).forEach(function(player) {
      currGame.playerData[player].roundGuess = null;
      currGame.playerData[player].roundResult = null;
    });
    console.log('Beginning round num: ' + currGame.roundNumber + ' with target letter: ' + currGame.roundLetter);
    // generate round details broadcast new round message to all room clients
    currGame.gameStatus = 'newRound';
    data.io.sockets.to(room).emit('gameStateUpdate', currGame);
  },
  checkGuess: function(guessData) {
    console.log('Checking guess: ', guessData.guess);
    var currGame = data.games[guessData.room];
    var currPlayers = Object.keys(currGame.playerData);
    // check if submitted guess matches the target letter for the round and immediately eliminate if not
    if (guesssData.guess[0].toLowerCase() !== currGame.roundLetter) {
      console.log('Guess for ' + currGame.playerData[guessData.playerId].playerName + ' did not match the target letter.');
      currGame.playerData[guesssData.playerId].roundGuess = 'no bueno';
      currGame.playerData[guesssData.playerId].roundResult = { score: 0 };
      currGame.playerData[guesssData.playerId].playerStatus = 'eliminated';
      // if last active player with submitted guess returns trigger end of round function.
      var allResultsCollected = true;
      _(currPlayers).forEach(function(player) {
        console.log('Checking if ' + currGame.playerData[player].playerName + ' has not gotten result yet.');
        // flag waiting on returning guesses if either:
        // a player is active and has no result or
        // a player has previously submitted a guess and there is no result
        if (currGame.playerData[player].playerStatus === 'active' && currGame.playerData[player].roundResult === null) {
          console.log('Active player found without result');
          allResultsCollected = false;
        }
        if (currGame.playerData[player].roundGuess !== null && currGame.playerData[player].roundResult === null) {
          console.log('Submitted guess found without result');
          allResultsCollected = false;
        }
      });
      if (allResultsCollected) {
        console.log('All results collected for submitted guesses this round.');
        currGame.gameStatus = 'checkingGuesses';
        func.endGameRound(guessData.room);
      }
    } else {
      gameChecker(guessData.guess, function(result) {
        console.log('Results for guess: ' + guessData.guess + ' are:');
        console.log(result);
        // assign result to appropriate player data
        currGame.playerData[guessData.playerId].roundResult = result;
        // if last active player with submitted guess returns trigger end of round function.
        var allResultsCollected = true;
        _(currPlayers).forEach(function(player) {
          console.log('Checking if ' + currGame.playerData[player].playerName + ' has not gotten result yet.');
          // flag waiting on returning guesses if either:
          // a player is active and has no result or
          // a player has previously submitted a guess and there is no result
          if (currGame.playerData[player].playerStatus === 'active' && currGame.playerData[player].roundResult === null) {
            console.log('Active player found without result');
            allResultsCollected = false;
          }
          if (currGame.playerData[player].roundGuess !== null && currGame.playerData[player].roundResult === null) {
            console.log('Submitted guess found without result');
            allResultsCollected = false;
          }
        });
        if (allResultsCollected) {
          console.log('All results collected for submitted guesses this round.');
          currGame.gameStatus = 'checkingGuesses';
          func.endGameRound(guessData.room);
        }
      });
    }
  },
  endGameRound: function(room) {
    // calculate eliminations and update active status for players
    var currGame = data.games[room];
    var currPlayers = Object.keys(currGame.playerData);
    var activePlayers = [];
    var allPlayers = [];
    _(currPlayers).forEach(function(player) {
      if (currGame.playerData[player].playerStatus === 'active') {
        // active player found add to collection
        activePlayers.push([player, currGame.playerData[player].roundResult]);
      }
      if (currGame.playerData[player].roundGuess !== null) {
        allPlayers.push([player, currGame.playerData[player].roundResult]);
      }
    });
    // find lowest total(s) among active players and set their game status to eliminated
    var lowResult = null;
    var lowPlayers = [];
    _(activePlayers).forEach(function(player) {
      if (lowResult === null) {
        // first player checked set the score mark
        lowResult = player[1].score;
        lowPlayers.push(player);
      } else if (player[1].score < lowResult) {
        // if player sets new mark by themselves
        lowResult = player[1].score;
        lowPlayers = [player];
      } else if (player[1].score === lowResult) {
        // if player has the same result as the current mark
        lowPlayers.push(player);
      }
    });
    // find highest score among all submitting players
    var highResult = null;
    var highPlayers = [];
    _(allPlayers).forEach(function(player) {
      if (highResult === null) {
        // first player checked set the score mark
        highResult = player[1].score;
        highPlayers.push(player);
      } else if (player[1].score > highResult) {
        // if player sets new mark by themselves
        highResult = player[1].score;
        highPlayers = [player];
      } else if (player[1].score === highResult) {
        // if player has the same result as the current mark
        highPlayers.push(player);
      }
    });
    console.log('Checking round results:');
    console.log('Number of active players:', activePlayers.length);
    console.log('Number of low players:', lowPlayers.length);
    console.log('Number of high players:', highPlayers.length);
    // check for multiple round end conditions
    // - number of low players is less than the number of active players
    //  - if only one active player left, they have won and end game
    //  - else start new round with remaining active players
    // - number of low players is equal to the number of active players, start new round with all active players
    currGame.lowPlayers = lowPlayers;
    currGame.highPlayers = highPlayers;
    if (activePlayers.length > lowPlayers.length) {
      // set all elements of the lowPlayer array to eliminated player status
      _(lowPlayers).forEach(function(player) {
        currGame.playerData[player[0]].playerStatus = 'eliminated';
      });
      if ((activePlayers.length - lowPlayers.length) === 1) {
        // all but one active player has been eliminated, declare winner and start end of game routines
        _(currPlayers).forEach(function(player) {
          if (currGame.playerData[player].playerStatus === 'active') {
            currGame.winner = currGame.playerData[player];
            currGame.playerData[player].playerStatus = 'winner';
            console.log('Winner found: ', currGame.playerData[player].playerName);
          }
        });
        currGame.gameStatus = 'endOfGame';
        data.io.sockets.to(room).emit('gameStateUpdate', currGame);
        // call new round function in 5 secs
        var newGameEndTimer = setTimeout(function() {
          // broadcast gameEnded event to all clients in the room, when all clients have unsubbed
          // from the room then delete the game data from the data.games object.
          data.io.sockets.to(room).emit('gameEnded', currGame);
        }, 10000);
      } else {
        console.log('Players eliminated.');
        // there is more than one active players left in the game, eliminate the low players and
        // continue with a new round.
        currGame.gameStatus = 'endOfRound';
        data.io.sockets.to(room).emit('gameStateUpdate', currGame);
        var newGameRoundTimer = setTimeout(function() {
          func.newGameRound(room);
        }, 5000);
      }
    } else {
      console.log('All active players received same score. Begin new round.');
      // all of the remaining active players received the same round result, eliminate none and
      // start a new round instance
      currGame.lowPlayers = [];
      currGame.gameStatus = 'endOfRound';
      data.io.sockets.to(room).emit('gameStateUpdate', currGame);
      var newGameRoundTimer = setTimeout(function() {
        func.newGameRound(room);
      }, 5000);
    }
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
      lowPlayers: [],
      highPlayers: [],
      winner: null,
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
    var currGame = null;
    // check if requested game exists
    if (data.games[eventData.room]) {
      currGame = data.games[eventData.room];
      // check if game is available to join
      var currPlayers = Object.keys(currGame.playerData);
      if (currPlayers.length < data.MAXPLAYERS && currGame.gameStatus === 'waiting') {
        // add player to game, game channel and send back confirmation
        currGame.playerData[eventData.socketId] = { playerName: eventData.playerName };
        socket.join(eventData.room);
        socket.emit('confirmJoin', { room: eventData.room });
        // update gamedata to reflect player addition
        data.io.sockets.to(eventData.room).emit('gameStateUpdate', currGame);
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
      // set all players to active status. to be changed to eliminated as game progresses
      var currPlayers = Object.keys(currGame.playerData);
      for (var i = 0; i < currPlayers.length; i++) {
        currGame.playerData[currPlayers[i]].playerStatus = 'active';
      }
      currGame.gameStatus = 'beginGame';
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
    console.log('Current players: ', currPlayers);
    _(currPlayers).forEach(function(player) {
      console.log('Checking if ' + currGame.playerData[player].playerName + ' is the last active guesser.');
      if (currGame.playerData[player].playerStatus === 'active' && currGame.playerData[player].roundGuess === null) {
        console.log('Active player found without submitted guess.');
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
  },
  leaveRoom: function(eventData) {
    var socket = this;
    // unsub the current request from the game room
    socket.leave(eventData.room);
    // remove player/host from the current game and if all clients have left delete the game data
    var currGame = data.games[eventData.room];
    var currPlayers = Object.keys(currGame.playerData);
    // check host first
    if (eventData.socketId === currGame.hostId) {
      currGame.hostId = null;
    }
    // check players
    _(currPlayers).forEach(function(player) {
      if (player === eventData.socketId) {
        delete currGame.playerData[player];
      }
    });
    // check if all clients have left game
    if (currGame.hostId === null && currGame.playerData === {}) {
      // cleanup game instance by removing it from the games data struct.
      delete data.games[eventData.room];
    }
  }
}

module.exports = {
  data: data,
  func: func,
  listener: listener
}
