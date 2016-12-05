
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
                {icon:'mui-icon-home',title:'首页',url: 'home.html'},
                {icon:'mui-icon-phone',title:'电话',url: 'phone.html'},
                {icon:'mui-icon-email',title:'邮件',url: 'email.html'},
                {icon:'mui-icon-gear',title:'设置',url: 'gear.html'}
            ]
        }
    }
});
