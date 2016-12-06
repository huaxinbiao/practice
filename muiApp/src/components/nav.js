
Vue.component('io-nav', {
    template: '<nav class="mui-bar mui-bar-tab">'+
                    '<a v-for="item in tabbar" class="mui-tab-item mui-active" href="#tabbar">'+
                        '<span class="mui-icon" v-bind:class="item.icon"></span>'+
                        '<span class="mui-tab-label">{{item.title}}</span>'+
                    '</a>'+
                '</nav>',
    data: function(){
        return {
            tabbar:[
                {icon:'mui-icon-starhalf',title:'游戏',url: 'home.html'},
                {icon:'mui-icon-paperplane',title:'房间',url: 'phone.html'},
                {icon:'mui-icon-chatbubble',title:'消息',url: 'email.html'},
                {icon:'mui-icon-navigate',title:'发现',url: 'gear.html'}
            ]
        }
    }
});
