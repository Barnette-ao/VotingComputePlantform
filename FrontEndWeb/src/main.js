import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';    
import 'element-ui/lib/theme-chalk/index.css'; 

Vue.use(ElementUI)  

import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodeMirror)


import request from './utils/request'
Vue.prototype.request = request   
   
Vue.config.productionTip = false

Vue.directive('title',{
  inserted:function(el){
    document.title = el.dataset.title
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
