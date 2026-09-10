import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductDetailsPage from '../pages/ProductDetailsPage.vue'
import CartPage from '../pages/CartPage.vue'
import CheckoutPage from '../pages/CheckoutPage.vue'
import OrderSuccessPage from '../pages/OrderSuccessPage.vue'
import WishlistPage from '../pages/WishlistPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import TermsPage from '../pages/TermsPage.vue'
import WarrantyPage from '../pages/WarrantyPage.vue'
import ComparePage from '../pages/ComparePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import AdminLoginPage from '../pages/AdminLoginPage.vue'

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
      path: '/about',
      component: AboutPage,
    },
    {
      path: '/terms',
      component: TermsPage,
    },
    {
      path: '/warranty',
      component: WarrantyPage,
    },
    {
      path: '/compare',
      component: ComparePage,
    },
    {
      path: '/contact',
      component: ContactPage,
    },
    {
      path: '/custom-print',
      component: () => import('../pages/CustomPrintPage.vue'),
    },
    {
      path: '/admin',
      component: AdminPage,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/login',
      component: AdminLoginPage,
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
            },
            {
  path: '/success',
  component: OrderSuccessPage,
},
{
  path: '/wishlist',
  component: WishlistPage,
},
{
  path: '/:pathMatch(.*)*',
  component: NotFoundPage,
},
  ],
})

router.beforeEach((to) => {
  const isAdmin = localStorage.getItem('printpro3d_admin_session') === 'authenticated'
  if (to.meta.requiresAdmin && !isAdmin) return { path: '/admin/login', query: { redirect: to.fullPath } }
  if (to.path === '/admin/login' && isAdmin) return '/admin'
})

export default router
