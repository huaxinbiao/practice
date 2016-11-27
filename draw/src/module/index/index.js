import Vue from 'vue'
import App from 'components/App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
this.socket = io.connect('ws://121.40.205.128:3000');
