import Vue from 'vue';
import App from './App';
import bridge from 'public/js/bridge';
import 'public/stylus/index.styl';
import 'public/wx/app.wxss';
Vue.use(bridge);

Vue.config.productionTip = false;

App.mpType = 'app';
const app = new Vue(App);
app.$mount();
