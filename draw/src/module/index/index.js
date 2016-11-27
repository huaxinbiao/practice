import Vue from 'vue'
import App from 'components/App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
//this.socket = io.connect('ws://121.40.205.128:3000');
function plusReady(){
	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	// Android处理返回键
	plus.key.addEventListener('backbutton',function(){
		if(confirm('确认退出？')){
			plus.runtime.quit();
		}
	},false);
	compatibleAdjust();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}
