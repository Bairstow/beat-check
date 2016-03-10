<template>
  <div class="player-data">
    <div class="row">
      <div class="player-name text-center">
        Player Name
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
</template>

<style>
.player-data {
  border: 1px solid black;
  border-radius: 5%;
  margin: 2rem 0;
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
  props: [],
  ready: function() {
    console.log('Vue player-data loaded.');
  }
}
</script>
