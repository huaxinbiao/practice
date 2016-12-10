//首页
Vue.component('io-index', {
    template: `<div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">
    				<div class="mui-scroll">
			            <div class="Hui-indexbar">
			                <div><img src="../../public/images/default.jpg"></div>
			                <div>
			                    <h2>袖手旁观</h2>
			                    <p>我就试试介绍能有多长。。。</p>
			                    <span>积分：1000</span>
			                </div>
			            </div>
			            <div class="Hui-indexcon">
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;" v-on:tap="open()">开始</a></div>
			                </div>
			            </div>
			        </div>
		        </div>`,
    mounted(){
    	//主界面和侧滑菜单界面均支持区域滚动；
        mui('#offCanvasContentScroll').scroll({
        	 indicators: false, //是否显示滚动条
			 deceleration:0.0005, //阻尼系数,系数越小滑动越灵敏
			 bounce: false, //是否启用回弹
        });
    },
    methods:{
    	open:function(){
    		//打开游戏房间
	    	mui.openWindow({
			    url:"../game/gameRoom.html",
			    id:"gameRoom",
			    styles:{
			      top:"0px",//新页面顶部位置
			      bottom:"0px",//新页面底部位置
			    },
			    waiting:{
			    	autoShow:false
			    }
			});
    	}
    }
});