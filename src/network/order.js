import {request} from './request'


//创建订单
export function createOrder(data) {
    return request({
        url:"/api/orders",
        method:'post',
        data
    })
}

//获取订单预览
export function getOrderPreview() {
    return request({
        url:"/api/orders/preview"
    })
}

//订单支付
export function payOrder(order,params) {
    return request({
        url:`/api/orders/${order}/pay`,
        params

    })
}


//获取订单状态
export function getOrderStatus(order) {
    return request({
        url:`/api/orders/${order}/status`
    })
}


//获取订单列表
export function getOrderList(params) {
    return request({
        url:"/api/orders",
        method:'get',
        params
    })
}

//获取订单详情
export function getOrderDetail(order) {
    return request({
        url:`/api/orders/${order}`,
        params:{
            include:'user,orderDetails.goods'
        }
    })
}

//确认订单
export function confirmOrder(order) {
    return request({
        url:`/api/orders/${order}/confirm`,
        method:'patch'
    })
}

//获取物流信息
export function viewExpress(order) {
    return request({
        url:`/api/orders/${order}/express`
    })
}