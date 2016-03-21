<template>
  <div class="row">
    <div class="text-center" style="padding-top: 2rem">
      <h2>{{ title }} <i class="icon ion-happy"></i></h2>
    </div>
  </div>
  <div class="row">
    <div class="three columns text-center">
      <button v-on:click="hostNewGame">Create</button>
    </div>
    <div class="three columns text-center">
      <button v-on:click="displayRegistration">Join</button>
    </div>
    <div class="three columns text-center">
      <button v-on:click="logSocket">Log</button>
    </div>
    <div class="three columns text-center display-board">
      Game ID: {{ room }}
    </div>
  </div>
  <div class="display-board">
    <div class="row">
      <div class="text-center">
        <button v-on:click="beginGame">Begin</button>
      </div>
    </div>
    <div class="row text-center">
      <h2>{{ instructions }}</h2>
    </div>
    <div class="row">
      <playerdata v-for="player in players" :details="player" :index="$index" :gamestatus="gameStatus"></playerdata>
    </div>
  </div>
  <div id="player-reg">
    <playerreg></playerreg>
  </div>
  <div id="player-board">
    <playerboard :details="instructions" :gamestatus="gameStatus"></playerboard>
  </div>
</template>

<style>
.display-board {
  display: none;
}
#player-reg {
  display: none;
}
#player-board {
  display: none;
}
</style>

<script>
var $ = require('jquery');

module.exports = {
  data: function() {
    return {
      title: 'Group Beat',
      game: null
    }
  },
  computed: {
    room: function() {
      if (this.game !== null) {
        return this.game.data.room;
      }
    },
    players: function() {
      if (this.game !== null) {
        return this.game.data.players;
      }
    },
    gameData: function() {
      if (this.game !== null) {
        return this.game.data.gameData;
      }
    },
    gameStatus: function() {
      if (this.game !== null) {
        return this.game.data.gameStatus;
      }
    },
    instructions: function() {
      switch(this.gameStatus) {
        case 'waiting':
          return 'Currently waiting for players';
          break;
        case 'beginGame':
          return 'Game is beginning';
          break;
        case 'newRound':
          return 'Round ' + this.gameData.roundNumber + ' the target letter is: ' + this.gameData.roundLetter;
          break;
        case 'checkingGuesses':
          return 'Checking submitted guesses...';
          break;
        case 'endOfRound':
          return 'Round has ended.';
          break;
        case 'endOfGame':
          return 'Game has ended. The winner was: ' + this.gameData.winner;
          break;
        default:
          return 'Unexpected game status received';
      }
    }
  },
  components: {
    playerdata: require('./player-data.vue'),
    playerreg: require('./player-reg.vue'),
    playerboard: require('./player-board.vue')
  },
  methods: {
    hostNewGame: function() {
      this.game.func.clickCreate();
      $('.display-board').css('display', 'block');
    },
    displayRegistration: function() {
      $('#player-reg').css('display', 'block');
    },
    logSocket: function() {
      this.game.func.logSocket();
    },
    beginGame: function() {
      this.game.func.clickBegin();
    }
  },
  events: {
    'register-player': function(eventData) {
      console.log('Join request from player with name: ' + eventData.name + ' to game: ' + eventData.gameId);
      this.game.data.socket.emit('joinGameRequest', {
        socketId: this.game.data.socketId,
        playerName: eventData.playerName,
        room: eventData.gameId
      });
    },
    'player-guess': function(eventData) {
      this.game.func.submitGuess(eventData.guess);
    }
  },
  props: [],
  ready: function() {
    console.log('Vue game-block loaded with game functions.');
    this.game = require('../beat-game');
    this.game.func.initGameBindings();
  }
}
</script>
