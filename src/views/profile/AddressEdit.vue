<template>
    <div class="address-edit-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                {{title}}
            </template>
        </nav-bar>
        <van-address-edit
                class="edit"
                :area-list="areaList"
                :address-info="addressInfo"
                :show-delete="type == 'edit'"
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
        />

    </div>
</template>
<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useRoute,useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref,reactive,onMounted,toRefs,computed} from 'vue'
    import { Toast } from 'vant';
    import {addAddress,getAddressDetail,modifyAddress,deleteAddress} from "network/address";
    import { areaList } from '@vant/area-data';
    export default {
        name: "AddressEdit",
        components:{
            NavBar
        },
        setup(){
            const route = useRoute();
            const router = useRouter();
            const store = useStore();
            const state = reactive({
                areaList:areaList,
                searchResult:[],
                addressInfo:{},
                type:'add',
                addressId:''
            })

            onMounted(() =>{
                const {type,addressId} = route.query

                state.type = type
                state.addressId = addressId


                if(type == 'edit'){
                    getAddressDetail(addressId).then(res => {
                        const addressDetail = res
                        let _areaCode = ''
                        const province = state.areaList.province_list;
                        const  county = state.areaList.county_list;
                        const city = state.areaList.city_list;
                        let provincekey = ''
                        let citykey = ''
                        for (let key in county){
                            if(county[key] == addressDetail.county){
                                for(let key1 in province){
                                    if(key1.substr(0,2)  == key.substr(0,2)){
                                        provincekey = key1
                                        // console.log(provincekey);
                                    }
                                }
                                for(let key2 in city){
                                    if(key2.substr(0,4)  == key.substr(0,4)){
                                       citykey = key2
                                        // console.log(citykey);
                                    }
                                }
                                if (province[provincekey] == addressDetail.province && city[citykey] == addressDetail.city){
                                    console.log(key);
                                    _areaCode = key
                                }
                            }
                        }


                        state.addressInfo = {
                            name:addressDetail.name,
                            tel:addressDetail.phone,
                            province:addressDetail.province,
                            city:addressDetail.city,
                            county:addressDetail.county,
                            addressDetail:addressDetail.address,
                            areaCode : _areaCode,
                            isDefault:!!addressDetail.is_default

                        }
                    })
                }

            })

            const title = computed(() =>{
                return state.type == 'add' ? '新增地址' : '编辑地址'
            })

            const onSave = (content) =>{
                console.log(content);
                const params = {
                    name:content.name,
                    phone:content.tel,
                    province:content.province,
                    city:content.city,
                    county:content.county,
                    address:content.addressDetail,
                    is_default:content.isDefault ? 1 : 0

                }
                if(state.type == 'edit'){
                    modifyAddress(state.addressId,params)
                }else if (state.type == 'add'){
                    addAddress(params);
                }


                Toast.success("保存成功")
                setTimeout(() =>{
                    router.back();
                },1000)
            }

            const onDelete = () =>{
                deleteAddress(state.addressId).then(res => {
                    Toast.success("删除成功")
                    setTimeout(() =>{
                        router.back();
                    },1000)
                })
            }

            return{...toRefs(state),onDelete,onSave,title}
        }

    }
</script>

<style lang="scss">
    .edit{
        .van-field__body{
            textarea{
                height: 26px !important;
            }
        }
    }
    .address-edit-box{
        margin-top: 44px;
        .van-address-edit{
            .van-button {
                background: var(--color-tint);
                border-color: var(--color-tint);
            }
            .van-switch--on {
                background-color: var(--color-tint);
            }
        }
    }
    .van-button--default {
        color: #323233;
        background-color: #fff !important;
        border: 1px solid #ebedf0 !important;
    }
</style>