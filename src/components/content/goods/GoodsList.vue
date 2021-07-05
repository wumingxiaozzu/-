<template>
    <div class="goods-list">
        <good-item v-for="item in goods" :key="item" :product="item"></good-item>
    </div>
</template>

<script>
    import GoodItem from "./GoodItem";
    export default {
        name: "GoodsList",
        components:{
            GoodItem
        },
        props:{
            goods: {
                type:Array,
                default(){
                    return [];
                }
            }
        }
    }
</script>

<style scoped>
    .goods-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding:5px;
    }
</style>