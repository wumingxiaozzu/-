<template>
    <nav-bar>
        <template v-slot:left></template>
        <template v-slot:default>新用户注册</template>
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
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="请确认密码"
                    :rules="[{ required: true, message: '请填写一致密码' }]"
            />
            <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="请输入正确的邮箱格式"
                    :rules="[{ required: true, message: '请输入正确的邮箱格式' }]"
            />
            <div style="margin: 16px;">
                <div class="link-login" @click="$router.push({path:'/login'})">
                    已有帐号，前往登录
                </div>
                <van-button round block color="#44b883" type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {ref,reactive,toRefs} from 'vue';
    import {register} from "network/user";
    import { Notify ,Toast} from 'vant';
    import {useRouter} from 'vue-router'

    export default {
        name: "Register",
        components:{
            NavBar
        },
        setup(){

            const router = useRouter();
            const userinfo = reactive({
                name:'',
                password:'',
                password_confirmation:'',
                email:''
            })

            const onSubmit = () =>{
                //先验证
                if(userinfo.password!=userinfo.password_confirmation){
                    Notify({ type: 'danger', message: '两次密码不一致' });
                }else{
                    register(userinfo).then(res =>{
                        console.log(res)
                        if(res.status == '201'){
                            Toast.success('注册成功');
                        }
                        setTimeout(()=>{
                            router.push("/login")
                        },1000)

                        userinfo.password = ''
                        userinfo.password_confirmation = ''
                    })
                }
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