// 游戏房间头部

Vue.component('io-gnav', {
    template: `<nav class="mui-bar mui-bar-tab Hui-chat-bar" style="height:auto">
					<div class="sentNews">
						<a href="javascript:;"><i class="mui-icon mui-icon-mic"></i></a>
						<div contenteditable="true"></div>
						<a href="javascript:;"><i class="Hui-icon Hui-icon-face"></i></a>
						<a href="javascript:;"><i class="mui-icon mui-icon-plus"></i></a>
					</div>
					<div style="width:100%;height:200px;display:none"></div>
				</nav>`,
	/*props: ['isNavshow'],//接收父组件传值*/
    methods: {
    }
});