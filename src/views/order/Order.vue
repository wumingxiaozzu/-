<template>
    <div class="order-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                订单预览
            </template>
        </nav-bar>

        <van-tabs ref="tabs" class="order-tab" @click="onChangeTab" :sticky="true" offset-top="45">
            <van-tab title="全部"></van-tab>
            <van-tab title="待付款"></van-tab>
            <van-tab title="已支付"></van-tab>
            <van-tab title="发货"></van-tab>
            <van-tab title="交易完成"></van-tab>
            <van-tab title="过期"></van-tab>
        </van-tabs>
        <div class="content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
                <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                        @offset="10"
                >
                    <div class="order-item-box" v-for="(item,index) in list" :key="index" @click="goTo(item.id)">
                        <div class="order-item-header">
                            <span style="line-height: 30px">订单号：{{item.order_no}}<br>创建时间：{{item.created_at}}</span>
                        </div>
                        <van-card
                            v-for="sub in item.orderDetails.data" :key="sub.id"
                            style="text-align: left"
                            :num="sub.num"
                            :price="sub.price+'.00'"
                            desc="全场包邮"
                            :title="sub.goods.title"
                            :thumb="sub.goods.cover_url"
                    />

                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>

</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useRoute,useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref,reactive,onMounted,toRefs,computed} from 'vue'
    import {getOrderList} from "network/order";
    import {Toast} from "vant";
    export default {
        name: "Order",
        components:{
            NavBar
        },
        setup(){
            const route = useRoute();
            const router = useRouter();
            const store = useStore();
            let tabs = ref(null)
            const state = reactive({
                loading:false,
                finished:false,
                refreshing:false,
                list:[],
                page:1,
                totalPage:0,
                status:0
            })

            onMounted(() =>{
                onRefresh()
            })

            const loadData = () =>{
                getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res => {
                    state.list = state.list.concat(res.data)
                    state.loading = false
                    console.log(state.page)
                    state.totalPage = res.meta.pagination.total_pages

                    if(state.page>=state.totalPage){
                        state.finished = true
                    }
                })
            }

            const onLoad = () => {

                if(!state.refreshing && state.page<state.totalPage){
                    state.page= state.page + 1
                }

                if(state.refreshing){
                    state.list = []
                    state.refreshing = false
                }



                loadData()
            }

            const onRefresh = () => {
                //是否处于加载状态，加载过程中不触发load事件
                state.refreshing = true
                //清空列表数据
                state.finished = false
                //重新加载数据
                state.loading = true

                state.page = 1
                onLoad()
            }

            const onChangeTab = (name) => {
                state.status = name
                onRefresh()
            }

            const goTo = (id) => {
                router.push({path:'/orderdetail',query:{id}})
            }

            return{tabs,...toRefs(state),loadData,onLoad,onChangeTab,goTo,onRefresh}
        }
    }
</script>

<style scoped lang="scss">
    .order-box{
        .order-tab{
            position: sticky;
            top: 45px;
            z-index: 999;
        }
        .content{
            position: relative;
            top: 50px;
            bottom: 65px;

            .order-list-refresh{

                .order-item-box{

                    margin: 10px ;
                    .order-item-header{
                        text-align: left;
                    }
                }
            }
        }

    }


</style>