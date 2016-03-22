<template>
  <div class="one-third column">
    <div class="player-data" v-bind:class="{'eliminated': isEliminated, 'active': isActive, 'submitted': hasSubmitted, 'winner': isWinner}">
      <div class="row">
        <div class="player-name text-center">
          <h3>{{ details[1].playerName }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="player-answer text-center" v-if="showResults">
          <h5>{{ details[1].roundGuess }}</h5>
        </div>
      </div>
      <div class="row">
        <div class="player-score text-center" v-if="showResults">
          <h4>{{ details[1].roundResult.score }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.player-data {
  border-radius: 5%;
  margin: 2rem 0;
  height: 18rem;
  color: white;
  background-color: #25161B;
}
.active {
  background-color: #25161B;
}
.eliminated {
  color: black;
  background-color: #A29094;
}
.submitted {
  background-color: #FF926B;
}
.winner {
  color: black;
  background-color: #3AB1C8;
}
</style>

<script>
module.exports = {
  data: function() {
    return {}
  },
  computed: {
    showResults: function() {
      return (this.gamestatus === 'endOfRound' || this.gamestatus === 'endOfGame');
    },
    isEliminated: function() {
      return (this.details[1].playerStatus === 'eliminated');
    },
    isActive: function() {
      return (this.details[1].playerStatus === 'active');
    },
    hasSubmitted: function() {
      return (this.details[1].roundGuess !== null && this.gamestatus === 'newRound');
    },
    isWinner: function() {
      return (this.details[1].playerStatus === 'winner');
    }
  },
  components: {},
  methods: {},
  events: {},
  props: ['details', 'index', 'gamestatus'],
  ready: function() {}
}
</script>
