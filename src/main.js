import Vue from 'vue';
import App from './App';
import bridge from 'public/js/bridge';
import 'public/wx/app.wxss';
import 'public/stylus/index.styl';
import hInput from 'public/components/h-input/h-input.vue';
import mixins from 'public/mixins/global'; // 全局混合
import btnHome from 'public/components/btn-home/btn-home.vue';

Vue.use(bridge);
Vue.mixin(mixins);
Vue.config.productionTip = false;
Vue.component('hInput', hInput);
Vue.component('btnHome', btnHome);
App.mpType = 'app';
const app = new Vue(App);
app.$mount();
