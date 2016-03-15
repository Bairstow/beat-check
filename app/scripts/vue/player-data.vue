<template>
  <div class="one-third column">
    <div class="player-data">
      <div class="row">
        <div class="player-name text-center">
          <h3>{{ details.playerName }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="player-answer text-center">
          Player Answer
        </div>
      </div>
      <div class="row">
        <div class="player-score text-center">
          Player Score
        </div>
      </div>
      <div class="row">
        <div class="player-status text-center">
          Player Status
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
  components: {},
  methods: {},
  events: {},
  props: ['details', 'index'],
  ready: function() {}
}
</script>
