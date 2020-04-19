import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

// VueAnalytics
import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-112298679-1',
  router
})

// VueProgressBar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: '#29d', // #29d, rgb(143, 255, 199)
  failedColor: 'red',
  height: '2px',
  thickness: '4px'
})

// VueMeta
import VueMeta from 'vue-meta'
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
