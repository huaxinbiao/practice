//侧滑菜单部分
Vue.component('io-left', {
  template: '<aside id="offCanvasSide" class="mui-off-canvas-left">'+
				'<div id="offCanvasSideScroll" class="mui-scroll-wrapper">'+
					'<div class="mui-scroll">'+
						'<div class="title">侧滑导航</div>'+
						'<div class="content">'+
                            '<div><img src=""><span>袖手旁观</span></div>'+
                            '<div><a href="">签到</a></div>'+
						'</div>'+
						'<ul>'+
							'<li>'+
								'<a>动态</a>'+
							'</li>'+
							'<li>'+
								'<a>战绩</a>'+
							'</li>'+
							'<li>'+
								'<a>反馈</a>'+
							'</li>'+
						'</ul>'+
						'<div>'+
                            '<a href="#">设置</a>'+
                            '<a href="#">退出应用</a>'+
                        '</div>'+
					'</div>'+
				'</div>'+
			'</aside>'
});