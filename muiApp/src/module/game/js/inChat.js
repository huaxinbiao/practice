// 游戏房间头部

Vue.component('io-chat', {
    template: `<div id="chat-scroll" v-bind:style="{top:canvasHeight+'px'}" class="mui-content Hui-chat-scroll">
					<input type="color" value="#333333" list="colors">
					<datalist id="colors">
						<option>#ffffff</optison>
						<option>#ff0000</option>
						<option>#ff7700</option>
					</datalist>
					<input type="range" name="points" min="1" max="10" />
			   </div>`,
	props: ['canvasHeight'],//接收父组件传值
    mounted(){
    },
    methods: {
    }
});