<template>
  <div class="home">
    {{banner}}
  </div>
</template>

<script>
  import {onMounted,ref} from 'vue'
  import {getHomeData} from "network/home";

  export default {
  name: 'Home',
  components: {

  },
  data(){
    return{
      imgurl:require("assets/images/1.jpg")
    }
  },
    setup(){
      const banner = ref([])
      onMounted(() => {
        getHomeData().then(res =>{
          banner.value = res.slides
          console.log(res.slides);
        }).catch(err =>{
          console.log(err);
        })
      })
      return{banner}
    }

}
</script>

<style>
  img{
    width: 350px;
    height: 450px;
  }
  .demo1{
    color:var(--color-high-text);
  }
</style>
