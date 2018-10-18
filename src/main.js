import Vue from 'vue';
import App from './App';
import bridge from 'public/js/bridge';
import 'public/stylus/index.styl';

const WxApp = getApp();
Vue.use(bridge);
Vue.prototype.$app = WxApp;
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();
