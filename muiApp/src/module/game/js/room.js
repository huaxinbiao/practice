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
	    var Start = true;
	    console.log(touches)
	    for(let i=0; i<touches.length; i++){
	    	touchAggregate.push(touches[i]);
	    	var opt = {
	    		x:touches[i].pageX,
	    		y:touches[i].pageY
	    	} 
	    	drawCanvas(_default,opt,Start);
	    }
	};
	var handleMove = function(event){
		event.preventDefault();
	    var touches = event.changedTouches;//获取正在发生此事件的
	    for(let i=0; i<touches.length; i++){
	    	let startTouch = returnArrof(touches[i]);
	    	if(startTouch){
		    	var opt = {
		    		x:touches[i].pageX,
		    		y:touches[i].pageY,
		    		sx:startTouch.pageX,
		    		sy:startTouch.pageY
		    	}
		    	drawCanvas(_default,opt);
	    	}
	    }
	};
	var handleEnd = function(){
		event.preventDefault();
	    var touches = event.changedTouches;
	    for(let i=0; i<touches.length; i++){
	    	let startTouch = returnArrof(touches[i]);
	    	if(startTouch){
		    	var opt = {
		    		x:touches[i].pageX,
		    		y:touches[i].pageY,
		    		sx:startTouch.pageX,
		    		sy:startTouch.pageY
		    	} 
		    	drawCanvas(_default,opt);
	    		removeArr(touches[i]);
	    	}
	    }
	};
	//删除
	var removeArr = function(moveObj){
		for(let i=0; i<touchAggregate.length; i++){
			if(moveObj.identifier == touchAggregate[i].identifier){
				touchAggregate.splice(i, 1);
			}
		}
	}
	//去除数组包含向
	var returnArrof = function(moveObj){
		for(let i=0; i<touchAggregate.length; i++){
			if(moveObj.identifier == touchAggregate[i].identifier){
				let pvertouch = touchAggregate[i]
				touchAggregate[i] = moveObj;
				return pvertouch;
			}else{
				return -1;
			}
		}
	}
	
	gameCanvas.addEventListener('touchstart',handleStart,false);
	gameCanvas.addEventListener('touchmove',handleMove,false);
	gameCanvas.addEventListener('touchend',handleEnd,false);
}
function drawCanvas(_default,opt,Start){
	var gameCanvas = document.getElementById("gameCanvas");
	var ctx=gameCanvas.getContext("2d");
	ctx.lineWidth = _default.lineWidth;
	ctx.lineCap = _default.lineCap;
	ctx.strokeStyle = _default.color;
	if(Start){
	    ctx.beginPath();
	    ctx.moveTo(opt.x-1, opt.y-69);
	    ctx.lineTo(opt.x, opt.y-68);
	    ctx.closePath();
	    ctx.stroke();
	}else{
	    ctx.beginPath();
	    ctx.moveTo(opt.sx, opt.sy-69);
	    ctx.lineTo(opt.x, opt.y-68);
	    ctx.closePath();
	    ctx.stroke();
	}
}
