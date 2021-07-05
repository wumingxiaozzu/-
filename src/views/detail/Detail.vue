<template>
    <nav-bar>
        <template v-slot:left></template>
        <template v-slot:default>商品详情:{{id}}</template>
        <template v-slot:right></template>
    </nav-bar>
    <van-image
            style="margin-top: 50px"
            width="100%"
            lazy-load
            :src="detail.cover_url"
    />
    <van-card
            style="text-align: left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
    >
        <template #tags>
            <van-tag plain type="danger">畅销</van-tag>
            <van-tag plain type="danger">新书</van-tag>
        </template>
        <template #footer>
            <van-button type="warning" @click="addcart">加入购物车</van-button>
            <van-button type="danger" @click="goTo">立即购买</van-button>
        </template>
    </van-card>
    <van-tabs v-model="active">
        <van-tab title="概述">
            <div class="content" v-html="detail.details"></div>
        </van-tab>
        <van-tab title="热评">
            <div class="comments" style="padding-bottom: 60px">
                  <span style="height: 60px;line-height: 60px;overflow: hidden">暂无评论</span>
            </div>
        </van-tab>
        <van-tab title="相关图书">
            <goods-list :goods="like_goods"></goods-list>
        </van-tab>
    </van-tabs>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import GoodsList from "components/content/goods/GoodsList";
    import {useRoute,useRouter} from 'vue-router';
    import {ref,onMounted,reactive,toRefs} from 'vue';
    import {getDetail} from "network/detail";
    import {addCart} from "network/cart";
    import { Notify ,Toast} from 'vant';
    import {useStore} from 'vuex'

    export default {
        name: "Detail",
        components:{
            NavBar,GoodsList
        },
        setup(){
            const route = useRoute();
            const router =useRouter();
            const store = useStore();
            let active = ref(1)

            let id = ref(0);
            id.value = route.query.id;
            let book = reactive({
                detail:{},
                like_goods:[]
            })


            onMounted(() =>{
                getDetail(id.value).then(res =>{
                    book.detail = res.goods;
                    book.like_goods = res.like_goods
                    console.log(book.detail)

                })
            })

            //添加购物车
            const addcart = () =>{
                addCart({goods_id:book.detail.id,num:1}).then(res =>{
                    if(res.status == '201' || res.status == '204'){
                        Toast.success('添加成功');
                        store.dispatch('updateCount')
                    }
                })
            }

            //立即购买
            const goTo = () => {
                addCart({goods_id:book.detail.id,num:1}).then(res =>{
                    if(res.status == '201' || res.status == '204'){
                        Toast.success('添加成功,显示购物车')
                        store.dispatch('updateCount')
                        router.push({path:'/cart'})
                    }
                })
            }

            return{id,...toRefs(book),active,addcart,
            goTo}
        }
    }
</script>

<style scoped lang="scss">
    .content {
        padding: 10px;

    }
    .van-card{
        padding: 0 7px !important;
    }
</style>