<template>
  <div class="result-container" v-if="hasResult">
    <div class="row">
      <div class="one-third column">
        <div class="artist-image-container">
          <img class="artist-image" v-bind:src="details.image"></img>
        </div>
      </div>
      <div class="one-third column">
        <div class="score-main text-center">{{ details.score }}</div>
      </div>
      <div class="one-third column">
        <div class="score-minor text-center">{{ details.mbScore }} - mb</div>
        <div class="score-minor text-center">{{ details.spotifyScore }} - spotify</div>
        <div class="score-minor text-center">{{ details.twitterScore }} - twitter</div>
      </div>
    </div>
    <div class="row">
      <div class="latest-tweet text-center">{{ details.tweet }}</div>
    </div>
  </div>
  <div class="result-loading" v-else>
    <div class="row">
      <div class="text-center">
        <h2>Loading...</h2>
      </div>
    </div>
  </div>
</template>

<style>
.artist-image-container {
  border-radius: 50%;
  width: 25vw;
  max-width: 30rem;
  height: 25vw;
  max-height: 30rem;
  overflow: hidden;
}
.artist-image {
  width: 25vw;
  height: auto;
  min-height: 25vw;
}
.score-main {
  font-size: 10rem;
}
.score-minor {
  margin-top: 2rem;
}
.latest-tweet {
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: 100;
}
.result-loading {
  margin-top: 2rem;
}
</style>

<script>
module.exports = {
  data: function() {
    return {}
  },
  computed: {
    hasResult: function() {
      return typeof this.details.score === 'number';
    }
  },
  components: {},
  methods: {
    'resultCancel': function() {
      this.artist = '';
      this.$dispatch('result-cancel', true);
    }
  },
  events: {
    'search-input': function(search) {
      this.artist = search;
    }
  },
  props: ['details'],
  ready: function() {}
}
</script>
