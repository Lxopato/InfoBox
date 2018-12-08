import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import VueSelect from 'vue-cool-select';

Vue.use(VueResource);
Vue.use(VueSelect, {
  theme: 'material-design'
})
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
