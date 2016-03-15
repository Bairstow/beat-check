var $ = require('jquery');


$(document).ready(function() {
  var Vue = require('vue');
  var MainApp = require('./vue/main-app.vue');

  Vue.component('main-app', MainApp);

  var main = new Vue({
    el: 'body'
  });
});
