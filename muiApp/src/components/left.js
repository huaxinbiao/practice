//侧滑菜单部分
Vue.component('io-left', {
  template: '<aside id="offCanvasSide" class="mui-off-canvas-left">'+
				'<div id="offCanvasSideScroll" class="mui-scroll-wrapper">'+
					'<div class="mui-scroll">'+
						'<div class="title">侧滑导航</div>'+
						'<div class="content">'+
							'这是可拖动式侧滑菜单示例，你可以在这里放置任何内容；关闭侧滑菜单有多种方式： 1.在手机屏幕任意位置向左拖动(drag)；2.点击本侧滑菜单页之外的任意位置;'+
							'<span class="android-only">；4.Android手机按back键；5.Android手机按menu键</span>。'+
							'<p style="margin: 10px 15px;">'+
								'<button id="offCanvasHide" type="button" class="mui-btn mui-btn-danger mui-btn-block" style="padding: 5px 20px;">关闭侧滑菜单</button>'+
							'</p>'+
						'</div>'+
						'<div class="title" style="margin-bottom: 25px;">侧滑列表示例</div>'+
						'<ul class="mui-table-view mui-table-view-chevron mui-table-view-inverted">'+
							'<li class="mui-table-view-cell">'+
								'<a class="mui-navigate-right">Item 1</a>'+
							'</li>'+
							'<li class="mui-table-view-cell">'+
								'<a class="mui-navigate-right">Item 2</a>'+
							'</li>'+
							'<li class="mui-table-view-cell">'+
								'<a class="mui-navigate-right">Item 3</a>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</aside>'
});