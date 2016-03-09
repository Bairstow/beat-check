<template>
  <div class="row">
    <div class="one-half column text-left">Beat Check</div>
    <div class="one-half column text-right">Howdy, {{ user }}</div>
  </div>
</template>

<style>
</style>

<script>
module.exports = {
  data: function() {
    return {
      user: 'Josh'
    }
  },
  components: {},
  events: {},
  ready: function() {
    console.log('Vue nav bar loaded.');
  }
}
</script>
