//首页
Vue.component('io-room', {
    template: `<div id="room" class="mui-content mui-scroll-wrapper">
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
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			                <div>
			                    <div><img src="../../public/images/icon1.png"></div>
			                    <div>
			                        <h3>你画我猜</h3>
			                        <span>涂鸦猜谜才艺展示</span>
			                    </div>
			                    <div><a href="javascript:;">开始</a></div>
			                </div>
			            </div>
			        </div>
		        </div>`,
    mounted(){
    	//主界面和侧滑菜单界面均支持区域滚动；
        mui('#room').scroll({
        	 indicators: false, //是否显示滚动条
			 deceleration:0.0005, //阻尼系数,系数越小滑动越灵敏
			 bounce: false, //是否启用回弹
        });
    }
});