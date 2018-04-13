import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import SearchResults from '@/components/SearchResults'
import HashTag from '@/components/HashTag'
import UserPage from '@/components/UserPage'
import CreateChannel from '@/components/CreateChannel'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '/hashtag/:hashtag',
      name: 'HashTag',
      component: HashTag
    },
    {
      path: '/user/:userID',
      name: 'UserPage',
      component: UserPage
    },
    {
      path: '/create/:gid',
      name: 'CreateChannel',
      component: CreateChannel
    }
  ]
})
