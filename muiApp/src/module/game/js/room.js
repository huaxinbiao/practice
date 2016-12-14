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
    	let canvasGo = new operatCanvas();
	    let Start = true;
		let _default = {
			color: '#000', //画笔颜色
			lineWidth: 5,  //画笔大小
			lineCap: 'round', //绘制圆形的结束线帽 ,可选值:square
			lineJoin: 'round' //当两条线条交汇时，创建圆形边角
		};
    	let opt = {
    		x:100,
    		y:100
    	} 
    	canvasGo.drawCanvas(_default,opt,Start);
	},
    methods: {
    }
});

//获取坐标点与颜色画笔类型
function operatCanvas(){
	var gameCanvas = document.getElementById("gameCanvas");
	var ctx=gameCanvas.getContext("2d");
	var touchAggregate = new Array();
	var that = this;
	var _default = {
		color: '#333', //画笔颜色
		lineWidth: 3,  //画笔大小
		lineCap: 'round', //绘制圆形的结束线帽 ,可选值:square
		lineJoin: 'round' //当两条线条交汇时，创建圆形边角
	};
	this.handleStart = function(event){
		event.preventDefault();
	    var touches = event.changedTouches;//获取正在发生此事件的
	    var Start = true;
	    for(let i=0; i<touches.length; i++){
	    	touchAggregate.push(touches[i]);
	    	let opt = {
	    		x:touches[i].pageX,
	    		y:touches[i].pageY
	    	} 
	    	that.drawCanvas(_default,opt,Start);
	    }
	};
	this.handleMove = function(event){
		event.preventDefault();
	    var touches = event.changedTouches;//获取正在发生此事件的
	    for(let i=0; i<touches.length; i++){
	    	let idx = ongoingTouchIndexById(touches[i].identifier);
	    	let opt = {
	    		x:touches[i].pageX,
	    		y:touches[i].pageY,
	    		sx:touchAggregate[idx].pageX,
	    		sy:touchAggregate[idx].pageY
	    	}
	    	that.drawCanvas(_default,opt);
			touchAggregate.splice(idx, 1, touches[i]);
	    }
	};
	this.handleEnd = function(){
		event.preventDefault();
	    var touches = event.changedTouches;
	    for (let i=0; i<touches.length; i++) {
		    let idx = ongoingTouchIndexById(touches[i].identifier);
	    	let opt = {
	    		x:touches[i].pageX,
	    		y:touches[i].pageY,
	    		sx:touchAggregate[idx].pageX,
	    		sy:touchAggregate[idx].pageY
	    	}
	    	that.drawCanvas(_default,opt);
		    touchAggregate.splice(i, 1);  // remove it; we're done
		}
	};
	
	this.handleCancel = function(event) {
      	evt.preventDefault();
      	var touches = evt.changedTouches;
      
      	for (let i=0; i<touches.length; i++) {
        	touchAggregate.splice(i, 1);  // remove it; we're done
      	}
    }
	this.drawCanvas = function(_default,opt,Start){
		ctx.lineWidth = _default.lineWidth;
		ctx.strokeStyle = _default.color;
		ctx.lineCap = _default.lineCap;
		ctx.lineJoin = _default.lineJoin;
		if(Start){
		    ctx.beginPath();
		    ctx.moveTo(opt.x-1, opt.y-69);
		    ctx.lineTo(opt.x, opt.y-68);
		    ctx.closePath();
		    ctx.stroke();
		}else{
		    ctx.beginPath();
		    ctx.moveTo(opt.sx, opt.sy-68);
		    ctx.lineTo(opt.x, opt.y-68);
		    ctx.closePath();
		    ctx.stroke();
		}
	}
	var ongoingTouchIndexById = function(idToFind){
		for (let i=0; i<touchAggregate.length; i++) {
	        let id = touchAggregate[i].identifier;
	        
	        if (id == idToFind) {
	          return i;
	        }
	    }
	    return -1;    // not found
	}
	this.init = function(){
		gameCanvas.addEventListener('touchstart',that.handleStart,false);
		gameCanvas.addEventListener('touchmove',that.handleMove,false);
		gameCanvas.addEventListener('touchcancel',that.handleCancel,false);
		gameCanvas.addEventListener('touchend',that.handleEnd,false);
	    gameCanvas.addEventListener("touchleave", that.handleEnd, false);
	}
	this.init();
}

