import './css/app.scss';

//libraries
// import 'jquery/dist/jquery.slim';
import 'bootstrap';

import Vue from 'vue';

//components
//directives
//views
import App from './App.vue';
import Home from './views/Home.vue';

Vue.component('app', App);
Vue.component('home', Home);

new Vue({
  el: '#app',
});
