//侧滑菜单部分
Vue.component('io-left', {
  template: `<aside id="offCanvasSide" class="mui-off-canvas-left">
				<div id="offCanvasSideScroll" class="mui-scroll-wrapper">
					<div class="mui-scroll" style="height:100%;">
						<div class="content Hui-leftTop">
                <div><img src="../../public/images/default.jpg"><span>袖手旁观</span></div>
                <div><a href="javascript:;">签到</a></div>
						</div>
						<ul class="Hui-leftCon">
							<li>
								<a href="javascript:;"><i class="mui-icon mui-icon-image"></i>动态</a>
							</li>
							<li>
								<a href="javascript:;"><i class="mui-icon mui-icon-flag"></i>战绩</a>
							</li>
							<li>
								<a href="javascript:;"><i class="mui-icon mui-icon-info"></i>反馈</a>
							</li>
						</ul>
						<div class="Hui-leftBtn">
                <a href="#">设置</a>
                <a href="javascript:;" v-on:tap="quit">退出应用</a>
            </div>
					</div>
				</div>
			</aside>`,
	methods: {
	    quit: function (){
	    		//退出应用
	        plus.runtime.quit();
	    }
	}
});