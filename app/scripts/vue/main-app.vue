// main-app.vue
<template>
  <div class="nav">
    <div class="container">
      <navbar></navbar>
    </div>
  </div>
  <div class="search">
    <div class="container">
      <searchblock></searchblock>
    </div>
  </div>
</template>

<style>
  .nav {
    background-color: #25161B;
    min-height: 2rem;
  }
  .search {
    background-color: #453953;
    min-height: 10rem;
  }
</style>

<script>
module.exports = {
  data: function() {
    return {}
  },
  components: {
    navbar: require('./nav-bar.vue'),
    searchblock: require('./search-block.vue')
  },
  events: {},
  ready: function() {
    console.log('Vue Main app loaded.');
  }
}
</script>
