<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>购物车</template>
            <template v-slot:right></template>
        </nav-bar>
        <div class="cart-box">
            <div class="cart-body">
                <van-checkbox-group ref="checkboxgroup" v-model="result" @change="groupChange">
                    <van-swipe-cell :right-width="50" v-for="(item,index) in list" :key="index">
                        <div class="goods-item">
                            <van-checkbox :name="item.id"/>
                            <div class="goods-img"><img :src="item.goods.cover_url" alt=""></div>
                            <div class="goods-desc">
                                <div class="goods-title">
                                    <span>{{item.goods.title}}</span>
                                    <span>x{{item.goods.stock}}</span>
                                </div>
                                <div class="goods-btn">
                                    <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
                                    <van-stepper integer :min="1" :max="item.goods.stock" :model-value="item.num" :name="item.id" async-change @change="onChange" />
                                </div>
                            </div>
                        </div>
                        <template #right>
                            <van-button square icon="delete" type="danger" class="delete-button" @click="deletegood(item.id)"/>
                        </template>
                    </van-swipe-cell>
                </van-checkbox-group>
            </div>
            <van-submit-bar class="submit-all" :price="total*100" @submit="onSubmit" button-text="结算">
                <van-checkbox v-model:checked="checkAll" @click="checkedAll">全选</van-checkbox>
            </van-submit-bar>
            <div class="empty" v-if="!list.length">
                <img class="empty-cart" src="~assets/images/5.jpg" alt="空购物车">
                <div class="title">购物车空空如也</div>
                <van-button round color="#1baeae" type="primary" block @click="goto">前往选购</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useStore} from 'vuex'
    import {useRouter} from 'vue-router'
    import {reactive,ref,toRefs,onMounted,computed} from 'vue'
    import {getCart,modifyCart,deleteCartItem,checkedCart} from "network/cart";
    import { Notify ,Toast} from 'vant';
    export default {
        name: "Cart",
        components:{
            NavBar
        },
        setup(){
            const store = useStore();
            const router = useRouter();

            const state = reactive({
                list:[],
                result:[],
                checkAll:true
            })

            const init= () => {
                Toast.loading({message:'加载中...',forbidClick:true})

                getCart('include=goods').then(res =>{
                    state.list = res.data
                    console.log(res.data);

                    state.result = res.data.filter(n => n.is_checked == 1).map(item => item.id)


                })



                Toast.clear()
            }

            onMounted(() => {
                init()
            })

            const onChange = (value,detail) =>{
                console.log(value);
                console.log(detail.name);
                Toast.loading({message:'修改中...',forbidClick:true})

                modifyCart(detail.name,{num:value}).then(res => {
                    state.list.forEach(item => {
                        if(item.id == detail.name){
                            item.num = value
                        }
                    })


                    Toast.clear()
                })
            }


            //复选框选中修改
            const groupChange = (result) =>{
                if(result.length == state.list.length){
                    state.checkAll = true
                }else {
                    state.checkAll = false
                }

                console.log(result);

                checkedCart({cart_ids:result})

            }

            //全选
            const checkedAll = () => {
                if(!state.checkAll){
                    state.result = state.list.map(item => item.id)
                    state.checkAll = true
                }else {
                    state.result = []
                    state.checkAll = false
                }

            }

            //删除商品
            const deletegood = (id) =>{
                deleteCartItem(id).then(res =>{
                    init();  //重新初始化购物车

                    store.dispatch('updateCount')
                })
            }

            //计算总价
            const total = computed(()=>{
                let sum = 0;

                state.list.filter(item => state.result.includes(item.id))
                    .forEach(item =>{
                        sum += parseInt(item.num) * parseFloat(item.goods.price)
                    })

                return sum;
            })

            //结算并创建订单
            const onSubmit = () =>{
                if(state.result.length == 0){
                    Toast.fail('请选择商品进行结算')
                    return
                }else {
                    router.push({path:'/createorder'})
                }
            }

            const goto = () =>{
                router.push({path:'/home'})

            }

            return{...toRefs(state),goto,onChange,groupChange,checkedAll,deletegood,total,onSubmit}
        }
    }
</script>

<style scoped lang="scss">
.cart-box{
    .cart-body{
        margin: 60px 0 100px 0;
        padding-left: 10px;
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
        .delete-button{
            width: 50px;
            height: 100%;
        }
    }
    .empty{
        width: 50%;
        margin: 0 auto;
        text-align: center;
        margin-top: 20px;
        .empty-cart{
            width: 150px;
            margin-bottom: 20px;
        }
        .van-icon-smile-o{
            font-size: 50px;
        }
        .title{
            font-size: 16px;
            margin-bottom: 20px;
        }
    }
    .submit-all{
        margin-bottom: 55px;
        .van-checkbox{
            margin-left: 0px;
        }
        .van-submit-bar__text{
            margin-right: 10px;
        }
        .van-submit-bar__button{
            background: red;
        }
    }
    .van-checkbox__icon--checked .van-icon{
        background: red;
        border-color: red;
    }
}


</style>