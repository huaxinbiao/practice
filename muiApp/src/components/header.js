// 头部

Vue.component('io-header', {
        template: '<header class="mui-bar mui-bar-nav">'+
                        '<a class="mui-icon mui-action-menu mui-icon-bars mui-pull-left" v-on:tap="tab"></a>'+
//                        '<a id="info" class="mui-icon mui-icon-info-filled mui-pull-right" style="color: #999;"></a>'+
                        '<h1 class="mui-title">Hello mui</h1>'+
                    '</header>',
        methods: {
            tab: function (){
                 //侧滑容器父节点
                var offCanvasWrapper = mui('#offCanvasWrapper');
                 //主界面‘显示侧滑菜单’按钮的点击事件
                    offCanvasWrapper.offCanvas('show');
                 //菜单界面，‘关闭侧滑菜单’按钮的点击事件
                   // offCanvasWrapper.offCanvas('close');
                 //实现ios平台原生侧滑关闭页面；
                if (mui.os.plus && mui.os.ios) {
                    mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
                        plus.webview.currentWebview().setStyle({
                            'popGesture': 'none'
                        });
                    });
                }
            }
        }
});