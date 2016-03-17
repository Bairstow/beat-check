<template>
  <div class="one-third column">
    <div class="player-data">
      <div class="row">
        <div class="player-name text-center">
          <h3>{{ details[1].playerName }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="player-answer text-center" v-if="showResults">
          {{ details[1].roundGuess }}
        </div>
      </div>
      <div class="row">
        <div class="player-score text-center" v-if="showResults">
          {{ details[1].roundResult.score }}
        </div>
      </div>
      <div class="row">
        <div class="player-status text-center">
          Game Status: {{ gamestatus }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.player-data {
  border-radius: 5%;
  margin: 2rem 0;
  height: 16rem;
  color: white;
  background-color: #25161B;
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
    }
  },
  components: {},
  methods: {},
  events: {},
  props: ['details', 'index', 'gamestatus'],
  ready: function() {}
}
</script>
