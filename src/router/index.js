import { createRouter, createWebHistory } from 'vue-router'
import Register from "../views/profile/Register";
import Login from "../views/profile/Login";
import { Notify ,Toast} from 'vant';
import store from '../store'
import Address from "../views/profile/Address";
import AddressEdit from "../views/profile/AddressEdit";
import CreateOrder from "../views/order/CreateOrder";
import Order from "../views/order/Order";
import OrderDetail from "../views/order/OrderDetail";

const Home = () => import('../views/home/Home')
const Cart = () => import('../views/cart/Cart')
const Category = () => import('../views/category/Category')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')


const routes = [
  {
    path: '/',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:"图书兄弟--首页"
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:"图书兄弟--首页"
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title:"图书兄弟--购物车",
      isAuthRequired:true
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta:{
      title:"图书兄弟--购物车",
      isAuthRequired:true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta:{
      title:"图书兄弟--购物车",
      isAuthRequired:true
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:"图书兄弟--商品分类"
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:"图书兄弟--个人中心",
      isAuthRequired:true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:"图书兄弟--地址管理",
      isAuthRequired:true
    }
  },
  {
    path: '/addressedit',
    name: 'Addressedit',
    component: AddressEdit,
    meta:{
      title:"图书兄弟--地址编辑",
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta:{
      title:"图书兄弟--订单预览",
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:"图书兄弟--用户注册"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:"图书兄弟--用户登录"
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:"图书兄弟--商品详情"
    }
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to,from,next) =>{
    //没有登录，同意跳转login
  if(to.meta.isAuthRequired && store.state.user.islogin ===false){
    Notify('您还未登录，请先登录');
    return next('/login')
  }else{
    next();
  }

    document.title = to.meta.title;
})

export default router
