<template>
  <div class="title">
    {{ message }}
  </div>
</template>

<style>
.title {
  text-align: center;
  color: brown;
  background-color: linen;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      message: 'Node/Vue App scaffold'
    }
  },
  components: {},
  events: {},
  ready: function() {
    console.log('Vue Main app loaded.');
  }
}
</script>
