<template>
  <div class="row">
    <div class="one-half column">Beat Check</div>
    <div class="one-half column">Howdy, {{ user }}</div>
  </div>
</template>

<style>
</style>

<script>
module.exports = {
  data: function() {
    return {
      user: 'JB'
    }
  },
  components: {},
  events: {},
  ready: function() {
    console.log('Vue nav bar loaded.');
  }
}
</script>
