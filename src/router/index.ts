import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductDetailsPage from '../pages/ProductDetailsPage.vue'
import CartPage from '../pages/CartPage.vue'
import CheckoutPage from '../pages/CheckoutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/products',
      component: ProductsPage,
    },
    {
      path: '/products/:id',
      component: ProductDetailsPage,
    },
    {
    path: '/cart',
    component: CartPage,
    },
    {
        path: '/checkout',
        component: CheckoutPage
            }
  ],
})

export default router