<template>
  <div class="row" v-show="artist">
    <div class="text-center" style="padding-top: 2rem">
      <h1>{{ artist }} <i class="icon ion-android-cancel" v-on:click="resultCancel"></i></h1>
    </div>
  </div>
  <div  v-show="artist">
    <resultdisplay :details="details"></resultdisplay>
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
  computed: {
    isNotResultView: function() {
      return (this.artist !== '');
    }
  },
  components: {
    resultdisplay: require('./result-display.vue')
  },
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
  ready: function() {
    console.log('Vue result-block loaded.');
  }
}
</script>
