const mutations = {
    setIslogin(state,payload){
        state.user.islogin = payload
    },
    addCount(state,payload){
        state.addCount = payload.count
    }
}
export default mutations

