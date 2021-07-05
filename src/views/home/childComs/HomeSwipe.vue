<template>
    <van-swipe v-if="banner.length" class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in banner" :key="index">
            <img v-lazy="item.img_url" alt="">
        </van-swipe-item>
    </van-swipe>
</template>

<script>
    export default {
        name: "HomeSwipe",
        props:{
            banner:{
                type:Array,
                default(){
                    return [];
                }
            }
        }
    }
</script>

<style scoped>
    img{
        width: 100%;
        height: auto;
    }
</style>