<template>
  <div class="row">
    <div class="text-center" style="padding-top: 2rem">
      <h2>{{ title }} <i class="icon ion-happy"></i></h2>
    </div>
  </div>
  <div class="row">
    <div class="one-half column text-center">
      <button v-on:click="createNewGame">Start</button>
    </div>
    <div class="one-half column text-center">
      <button v-on:click="joinGame">Join</button>
    </div>
  </div>
  <div id="game-board">
    <div class="row">
      <div class="one-half column text-center">Game Board</div>
      <div class="one-half column text-center">
        <button v-on:click="beginGame">Begin</button>
      </div>
    </div>
    <div class="row">
      <playerdata v-for="player in players" :details="player" :index="$index"></playerdata>
    </div>
  </div>
  <div id="player-reg">
    <playerreg></playerreg>
  </div>
  <div id="player-board">
    <playerboard></playerboard>
  </div>
</template>

<style>
#game-board {
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
module.exports = {
  data: function() {
    return {
      title: 'Group Beat Off',
      game: null,
      players: []
    }
  },
  components: {
    playerdata: require('./player-data.vue'),
    playerreg: require('./player-reg.vue'),
    playerboard: require('./player-board.vue'),
  },
  methods: {
    createNewGame: function() {
      console.log('createNewGame method called.');
      this.game.App.Host.onCreateClick();
      this.players = this.game.App.Host.players;
    },
    joinGame: function() {
      this.game.App.Player.onJoinClick();
    },
    beginGame: function() {
      this.game.App.Host.beginGameClick();
    }
  },
  events: {
    'player-ready': function(data) {
      this.game.App.Player.onReadyClick();
    }
  },
  props: [],
  ready: function() {
    this.game = require('../beat-game');
    console.log('Vue game-block loaded.');
  }
}
</script>
