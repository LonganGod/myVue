import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
import breadcrumb from './components/public/breadcrumb.vue'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/css/global.less'
import './assets/fonts/iconfont.css'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', date => {
  return moment(date).format('YYYY-MM-DD')
})

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
axios.interceptors.request.use(function(config) {
  var token = window.sessionStorage.getItem('token')
  if (token !== null) {
    config.headers.Authorization = token
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('breadcrumb', breadcrumb)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
