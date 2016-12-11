// 画布
Vue.component('io-canvas', {
    template: `<div class="gameRoom-canvas">
					<div class="canvas-bar"><span>1号正在画，请先围观~{{screenHeight}}</span><span>剩余时间：<i>60</i></span></div>
					<canvas id="gameCanvas" v-bind:width="screenWidth" v-bind:height="screenHeight"></canvas>
				</div>`,
	/*props: ['isNavshow'],//接收父组件传值*/
    data(){
      return {
          screenHeight: '',
          screenWidth: ''
      }  
    },
	mounted:function() {
		this.screenWidth = document.body.clientWidth;
		this.screenHeight = this.screenWidth*(3/4);
    	this.$emit('canvasheight',this.screenHeight);
    	var operat = new operatCanvas();
	},
    methods: {
    }
});

//获取坐标点与颜色画笔类型
function operatCanvas(){
	console.log(100)
	var gameCanvas = document.getElementById("gameCanvas");
	var _default = {
		color: '#333', //画笔颜色
		lineWidth: 2,  //画笔大小
		lineCap: 'round', //绘制圆形的结束线帽
		lineJoin: 'round' //当两条线条交汇时，创建圆形边角
	}
	var kk={
		oo:function(jj){
			console.log(jj)
		}
	}
	var ctx=gameCanvas.getContext("2d");
	var handleStart = function(event){
		event.preventDefault();
	    var touches = event.changedTouches;
	};
	var handleMove = function(event){
		event.preventDefault();
      var el = document.getElementById("gameCanvas");
      var ctx = el.getContext("2d");
      var touches = event.changedTouches;
      
      ctx.lineWidth = 4;
		console.log(touches[0].pageX-1)
            
        var color = '#000';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(parseInt(touches[0].pageX-1), parseInt(touches[0].pageY-69));
        ctx.lineTo(parseInt(touches[0].pageX), parseInt(touches[0].pageY-68));
        ctx.closePath();
        ctx.stroke();
	};
	var handleEnd = function(){
		event.preventDefault();
	    var touches = event.changedTouches;
	};
	
	document.addEventListener('touchstart',handleStart,false);
	document.addEventListener('touchmove',handleMove,false);
	document.addEventListener('touchend',handleEnd,false);
}
