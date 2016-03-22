<template>
  <div class="row">
    <div class="text-center" style="padding-top: 2rem">
      <h2>{{ title }} <i class="icon ion-happy"></i></h2>
    </div>
  </div>
  <div class="row" v-if="nullGameStatus">
    <div class="four columns text-center">
      <button v-on:click="hostNewGame">Create</button>
    </div>
    <div class="four columns text-center">
      <button v-on:click="displayRegistration">Join</button>
    </div>
    <div class="four columns text-center">
      <button v-on:click="logSocket">Log</button>
    </div>
  </div>
  <div class="row" v-if="activeGameStatus">
    <div class="four columns text-center" v-if="activeGameStatus">
      <button v-on:click="exitGameClick">Exit</button>
    </div>
    <div class="four columns text-center" v-if="activeGameStatus">
      Game ID: {{ room }}
    </div>
    <div class="four columns text-center" v-if="waiting && isHost">
      <button v-on:click="beginGameClick">Begin</button>
    </div>
  </div>
  <div v-if="activeGameStatus && isHost">
    <div class="row text-center" v-if="instructions" style="padding-top: 2rem">
      <h2>{{ instructions }}</h2>
    </div>
    <div class="row">
      <playerdata v-for="player in players" :details="player" :index="$index" :gamestatus="gameStatus"></playerdata>
    </div>
  </div>
  <div v-if="showRegistration || waiting && !isHost">
    <playerreg :details="isPlayer"></playerreg>
  </div>
  <div v-if="activeGameStatus && !waiting && isPlayer">
    <playerboard :details="instructions" :gamestatus="gameStatus"></playerboard>
  </div>
</template>

<style>
</style>

<script>
var $ = require('jquery');

module.exports = {
  data: function() {
    return {
      title: 'Group Beat',
      game: null,
      showRegistration: false
    }
  },
  computed: {
    room: function() {
      if (this.game !== null) {
        return this.game.data.room;
      }
    },
    isHost: function() {
      if (this.game !== null) {
        return (this.game.data.role === 'host');
      }
    },
    isPlayer: function() {
      if (this.game !== null) {
        return (this.game.data.role === 'player');
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
      } else {
        return null;
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
          return 'Game has ended. The winner was: ' + this.gameData.winner.playerName;
          break;
        default:
          return 'Unexpected game status received';
      }
    },
    nullGameStatus: function() {
      return (this.gameStatus === null);
    },
    activeGameStatus: function() {
      return !(this.gameStatus === null);
    },
    waiting: function() {
      return (this.gameStatus === 'waiting');
    },
    beginGame: function() {
      return (this.gameStatus === 'beginGame');
    },
    newRound: function() {
      return (this.gameStatus === 'newRound');
    },
    checkingGuesses: function() {
      return (this.gameStatus === 'checkingGuesses');
    },
    endOfRound: function() {
      return (this.gameStatus === 'endOfRound');
    },
    endOfGame: function() {
      return (this.gameStatus === 'endOfGame');
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
      this.showRegistration = true;
    },
    logSocket: function() {
      this.game.func.logSocket();
    },
    beginGameClick: function() {
      this.game.func.clickBegin();
    },
    exitGameClick: function() {
      this.game.func.clickExit();
    }
  },
  events: {
    'register-player': function(eventData) {
      this.showRegistration = false;
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
