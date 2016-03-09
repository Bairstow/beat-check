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
  <div class="result">
    <div class="container">
      <resultblock></resultblock>
    </div>
  </div>
</template>

<style>
  .nav {
    background-color: #FF926B;
    color: white;
    height: 8vh;
    line-height: 8vh;
  }
  .search {
    background-color: #FFE390;
    height: 40vh;
  }
  .result {
    background-color: #25161B;
    color: white;
    height: 52vh;
  }
</style>

<script>
var $ = require('jquery');

module.exports = {
  data: function() {
    return {
      currentResult: {}
    };
  },
  components: {
    navbar: require('./nav-bar.vue'),
    searchblock: require('./search-block.vue'),
    resultblock: require('./result-block.vue')
  },
  events: {
    'search-input': function(searchInput) {
      $('.search').css('display', 'none');
      $('.result').css('height', '92vh');
      this.$broadcast('search-input', searchInput);
      var vueContext = this;
      $.ajax({
        url: '/api/search',
        context: vueContext,
        data: {
          search: searchInput
        },
        dataType: 'json'
      }).done(function(result) {
        console.log('Beat search results generated:', result);
        vueContext.currentResult = result;
      });
    },
    'result-cancel': function(data) {
      $('.search').css('display', 'block');
      $('.result').css('display', '52vh');
      this.$broadcast('result-cancel', data);
    }
  },
  ready: function() {
    console.log('Vue Main app loaded.');
  }
}
</script>
