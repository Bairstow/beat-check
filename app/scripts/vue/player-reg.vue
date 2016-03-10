<template>
  <div class="row reg-row">
    <div class="text-center" style="padding-top: 2rem">
      <h3>{{ title }}</h3>
    </div>
  </div>
  <div class="row reg-row text-center">
    <input type="text" placeholder="Name" style="background-color: transparent;" v-model="name" id="playerNameInput">
  </div>
  <div class="row reg-row text-center">
    <button v-on:click="readyClicked">Ready</button>
  </div>
  <div class="row reg-row text-center" id="waitMsg"></div>
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
      title: 'Player Registration',
      name: '',
      gameId: null
    }
  },
  components: {},
  methods: {
    readyClicked: function() {
      this.$dispatch('player-ready', true);
    }
  },
  events: {},
  props: [],
  ready: function() {
    console.log('Vue player-reg loaded.');
  }
}
</script>
