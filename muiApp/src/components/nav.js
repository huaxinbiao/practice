
Vue.component('io-nav', {
    template: `<nav class="mui-bar mui-bar-tab">
                    <a v-for="(item, index) in tabbar" class="mui-tab-item" v-bind:class="{'mui-active': Active==index}" v-on:tap="navtap(index,item.title)" href="javascript:;">
                        <span class="mui-icon" v-bind:class="item.icon"></span>
                        <span class="mui-tab-label">{{item.title}} </span>
                    </a>
                </nav>`,
    props: ['isActive'],//接收父组件传值
    data: function(){
        return {
            tabbar:[
                {icon:'mui-icon-starhalf',title:'游戏',url: 'home.html'},
                {icon:'mui-icon-paperplane',title:'房间',url: 'phone.html'},
                {icon:'mui-icon-chatbubble',title:'消息',url: 'email.html'},
                {icon:'mui-icon-navigate',title:'发现',url: 'gear.html'}
            ],
            Active: this.isActive
        }
    },
    mounted() {
    	// H5+
        // 扩展API是否准备好，如果没有则监听“plusready"事件
        if(window.plus){
        	// 扩展API准备完成后要执行的操作
            addEventTest();
        }else{ 
            document.addEventListener( "plusready", addEventTest, false );
        }
    },
    methods:{
    	navtap:function(index,title){
    		//向父组件传递数据
    		index = {
    			'index':index,
    			'title':title
    		}
    		this.$emit('navshow',index);
    	}
    }
});
function addEventTest(){
	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	// Android处理返回键,点击一下退到后台
	var main = plus.android.runtimeMainActivity();//先获取,否则第一次会卡
	plus.key.addEventListener("backbutton",function(){
		main.moveTaskToBack(true);
	},false);
	//改写mui.back默认绑定的返回
    mui.back = function(){
		return
    }
}
