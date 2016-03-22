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
      <resultblock :details="currentResult"></resultblock>
    </div>
  </div>
  <div class="game">
    <div class="container">
      <gameblock></gameblock>
    </div>
  </div>
</template>

<style>
  .nav {
    background-color: #FF926B;
    color: white;
    height: 8vh;
    line-height: 8vh;
    font-size: 2rem;
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
    resultblock: require('./result-block.vue'),
    gameblock: require('./game-block.vue')
  },
  methods: {
    showHomeView: function() {
      $('.search').css('display', 'block');
      $('.result').css('display', 'block');
      $('.result').css('height', '52vh');
      $('.game').css('display', 'none');
    },
    showResultView: function() {
      $('.search').css('display', 'none');
      $('.result').css('display', 'block');
      $('.result').css('height', '92vh');
      $('.game').css('display', 'none');
    },
    showGameView: function() {
      $('.search').css('display', 'none');
      $('.result').css('display', 'none');
      $('.game').css('display', 'block');
      $('.game').css('height', '92vh');
    }
  },
  events: {
    'search-input': function(searchInput) {
      this.showResultView();
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
        vueContext.currentResult = result;
      });
    },
    'result-cancel': function(data) {
      this.showHomeView();
      this.currentResult = {};
      this.$broadcast('result-cancel', data);
    },
    'nav-home': function(data) {
      this.showHomeView();
      this.$broadcast('result-cancel', data);
    },
    'nav-game': function(data) {
      this.showGameView();
    }
  },
  ready: function() {
    console.log('Vue Main app loaded.');
  }
}
</script>
