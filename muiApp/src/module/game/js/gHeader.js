// 游戏房间头部

Vue.component('io-gheader', {
    template: `<header class="mui-bar mui-bar-nav">
				    <a class="mui-icon mui-icon-arrowleft Hui-icon-left" v-on:tap="back()"></a>
				    <h1 class="mui-title Hui-title"><p class="ellipsis">房间名字</p><i class="ellipsis">你画我猜</i></h1>
				    <a class=" Hui-icon-right mui-icon-extra mui-icon-extra-peoples Hui-icon"></a>
				</header>`,
	/*props: ['isNavshow'],//接收父组件传值*/
    methods: {
    	//事件
    	back:function(){
    		mui.back(true);
    	}
    }
});