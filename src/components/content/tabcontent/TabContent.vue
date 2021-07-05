<template>
    <div class="tab-content">
        <div class="tab-content-item" v-for="(item,index) in titles"
             :key="index" @click="itemClick(index)" :class="{active:currentindex==index}">
            <span>{{item}}</span>
        </div>

    </div>
</template>

<script>
    import {ref} from 'vue'
    export default {
        name: "TabContent",
        props:{
            titles:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        setup(props,{emit}){
            let currentindex = ref(0);
            const itemClick = (index) => {
                currentindex.value = index;
                emit('tabclick',index)
            }

            return{
                currentindex,itemClick
            }
        }

    }
</script>

<style scoped lang="scss">
    .tab-content{
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        background-color: #FFFFFF;
        position: sticky;
        top: 44px;
        z-index: 10;
        .tab-content-item{
            flex: 1;
            span{
                padding: 6px;
            }
        }
        .active{
            color: var(--color-tint);
            span{
                border-bottom: 3px solid var(--color-tint);
            }
        }

    }
</style>