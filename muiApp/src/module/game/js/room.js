// 画布
Vue.component('io-canvas', {
    template: `<div class="gameRoom-canvas" v-on:tap="getCanvasHeight()">
					<div class="canvas-bar"><span>1号正在画，请先围观~{{screenHeight}}</span><span>剩余时间：<i>60</i></span></div>
					<canvas id="gameCanvas" style="width:100%" v-bind:style="{height: screenHeight + 'px' }"></canvas>
				</div>`,
	/*props: ['isNavshow'],//接收父组件传值*/
    data(){
      return {
          screenHeight: ''
      }  
    },
	mounted:function() {
		this.screenHeight = document.body.clientWidth*(3/4);
    	this.$emit('canvasheight',this.screenHeight);
	},
    methods: {
    }
});
