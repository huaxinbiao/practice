
Vue.component('io-nav', {
    template: `<nav class="mui-bar mui-bar-tab">
                    <a v-for="(item, index) in tabbar" class="mui-tab-item" v-bind:class="{'mui-active': Active==index}" href="javascript:;">
                        <span class="mui-icon" v-bind:class="item.icon"></span>
                        <span class="mui-tab-label">{{item.title}} </span>
                    </a>
                </nav>`,
    props: ['isActive'],
    data: function(){
        return {
            tabbar:[
                {icon:'mui-icon-starhalf',title:'游戏',url: 'home.html'},
                {icon:'mui-icon-paperplane',title:'房间',url: 'phone.html'},
                {icon:'mui-icon-chatbubble',title:'消息',url: 'email.html'},
                {icon:'mui-icon-navigate',title:'发现',url: 'gear.html'}
            ],
            Active: this.isActive
        }
    },
    mounted() {
        console.log(this.isActive);
    }
});
