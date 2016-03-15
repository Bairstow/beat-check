<template>
  <div class="row">
    <div class="one-half column text-left" v-on:click="navHome">Beat Check</div>
    <div class="one-half column text-right">
      <!-- <ul class="menu-container" v-if="menuShown">
        <li v-for="item in menuItems" class="menu-item">{{ item }}</div>
      </ul> -->
      <i class="icon ion-android-menu" v-on:click="navGame"></i>
    </div>
  </div>
</template>

<style>
.menu-item {
  position: relative;
  top: 3rem;
  width: 10vw;
  border-radius: 10%;
}
</style>

<script>
module.exports = {
  data: function() {
    return {
      menuItems: ['Home', 'Game'],
      menuShown: false
    }
  },
  methods: {
    toggleMenu: function() { this.menuShown = !this.menuShown },
    navHome: function() {
      this.$dispatch('nav-home', true);
    },
    navGame: function() {
      this.$dispatch('nav-game', true);
    }
  },
  components: {},
  events: {},
  ready: function() {}
}
</script>
