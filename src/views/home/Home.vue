<template>
    <div id="home">
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>图书兄弟</template>
            <template v-slot:right></template>
        </nav-bar>
        <tab-content v-show="isshow" @tabclick="tabclick" :titles="['畅销','新书','精选']"></tab-content>
        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <home-swipe :banner="banners"></home-swipe>
                    <recommend-view :recommends="recommends"></recommend-view>
                </div>

                <tab-content @tabclick="tabclick" :titles="['畅销','新书','精选']"></tab-content>

                <goods-list :goods="showgoods"></goods-list>
            </div>
        </div>

        <back-top v-show="isshow" @bTop="btop"></back-top>

    </div>
</template>

<script>
    import HomeSwipe from "./childComs/HomeSwipe";
    import NavBar from "components/common/navbar/NavBar";
    import RecommendView from "./childComs/RecommendView";
    import TabContent from "components/content/tabcontent/TabContent";
    import BackTop from "components/common/backTop/BackTop";
    import {getHomeData,getGoods} from 'network/home';
    import {ref,onMounted,reactive,computed,watchEffect,nextTick} from 'vue'
    import GoodsList from "components/content/goods/GoodsList";
    import Bscroll from 'better-scroll'
    export default {
        name: "Home",
        components:{
            HomeSwipe,
            GoodsList,
            NavBar,RecommendView,TabContent,BackTop
        },

        setup(){
            const banners = ref([])
            const recommends = ref([])
            let currentype = ref('sales')
            let isshow = ref(false)
            let banref = ref(null)

            const showgoods = computed(() =>{
                return goods[currentype.value].list
            })

            const goods = reactive({
                sales:{page:1,list:[]},
                new:{page:1,list:[]},
                recommend:{page:1,list:[]}
            })
            let bscroll = reactive({})

            onMounted(() =>{
                getHomeData().then(res =>{
                    recommends.value = res.goods.data
                    banners.value = res.slides
                    console.log(res.slides);
                })

                getGoods('sales').then(res =>{
                    goods.sales.list = res.goods.data;
                })
                getGoods('recommend').then(res =>{
                    goods.recommend.list = res.goods.data;
                })
                getGoods('new').then(res =>{
                    goods.new.list = res.goods.data;
                })

                 bscroll = new Bscroll(document.querySelector(".wrapper"),{
                    probeType:3,    //0,1,2,3  3表示只要运动就触发scroll事件
                    click:true,     //是否允许点击
                    pullUpLoad:true //上拉加载更多,默认值为false
                })

                //触发滚动事件
                bscroll.on('scroll', (position) =>{
                    // console.log(position.y);
                    isshow.value = (-position.y) > banref.value.offsetHeight
                })

                //上拉加载数据，触发pullingUp
                bscroll.on('pullingUp',() =>{
                    console.log("上拉加载更多...")
                    const page = goods[currentype.value].page + 1;
                    getGoods(goods[currentype.value],page).then(res =>{
                        goods[currentype.value].list.push(...res.goods.data)
                        goods[currentype.value].page += 1
                    })

                    //完成上拉，等数据请求完成，将数据展示出来
                    bscroll.finishPullUp()
                    //重新计算高度
                    bscroll.refresh()

                    console.log("当前类型："+currentype.value+"当前页码："+page)
                })
            })

            const tabclick = (index) =>{
                let typelist = ['sales','new','recommend'];
                currentype.value = typelist[index];
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

            const btop = () =>{
                bscroll.scrollTo(0,0,500);
            }

            return{recommends,tabclick,goods,showgoods,isshow,banref,btop,banners}
        }
    }
</script>

<style scoped>
.banners img{
    width: 100%;
    height: 200px;
}
#home{
    height: 100vh;
    position: relative;
}
    .wrapper{
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0;
        right: 0;
        overflow: hidden;
    }
    .content{

    }
</style>