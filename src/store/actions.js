import {getCart} from "network/cart";

const actions = {
    updateCount({commit}){
        getCart().then(res => {
            commit('addCount',{count:res.data.length || 0})
        })
    }
}

export default actions