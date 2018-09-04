// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/iconfont.css'
import '../static/css/reset.css'
import axios from 'axios'
import App from './App'
import echarts from 'echarts'
import store from './vuex';

Vue.prototype.$echarts = echarts
import router from './router'
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUi);



/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
    store,
	template: '<App/>',
	components: {App}
})
