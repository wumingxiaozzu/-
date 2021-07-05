<template>
    <div class="create-order">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                订单预览
            </template>
        </nav-bar>

        <div class="address-wrap">
            <div class="name" @click="goTo">
                <span>{{address.name}}</span>
                <span>{{address.phone}}</span>
            </div>
            <div class="address">
                {{address.province}} {{address.city}} {{address.county}} {{address.address}}
            </div>
            <van-icon class="arrow" name="arrow" />
        </div>
        <div class="goods">
            <div class="goods-item" v-for="(item,index) in cartlist" :key="index">
                <div class="goods-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                <div class="goods-desc">
                    <div class="goods-title">
                        <span>{{item.goods.title}}</span>
                        <span>x{{item.num}}</span>
                    </div>
                    <div class="goods-btn">
                        <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
                    </div>
                </div>
            </div>
        </div>

        <van-submit-bar
                class="submit-all"
                :price="total * 100"
                @submit="handleCreateOrder"
                button-text="生成订单">
            商品金额
        </van-submit-bar>

        <van-popup
                closeable
                :close-on-click-overlay="false"
                v-model:show="showPay"
                position="bottom"
                :style="{ height: '30%' }"
                @close="close"
        >


            <van-grid :border="false" :column-num="2">
                <van-grid-item>
                    支付宝支付<br>
                    <van-image height="130" width="130" :src="aliyun" />
                </van-grid-item>
                <van-grid-item>
                    微信支付<br>
                    <van-image height="130" width="130" :src="wechat" />
                </van-grid-item>

            </van-grid>
        </van-popup>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useRoute,useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref,reactive,onMounted,toRefs,computed} from 'vue'
    import {Toast} from "vant";
    import {getOrderDetail,getOrderPreview,createOrder,payOrder,getOrderStatus} from "network/order";

    export default {
        name: "CreateOrder",
        components: {
            NavBar
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            const store = useStore();
            const state = reactive({
                cartlist:[],
                address:{},
                showPay:false,
                orederNo:'',
                aliyun:'',
                wechat:''
            })

            const init = () =>{
                Toast.loading({message:'加载中...',forbidClick:true})
                getOrderPreview().then(res =>{
                    let address = res.address.filter(n => n.is_default == '1');
                    if(address.length == 0){
                        state.address = {
                            address:"还未设置默认地址，请前往选择或设置"
                        }
                    }else {
                        state.address = address[0]
                    }

                    state.cartlist = res.carts;

                    Toast.clear()
                })


            }

            onMounted(() => {
                init()
            })

            const goTo = () => {
                router.push({path:'/address'})
            }

            const handleCreateOrder = () => {

                const params = {
                    address_id:state.address.id
                }

                createOrder(params).then(res => {
                    Toast.success("订单创建成功")
                    store.dispatch('updateCount')

                    state.showPay = true
                    state.orederNo = res.id

                    payOrder(state.orederNo,{type:'aliyun'}).then(res => {
                        state.aliyun = res.qr_code_url;
                        state.wechat = res.qr_code_url;
                    })

                    const timer = setInterval(() => {
                        getOrderStatus(state.orederNo).then(res => {
                            if(res == '2'){
                                clearInterval(timer)
                                router.push({path:'/orderdetail',query:{id:state.orederNo}})
                            }
                        })
                    },2000)
                })

            }
            const close = () => {
                router.push({path:'/orderdetail',query:{id:state.orederNo}})
            }

            const total = computed(() => {
                let sum = 0
                state.cartlist.forEach(item => {
                    sum += parseInt(item.num) * parseFloat(item.goods.price)
                })

                return sum
            })



            return{...toRefs(state),goTo,handleCreateOrder,total,close}
        }
    }
</script>

<style scoped lang="scss">
    .create-order{
        background: #f9f9f9;
        .address-wrap{
            text-align: left;
            margin-bottom: 20px;
            background: #fff;
            position: relative;
            margin-top: 44px;
            font-size: 14px;
            padding: 15px;
            color: #222333;
            .name,.address{
                margin: 10px 0;
            }
            .arrow{
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px;
            }
            &::before{
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 2px;
                background: -webkit-repeating-linear-gradient(135deg, #FF3300, #FF3300 5%, white 2.5%, white 7.5%, #83C6C2 7.5%, #83C6C2 12.5%, white 12.5%, white 15%);
                background: repeating-linear-gradient(135deg, #FF3300, #FF3300 5%, white 2.5%, white 7.5%, #83C6C2 7.5%, #83C6C2 12.5%, white 12.5%, white 15%);
                backgroud-size:80px;
                content: '';
            }
        }
        .goods{
            margin-bottom: 120px;
        }
        .goods-item{
            display: flex;
            .goods-img{
                img{
                    width: 100px;
                    height: auto;
                }
            }
            .goods-desc{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 20px;
                .goods-title{
                    display: flex;
                    justify-content: space-between;
                }
                .goods-btn{
                    display: flex;
                    justify-content: space-between;
                    .price{
                        font-size: 16px;
                        color: red;
                        line-height: 28px;
                    }
                    .van-icon-delete{
                        font-size: 20px;
                        margin-top: 4px;
                    }
                }
            }
        }
        .pay-wrap{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #fff;
            padding: 10px 0;
            padding-bottom: 50px;
            border-top: 1px solid #e9e9e9;
            >div{
                display: flex;
                justify-content: space-between;
                padding: 0 5%;
                margin: 10px 0;
                font-size: 14px;
                span:nth-child(2){
                    color: red;
                    font-size: 18px;
                }
            }
            .pay-btn{
                position: fixed;
                bottom: 7px;
                right: 0;
                left: 0;
                width: 90%;
                margin: 0 auto;
            }
        }
    }
    .submit-all{
        margin-bottom: 55px;
        z-index: 9 !important;
    }
</style>