<template>
    <nav-bar>
        <template v-slot:left></template>
        <template v-slot:default>用户登录</template>
        <template v-slot:right></template>
    </nav-bar>

    <div style="margin-top: 50px">
        <div style="text-align: center;padding-top: 50px">
            <van-image
                    width="10rem"
                    height="5rem"
                    fit="contain"
                    src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=231749737,884997898&fm=26&gp=0.jpg"
            />
        </div>
        <van-form @submit="onSubmit">
            <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="请输入邮箱账号"
                    :rules="[{ required: true, message: '请输入正确的邮箱格式' }]"
            />
            <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />


            <div style="margin: 16px;">
                <div class="link-login" @click="$router.push({path:'/register'})">
                    没有帐号，前往注册
                </div>
                <van-button round block color="#44b883" type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {ref,reactive,toRefs} from 'vue';
    import {login} from "network/user";
    import { Notify ,Toast} from 'vant';
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'

    export default {
        name: "Login",
        components:{
            NavBar
        },
        setup(){

            const router = useRouter();
            const store = useStore();

            const userinfo = reactive({
                password:'',
                email:''
            })

            const onSubmit = () =>{
                login(userinfo).then(res =>{
                    //将token保存到本地window.localStorage  setItem(key,value) getItem(key)
                    window.localStorage.setItem('token',res.access_token);

                    //在vuex islogin
                    store.commit('setIslogin',true)

                    Toast.success('登陆成功');
                    userinfo.email = ''
                    userinfo.password = ''

                    setTimeout(() =>{
                        router.go(-1)
                    },500)
                })
            }


            return{...toRefs(userinfo),onSubmit}
        }
    }
</script>

<style scoped>
.link-login{
    font-size: 14px;
    color: #42bbaa;
    display: inline-block;
    float: left;
    padding-bottom: 20px;
}
</style>