// 游戏房间头部

Vue.component('io-chat', {
    template: `<div id="chat-scroll" v-bind:style="{top:canvasHeight+'px'}" class="mui-content Hui-chat-scroll">
		    {{canvasHeight}}
			   </div>`,
	props: ['canvasHeight'],//接收父组件传值
    mounted(){
    },
    methods: {
    }
});