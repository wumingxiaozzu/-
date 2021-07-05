<template>
    <div class="recommend">
        <div class="recommend-item" v-for="item in recommends.splice(0,4)" :key="item.id">
            <a href="" @click.prevent="goD(item.id)">
                <img v-lazy="item.cover_url" alt="">
            </a>
            <div>{{item.title}}</div>
        </div>

    </div>
</template>

<script>
    import {useRouter} from 'vue-router'
    export default {
        name: "RecommendView",
        props:{
            recommends:{
                type:Array,
                default:[]
            }
        },
        setup(){
            const router = useRouter();

            const goD = (id) =>{
                router.push({path:'/detail',query:{id}})
            }
            return {goD}
        }
    }
</script>

<style scoped lang="scss">
    .recommend{
        display: flex;
        width: 100%;
        text-align: center;
        padding: 15px 0 30px;
        border-bottom: 8px solid #eeeeee;
        font-size: 12px;
    }
    .recommend-item{
        flex: 1;
        img{
            width: 70px;
            height: 70px;
            margin-bottom: 10px;
        }
    }

</style>