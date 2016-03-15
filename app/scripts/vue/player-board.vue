<template>
  <div class="row reg-row">
    <div class="text-center" style="padding-top: 2rem">
      <h3>{{ details }}</h3>
    </div>
  </div>
  <div class="row reg-row text-center">
    <input type="text" placeholder="Artist" style="background-color: transparent;" v-model="guess" id="playerArtistInput">
  </div>
  <div class="row reg-row text-center">
    <button v-on:click="submitGuess">Submit</button>
  </div>
</template>

<style>
.reg-row {
  margin: 1rem 0;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      guess: '',
    }
  },
  components: {},
  methods: {
    submitGuess: function() {
      console.log('Player has submitted a guess.');
      if (this.guess.length > 0) {
        this.$dispatch('player-guess', { guess: this.guess });
      } else {
        console.log('Must enter a guess');
      }
    }
  },
  events: {},
  props: ['details'],
  ready: function() {}
}
</script>
