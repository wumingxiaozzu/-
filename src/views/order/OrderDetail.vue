<template>
    <div class="order-detail-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                订单详情
            </template>
        </nav-bar>
        <div class="order-status">
            <div class="status-item">
                <label>订单状态：</label>
                <span>{{statusString}}</span>
            </div>
            <div class="status-item">
                <label>订单编号：</label>
                <span>{{detail.order_no}}</span>
            </div>
            <div class="status-item">
                <label>下单时间：</label>
                <span>{{detail.created_at}}</span>
            </div>

            <van-button v-if="detail.status == '1'" @click="showFn" style="margin-bottom: 10px;background-color:#1baeae !important;color: #FFFFFF"  block>去支付</van-button>
            <van-button v-if="detail.status == '2'" @click="handconfirmOrder" block>确认订单</van-button>
        </div>
        <div class="order-price">
            <div class="price-item">
                <label>商品金额：</label>
                <span>￥{{total+'.00'}}</span>
            </div>
            <div class="price-item">
                <label>配送方式：</label>
                <span>普通快递</span>
            </div>

            <van-card
                    v-for="(item,index) in detail.orderDetails.data" :key="index"
                    style="text-align: left"
                :num="item.num"
                :price="item.price+'.00'"
                desc="全场包邮"
                :title="item.goods.title"
                :thumb="item.goods.cover_url"
            />

            <div style="width: 100%;height: 50px;">

            </div>

            <van-popup v-model:show="showPay" position="bottom" :style="{ height: '40%' }">
               <div :style="{width:'90%',margin:'0 auto',padding:'50px 0'}">
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
               </div>
            </van-popup>

        </div>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useRoute,useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref,reactive,onMounted,toRefs,computed} from 'vue'
    import {getOrderDetail,payOrder,confirmOrder,getOrderStatus} from "network/order";
    import {Toast} from "vant";
    export default {
        name: "OrderDetail",
        components:{
            NavBar
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            const store = useStore();
            const state = reactive({
                orderNo:'',
                detail:{
                    orderDetails:{
                        data:[]
                    },
                    status:0
                },
                showPay:false,
                aliyun:'',
                wechat:''
            })

            const init = () =>{
                const {id} = route.query
                state.orderNo = id

                getOrderDetail(state.orderNo).then(res => {
                    state.detail = res
                })

            }

            onMounted(() => {
                Toast.loading({message:'加载中...',forbidClick:true})
                init()
                Toast.clear()
            })



            const statusString = computed(() => {
                let status = ['','已下单','已支付','等待发货','确认收货','已过期']
                return status[state.detail.status]
            })

            const total = computed(() => {
                let sum = 0
                state.detail.orderDetails.data.forEach(item => {
                    sum += parseInt(item.num) * parseFloat(item.goods.price)
                })

                return sum
            })

            const showFn = () =>{

                state.showPay = true

                payOrder(state.orderNo,{type:'aliyun'}).then(res => {
                    state.aliyun = res.qr_code_url;
                    state.wechat = res.qr_code_url;
                })

                const timer = setInterval(() => {
                    getOrderStatus(state.orederNo).then(res => {
                        if(res == '2'){
                            clearInterval(timer)
                            state.showPay = false
                            router.push({path:'/orderdetail',query:{id:state.orederNo}})
                        }
                    })
                },2000)
            }

            const handconfirmOrder = () => {
                Dialog.confirm({
                    title:'是否确认订单？'
                }).then(() =>{
                    confirmOrder(state.orderNo).then(res => {
                        Toast.success("确认成功")
                        init()
                    })
                }).catch(() =>{

                })
            }


            const close = () => {
                Dialog.close()
            }

            return{...toRefs(state),total,close,statusString,showFn,handconfirmOrder,close}
        }
    }
</script>

<style  lang="scss">
    .order-detail-box{
        text-align: left;
        color: #f7f7f7;
        .order-status{
            text-align: left;
            margin-bottom: 20px;
            background: #fff;
            position: relative;
            margin-top: 44px;
            font-size: 14px;
            padding: 15px;
            color: #222333;
            .status-item{
                margin: 10px 0;
                label{
                    font-size: 15px;
                    color: #888888;
                }
            }
        }
        .order-price{
            text-align: left;
            margin-bottom: 20px;
            background: #fff;
            position: relative;
            font-size: 15px;
            padding:  0 15px;
            color: #222333;
            .price-item{
                margin: 10px 0;
                label{
                    font-size: 15px;
                    color: #888888;
                }
                span{
                    font-size: 15px;

                }
            }
        }

    }

    .van-card{
        padding: 16px 0 !important;
    }
</style>