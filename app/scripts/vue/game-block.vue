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
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
    </div>
    <div class="row">
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
      <div class="three columns">
        <playerdata></playerdata>
      </div>
    </div>
    <div class="row">
      <ul>
        <li v-for="player in players">{{ player.playerName }}</li>
      </ul>
    </div>
  </div>
  <div id="player-reg">
    <playerreg></playerreg>
  </div>
</template>

<style>
#game-board {
  display: none;
}
#player-reg {
  display: none;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      title: 'Beat Off In A Group...',
      game: null,
      players: []
    }
  },
  components: {
    playerdata: require('./player-data.vue'),
    playerreg: require('./player-reg.vue')
  },
  methods: {
    createNewGame: function() {
      this.game.App.Host.onCreateClick();
      this.players = this.game.App.Host.players;
    },
    joinGame: function() {
      this.game.App.Player.onJoinClick();
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
