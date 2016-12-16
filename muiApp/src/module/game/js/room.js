// 画布
Vue.component('io-canvas', {
    template: `<div class="gameRoom-canvas">
					<div class="canvas-bar"><span>1号正在画，请先围观~{{screenHeight}}</span><span>剩余时间：<i>60</i></span></div>
					<canvas id="gameCanvas" v-on:touchstart="touchStart($event)" v-on:touchmove="touchMove($event)" v-on:touchcancel="touchCancel($event)" v-on:touchend="touchEnd($event)" v-on:touchleave="touchEnd($event)" v-bind:width="screenWidth" v-bind:height="screenHeight"></canvas>
				</div>`,
	/*props: ['isNavshow'],//接收父组件传值*/
    data(){
      return {
          screenHeight: '',
          screenWidth: '',
          canvasGo:'',
          messages:[],
          dom:false
      }  
    },
	mounted:function() {
		var that = this;
    	this.canvasGo = new operatCanvas();
		this.screenWidth = document.body.clientWidth;
		this.screenHeight = this.screenWidth*(3/4);
    	this.$emit('canvasheight',this.screenHeight);
        //接收消息
        this.socket.on('messageAdded', function(message){
            if(that.dom){
            	that.canvasGo.drawCanvas(message.parameter,message.opt,message.Start);
            }else{
            	that.messages.push(message);
            }
        });
	},
    methods: {
		updateMessage: function () {
		    this.$nextTick(function () {//当值变化dom更新完成
    			this.dom = true;
    			if(this.messages.length>0){
    				for(let i=0; i<this.messages.length; i++){
    					this.canvasGo.drawCanvas(message[i].parameter,message[i].opt,message[i].Start);
    				}
    			}
		    })
	    },
	    send:function(message){
	    	//发送消息
	    	this.socket.emit('createMessage',message);
	    },
	    touchStart:function(event){
	    	let that = this;
	    	this.canvasGo.handleStart(event,function(message){
	    		that.send(message);
	    	});
	    },
	    touchMove:function(event){
	    	let that = this;
	    	this.canvasGo.handleMove(event,function(message){
	    		that.send(message);
	    	});
	    },
	    touchCancel:function(event){
	    	this.canvasGo.handleCancel(event);
	    },
	    touchEnd:function(event){
	    	let that = this;
	    	this.canvasGo.handleEnd(event,function(message){
	    		that.send(message);
	    	});
	    }
    },
    watch:{
　　　　 screenHeight:'updateMessage'//当值变化时触发
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
	this.handleStart = function(event,callback){
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
			that.back(_default,opt,Start,callback);
	    }
	};
	this.handleMove = function(event,callback){
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
			that.back(_default,opt,false,callback);
	    }
	};
	this.handleEnd = function(event,callback){
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
			that.back(_default,opt,false,callback);
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
	this.back = function(_default,opt,Start,callback){
		var message = {
			parameter: _default,
			opt: opt,
			Start: Start
		};
		callback(message);
	}
}

