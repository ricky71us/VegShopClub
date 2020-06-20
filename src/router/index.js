import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Register from "../views/Register.vue";
import About from "../views/About.vue";
import ManageItems from "../views/ManageItems.vue";
//import PurchaseOrder from "../views/PurchaseOrder.vue";
import OrderEntry from "../views/OrderEntry.vue";
import BulkOrder from "../views/BulkOrder.vue";
import Orders from "../views/Orders.vue";
import AllUserOrders from "../views/AllUserOrders.vue";

import VueAnalytics from "vue-analytics";
import store from "../store";

Vue.use(VueRouter);
//const parseProps = r => ({ id: parseInt(r.params.id) });
const routes = [
  {
    path: "/",
    redirect: "/orderEntry",
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/orderEntry",
    name: "orderEntry",
    component: OrderEntry,
    meta: { requiresAuth: true },
  },
  {
    path: "/allUserOrders",
    name: "allUserOrders",
    component: AllUserOrders,
    meta: { requiresAuth: true },
  },
  {
    path: "/bulkOrder",
    name: "bulkOrder",
    component: BulkOrder,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/purchaseOrder",
  //   name: "purchaseOrder",
  //   component: PurchaseOrder,
  // },
  {
    path: "/login",
    name: "login",
    component: Login,   
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/manageitems",
    name: "ManageItems",
    component: ManageItems,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.name !== "login" && store.getters["getUserName"] === "Guest")
      next({ name: "login" });
    else next();
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

Vue.use(VueAnalytics, {
  id: "UA-163162436-1",
  router,
});
export default router;
