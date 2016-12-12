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
    	operatCanvas();
	},
    methods: {
    }
});

//获取坐标点与颜色画笔类型
function operatCanvas(){
	var gameCanvas = document.getElementById("gameCanvas");
	var ctx=gameCanvas.getContext("2d");
	var touchAggregate = new Array();
	var _default = {
		color: '#333', //画笔颜色
		lineWidth: 2,  //画笔大小
		lineCap: 'round', //绘制圆形的结束线帽 ,可选值:square
		lineJoin: 'round' //当两条线条交汇时，创建圆形边角
	};
	var handleStart = function(event){
		event.preventDefault();
	    var touches = event.changedTouches;//获取正在发生此事件的
	    for(var i=0; i<touches.length; i++){
	    	console.log(touches[i])
	    }
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
	
	gameCanvas.addEventListener('touchstart',handleStart,false);
	gameCanvas.addEventListener('touchmove',handleMove,false);
	gameCanvas.addEventListener('touchend',handleEnd,false);
}
function drawCanvas(Page,opt){
	
}
