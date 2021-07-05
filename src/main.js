import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import { PullRefresh ,List,Grid, GridItem,Popup,Area,AddressEdit,AddressList,Icon,SwipeCell,Stepper,Checkbox, CheckboxGroup,SubmitBar,Form,Field,Swipe, SwipeItem ,Lazyload,Badge, Sidebar, SidebarItem,Collapse, CollapseItem, Tab, Tabs,Card,Image as VanImage,Tag,Button } from 'vant';

createApp(App)
    .use(Swipe).use(SwipeItem).use(Lazyload,{
        loading:require("./assets/images/4.jpg")
        }).use(Badge).use(store).use(router).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
    .use(Tab).use(Tabs).use(Card).use(VanImage).use(Tag).use(Button).use(Form).use(Field).use(SubmitBar)
    .use(Checkbox).use(CheckboxGroup).use(Stepper).use(SwipeCell).use(Icon).use(AddressEdit).use(AddressList).use(Area)
    .use(Popup).use(Grid).use(GridItem).use(List).use(PullRefresh)
    .mount('#app')
