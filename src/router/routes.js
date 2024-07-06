import { components } from 'vuetify/dist/vuetify-labs.js'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path:'register', component:()=> import('pages/register.vue')},
      { path: 'user', component:()=> import('pages/user.vue')},
      { path: 'login', component:()=> import('pages/login.vue')},
      { path: 'product', component:()=> import('pages/product.vue')},
      { path: 'admin', component:()=>import('pages/admin.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes