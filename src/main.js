import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '../src/components/Home';
import PrayerContent from '../src/components/PrayerContent';

Vue.config.productionTip = false;

const routes = [
  { path: '/', name: 'Home', component: Home, 
    children: [
      { path: 'prayer', name: 'PrayerContent', component: PrayerContent }
    ]
  }
];

const router = new VueRouter({ routes: routes });

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
