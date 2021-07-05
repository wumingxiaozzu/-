import {request} from './request'

export function getHomeData() {
    return request({
        url:"/api/index",
    })
}

export function getGoods(type='sales',page=1) {
    return request({
        url:"/api/index?"+type+"=1&page="+page,
    })
}