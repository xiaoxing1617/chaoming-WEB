import App from './App'
import uView from './index.js'
import './index.scss'

import Vue from 'vue'
import './uni.promisify.adaptor'
import xingCommon from '@/components/xing-common.vue';
Vue.component("xingCommon",xingCommon)
import xText from '@/components/x-text.vue';
Vue.component("x-text",xText)

Vue.config.productionTip = false
Vue.use(uView);
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()