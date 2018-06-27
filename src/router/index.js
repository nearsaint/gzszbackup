import Vue from 'vue'
import Router from 'vue-router'

//引入组件到路由
//首页
import index from 'views/index.vue'
import bigData from 'views/bigData.vue'
//设备
import group from 'views/group.vue'
import devices from 'views/devices.vue'
import device from 'views/device.vue'
import property from 'views/property.vue'
//预警
import msg from 'views/msg.vue'
import msgs from 'views/msgs.vue'
import part from 'views/part.vue'
import parts from 'views/parts.vue'
import partAdd from 'views/partAdd.vue'
//能耗
import powers from 'views/powers.vue'
import power from 'views/power.vue'
//人员
import users from 'views/users.vue'
import user from 'views/user.vue'
import location from 'views/location.vue'
//质量与配方
import orders from 'views/orders.vue'
import order from 'views/order.vue'
import recipe from 'views/recipe.vue'
import recipes from 'views/recipes.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index,
    },
    {
      path: '/bigData',
      name: 'bigData',
      component: bigData,
    },

    //设备管理
    {
      path: '/group/:groupID',
      name: 'group',
      component: group,
    },
    {
      path: '/devices',
      name: 'devices',
      component: devices,
    },
    {
      path: '/device/:deviceID',
      name: 'device',
      component: device,
      children: [{
        path: 'property/:propertyID',
        name: 'property',
        component: property,
      }, ],
    },

    //预警报警
    {
      path: '/msgs',
      name: 'msgs',
      component: msgs,
      children: [{
        path: '/msg/:msgID',
        name: 'msg',
        component: msg,
      }, ],
    },
    {
      path: '/parts',
      name: 'parts',
      component: parts,
      children: [{
        path: 'part/:partID',
        name: 'part',
        component: part,
      }, {
        path: 'partAdd',
        name: 'partAdd',
        component: partAdd,
      }, ],
    },

    //能耗管理
    {
      path: '/powers',
      name: 'powers',
      component: powers,
      children: [{
        path: '/power/:powerID',
        name: 'power',
        component: power,
      }, ],
    },

    //人员管理
    {
      path: '/users',
      name: 'users',
      component: users,
      children: [{
        path: '/user/:userID',
        name: 'user',
        component: user,
      }, ],
    },
    {
      path: '/location',
      name: 'location',
      component: location,
    },


    //质量与配方
    {
      path: '/orders',
      name: 'orders',
      component: orders,
      children: [{
        path: '/order/:orderID',
        name: 'order',
        component: order,
      }, ],
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: recipes,
      children: [{
        path: '/recipe/:recipeID',
        name: 'recipe',
        component: recipe,
      }, ],
    },
  ]
})