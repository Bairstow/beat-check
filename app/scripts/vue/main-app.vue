<template>
  <div class="nav">
    <div class="container">
      <div class="row">
        <div class="title">
          {{ nav }}
        </div>
      </div>
    </div>
  </div>
  <div class="search">
    <div class="container">
      <div class="row">
        <div class="title">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.nav {
  background-color: gray;
  min-height: 2rem;
}
.search {
  background-color: linen;
}
.title {
  text-align: center;
  color: black;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      nav: 'Nav Placeholder',
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
