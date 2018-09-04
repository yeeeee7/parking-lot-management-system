import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Registor from '@/components/registor'
import ParkPot from '@/components/view/parkPot/parkPot'
import AddParkPot from '@/components/view/parkPot/addParkPot'
import ParkSpace from '@/components/view/parkPot/parkSpace/parkSpace'
import User from '@/components/view/user/user'
import PayRule from '@/components/view/payRule/payRule'
import Profit from '@/components/view/profit/profit'
import Comment from '@/components/view/comment/comment'
import MySelf from '@/components/view/mySelf/mySelf'
import Card from '@/components/view/card/card'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/registor',
      name: 'Registor',
      component: Registor
    },
    {
      path: '/index',
      name: 'User',
      component: User
    },
      {
      path: '/parkpot',
      name: 'ParkPot',
      component: ParkPot
    },
      {
      path: '/parkSpace',
      name: 'ParkSpace',
      component: ParkSpace
    }, {
      path: '/user',
      name: 'User',
      component: User
    }, {
      path: '/payRule',
      name: 'PayRule',
      component: PayRule
    },{
      path: '/profit',
      name: 'Profit',
      component: Profit
    },{
      path: '/comment',
      name: 'Comment',
      component: Comment
    },{
      path: '/mySelf',
      name: 'Myself',
      component: MySelf
    },{
      path: '/addParkPot',
      name: 'AddParkPot',
      component: AddParkPot
    },{
      path: '/card',
      name: 'Card',
      component:Card
    },

  ]
})
