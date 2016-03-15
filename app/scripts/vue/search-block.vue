<template>
  <div class="row">
    <div class="text-center" style="padding-top: 2rem">
      <h1>Who you checking?</h1>
    </div>
  </div>
  <div class="row">
    <div class="content-center">
      <input type="text" placeholder="Artist" v-model="artist" style="background-color: transparent">
      <button v-on:click="searchInput">Go</button>
    </div>
  </div>
  <div class="row">
    <div class="text-center text-slim" style="font-size: 4rem">
      <div>{{ artist }}</div>
    </div>
  </div>
</template>

<style>
.content-center {
  padding-left: 22vw;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      artist: ''
    }
  },
  components: {},
  methods: {
    searchInput: function() {
      if (this.artist !== '') {
        this.$dispatch('search-input', this.artist);
      }
    }
  },
  events: {},
  ready: function() {}
}
</script>
