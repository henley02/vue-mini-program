import Vue from 'vue';
import App from './App';
import bridge from 'public/js/bridge';
import 'public/wx/app.wxss';
import 'public/stylus/index.styl';
import hInput from 'public/components/h-input/h-input.vue';

Vue.use(bridge);

Vue.config.productionTip = false;
Vue.component('hInput', hInput);
App.mpType = 'app';
const app = new Vue(App);
app.$mount();
