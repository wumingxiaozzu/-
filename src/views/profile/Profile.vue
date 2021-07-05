<template>
    <div id="box">
        <nav-bar class="nav-bar">
            <template v-slot:left></template>
            <template v-slot:default>个人中心</template>
            <template v-slot:right></template>
        </nav-bar>
        <div class="user-box">
            <div class="user-info">
                <div class="info">
                    <img src="~assets/images/6.jpg" />
                    <div class="user-desc">
                        <span>昵称：{{user.name}}</span>
                        <span>登录名：{{user.email}}</span>
                        <span class="name">个性签名：好好学习，天天向上</span>
                    </div>
                </div>
            </div>

            <ul class="user-list">
                <li class="van-hairline--bottom">
                    <span>我的收藏</span>
                    <van-icon name="arrow" @click="goTo('/collect')"/>
                </li>
                <li class="van-hairline--bottom">
                    <span>我的订单</span>
                    <van-icon name="arrow" @click="goTo('/order')"/>
                </li>
                <li class="van-hairline--bottom">
                    <span>账号管理</span>
                    <van-icon name="arrow" @click="goTo('/arrage')"/>
                </li>
                <li class="van-hairline--bottom">
                    <span>地址管理</span>
                    <van-icon name="arrow" @click="goTo('/address')"/>
                </li>
                <li class="van-hairline--bottom">
                    <span>关于我们</span>
                    <van-icon name="arrow" @click="goTo('/about')"/>
                </li>
            </ul>
        </div>
        <div style="margin: 15px">
            <van-button round block color="#44b883" @click="tologout">退出登录</van-button>
        </div>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {logout,getUser} from "network/user";
    import { Notify ,Toast} from 'vant';
    import {useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {reactive,ref,toRefs,onMounted} from 'vue'
    export default {
        name: "Profile",
        components:{
            NavBar
        },
        setup(){
            const router = useRouter();
            const store = useStore();
            const state = reactive({
                user:{}
            })

            onMounted(() =>{
                getUser().then(res =>{
                    console.log(res);
                    state.user = res
                })
            })

            //页面跳转
            const goTo = (path,query) => {
                router.push({path,query:query || {}})
            }

            const tologout = () =>{
                logout().then(res =>{
                    if(res.status == '204'){
                        Toast.success('退出成功')

                        store.commit('setIslogin',false)
                        //清除token
                        window.localStorage.setItem('token','');

                        setTimeout(() =>{
                            router.push({path:'/login'})
                        },500)


                    }
                })
            }
            return {tologout,...toRefs(state),goTo}
        }
    }
</script>

<style scoped lang="scss">
#box{
    background: #fcfcfc;
    height: 100vh;
}
    .user-box{
        margin-top: 65px;
        .user-header{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10000;
            width: 100%;
            height: 44px;
            line-height: 44px;
            padding: 0 10px;
            color: #252525;
            background: #fff;
            border-bottom: 1px solid #dcdcdc;
            .user-name{
                font-size: 14px;
            }
        }
        .user-info{
            width: 94%;
            margin: 10px;
            height: 115px;
            background: linear-gradient(90deg,#31c7a7,#a1c7c7);
            box-shadow: 0 2px 5px #269090;
            border-radius: 6px;
            margin-top: 50px;
            text-align: left;
            .info{
                position: relative;
                display: flex;
                width: 100%;
                height: 100%;
                padding: 25px 20px;
                img{
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-top: 4px;
                }
                .user-desc{
                    display: flex;
                    flex-direction: column;
                    margin-left: 10px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #fff;
                    span{
                        color: #fff;
                        font-size: 14px;
                        padding: 2px 0;
                    }
                }
                .account-setting{
                    position: absolute;
                    top: 10px;
                    right: 20px;
                    font-size: 13px;
                    color: #fff;
                    .van-icon-setting-o{
                        font-size: 16px;
                        vertical-align: -3px;
                        margin-right: 4px;
                    }
                }
            }
        }
        .user-list{
            padding: 0 8px;
            margin-top: 40px;
            li{
                padding-left: 5px;
                padding-right: 5px;
                height: 40px;
                line-height: 40px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                .van-icon-arrow{
                    margin-top: 13px;
                }
                margin: 20px 0 !important;
                background: #FFFFFF;
                border-radius: 3px;
            }
        }
    }

</style>