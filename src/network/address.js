import {request} from './request'


//添加地址
export function addAddress(data) {
    return request({
        url:"/api/address",
        method:'post',
        data
    })
}

//编辑地址
export function modifyAddress(id,data) {
    return request({
        url:`/api/address/${id}`,
        method:'put',
        data
    })
}

//获取地址详情
export function getAddressDetail(id) {
    return request({
        url:`/api/address/${id}`
    })
}


//获取地址列表
export function getAddress() {
    return request({
        url:"/api/address",
    })
}

//删除商品
export function deleteAddress(id) {
    return request({
        url:`/api/address/${id}`,
        method:'delete'
    })
}