<template>
    <nav-bar>
        <template v-slot:left></template>
        <template v-slot:default>商品分类</template>
        <template v-slot:right></template>
    </nav-bar>

    <div id="mainbox">
        <div class="taborder">
            <van-tabs v-model="active" @click="clickTab" >
                <van-tab title="销量排序"></van-tab>
                <van-tab title="价格排序"></van-tab>
                <van-tab title="评论排序"></van-tab>
            </van-tabs>
        </div>

        <van-sidebar v-model="activeKey" class="leftmenu">
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item v-for="item in categories" :key="item.id" :title="item.name"  :name="item.name">
                    <van-sidebar-item v-for="sub in item.children" :title="sub.name" @click="clickid(sub.id)"/>
                </van-collapse-item>
            </van-collapse>
        </van-sidebar>


        <div class="goodslist">
            <div class="content">
                <van-card

                        v-for="item in showGoods" :key="item.id"
                        @click="goodsDetail(item.id)"
                        :num="item.comments_count"
                        :tag="item.comments_count >= 0 ? '流行':'标签'"
                        :price="item.price"
                        :desc="item.updated_at"
                        :title="item.title"
                        :thumb="item.cover_url"
                        :lazy-load="true"
                />

            </div>
        </div>
        <back-top v-show="isshow" @bTop="btop"></back-top>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {reactive, ref, onMounted, computed, nextTick, watchEffect} from 'vue';
    import {getCategory,getCategoryGoods} from "network/category";
    import Bscroll from 'better-scroll';
    import BackTop from "components/common/backTop/BackTop";
    import {useRouter} from 'vue-router'

    export default {
        name: "Category",
        components:{
            NavBar,BackTop
        },
        setup(){
            let router = useRouter();
            let activeKey = ref(0);
            let categories = ref([]);
            let activeName = ref(1);
            let active = ref(1)
            let currentindex = ref('sales')
            let currentid = ref(0)
            let bscroll = reactive({})
            let isshow = ref(false)

            const goods = reactive({
                sales:{page:1,list:[]},
                price:{page:1,list:[]},
                comments_count:{page:1,list:[]}
            })

            const showGoods = computed(() => {
                return goods[currentindex.value].list
            })

            onMounted(() =>{
                getCategory().then(res =>{
                    categories.value = res.categories
                    console.log(categories.value);
                })

                getCategoryGoods('sales',currentid.value).then(res =>{
                        goods.sales.list = res.goods.data;
                })

                bscroll = new Bscroll(document.querySelector(".goodslist"),{
                    probeType:3,    //0,1,2,3  3表示只要运动就触发scroll事件
                    click:true,     //是否允许点击
                    pullUpLoad:true //上拉加载更多,默认值为false
                })

                //触发滚动事件
                bscroll.on('scroll', (position) =>{
                    // console.log(position.y);
                    isshow.value = (-position.y) > 300
                })

                //上拉加载数据，触发pullingUp
                bscroll.on('pullingUp',() =>{
                    console.log("上拉加载更多...")
                    const page = goods[currentindex.value].page + 1;
                    getCategoryGoods(goods[currentindex.value],currentid.value,page).then(res =>{
                        goods[currentindex.value].list.push(...res.goods.data)
                        goods[currentindex.value].page += 1
                    })

                    //完成上拉，等数据请求完成，将数据展示出来
                    bscroll.finishPullUp()
                    //重新计算高度
                    bscroll.refresh()

                    console.log("当前类型："+currentindex.value+"当前页码："+page)
                })
            })


            //排序选项卡
            const clickTab = (index) =>{
                let orders =['sales','price','comments_count'];
                currentindex.value = orders[index];
                console.log("排序类型："+currentindex.value);
                console.log("商品id："+currentid.value);

                getCategoryGoods(currentindex.value,currentid.value).then(res =>{
                    goods[currentindex.value].list = res.goods.data;
                })
                nextTick(() =>{
                    //重新计算高度
                    bscroll && bscroll.refresh()
                })

            }

            //选择分类
            const clickid = (id) =>{
                currentid.value = id;
                console.log("排序类型："+currentindex.value);
                console.log("商品id："+currentid.value);
                getCategoryGoods(currentindex.value,currentid.value).then(res =>{
                    goods[currentindex.value].list = res.goods.data;
                    console.log(res.goods.data);
                })
                nextTick(() =>{
                    //重新计算高度
                    bscroll && bscroll.refresh()
                })

            }

            //监听所有有变化的便改良
            watchEffect(() =>{
                nextTick(() =>{
                    //重新计算高度
                    bscroll && bscroll.refresh()
                })
            })

            const btop = () => {
                bscroll.scrollTo(0, 0, 500);
            }

            return {activeKey,categories,activeName,active,
                    clickTab,currentindex,currentid,clickid,
                    goods,showGoods,btop,bscroll,isshow,
                    goodsDetail:(id) =>{
                        router.push({path:'/detail',query:{id}})
                    }
            }
        }
    }
</script>

<style scoped lang="scss">
#mainbox{
    margin-top: 45px;
    display: flex;
    .taborder{
        flex: 1;
        height: 50px;
        z-index: 9;
        position: fixed;
        top: 45px;
        right: 0;
        left: 130px;
    }
    .leftmenu{
        position: fixed;
        top:95px;
        left: 0;
        width: 130px;

    }
    .goodslist{
        flex: 1;
        position: absolute;
        top: 100px;
        left: 130px;
        right: 0;
        height: 100vh;
        padding: 10px;
        text-align: left !important;
        .content{
            padding-top: 100px;
        }
    }
}
.van-card__thumb {
    width: 68px !important
}
</style>