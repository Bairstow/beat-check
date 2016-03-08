<template>
  <div class="row search">
    <div class="two-thirds column">
      <input type="text" placeholder="Artist" v-model="artist">
    </div>
    <div class="one-third column">
      <button>Check</button>
    </div>
  </div>
  <div class="row search">
    <h2>{{ artist }}</h2>
  </div>
</template>

<style>
</style>

<script>
module.exports = {
  data: function() {
    return {
      artist: ''
    }
  },
  components: {},
  events: {},
  ready: function() {
    console.log('Vue search-block loaded.');
  }
}
</script>
