import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import DashboardU from "../views/DashboardUser.vue";
import Report from "../views/Report.vue";
import Register from "../views/Register.vue";
import About from "../views/About.vue";
import ManageItems from "../views/ManageItems.vue";
import ManageUsers from "../views/ManageUsers.vue";
//import PurchaseOrder from "../views/PurchaseOrder.vue";
import OrderEntry from "../views/OrderEntry.vue";
import BulkOrder from "../views/BulkOrder.vue";
import Orders from "../views/Orders.vue";
import AllUserOrders from "../views/AllUserOrders.vue";
import OrderRecon from "../views/OrderRecon.vue";
import PackagingByItem from "../views/PackagingByItem.vue";
import Profile from "../views/Profile.vue";
import AccessDenied from "../views/AccessDenied.vue";
import OrderReport from "../views/OrderReport.vue";
import PackerSchedule from "../views/PackerSchedule.vue";
import TestPage from "../views/TestPage.vue";

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
    path: "/accessDenied",
    name: "accessDenied",
    component: AccessDenied,
  },
  {
    path: "/testpage",
    name: "TestPage",
    component: TestPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/dashboardU",
    name: "dashboardU",
    component: DashboardU,
    meta: { requiresAuth: true, adminOnly: false },
  },
  {
    path: "/report",
    name: "report",
    component: Report,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/orderEntry",
    name: "orderEntry",
    component: OrderEntry,
    meta: { requiresAuth: true },
  },
  {
    path: "/orderReport",
    name: "orderReport",
    component: OrderReport,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/orderRecon",
    name: "orderRecon",
    component: OrderRecon,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/packagingByItem",
    name: "packagingByItem",
    component: PackagingByItem,
    meta: { requiresAuth: true, packerOnly: true },
  },
  {
    path: "/allUserOrders",
    name: "allUserOrders",
    component: AllUserOrders,
    meta: { requiresAuth: true, packerOnly: true },
  },
  {
    path: "/bulkOrder",
    name: "bulkOrder",
    component: BulkOrder,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: { requiresAuth: true, adminOnly: true },
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
    meta: { requiresAuth: true, adminOnly: true },
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
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/manageUsers",
    name: "ManageUsers",
    component: ManageUsers,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/packerSchedule",
    name: "PackerSchedule",
    component: PackerSchedule,
    meta: { requiresAuth: true, adminOnly: false },
  },
];

const router = new VueRouter({
  //mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(store.state.user.lastlogindate);
  var timeSinceLastLogin =
    Date.now() - new Date(store.state.user.lastlogindate);
  console.log(timeSinceLastLogin);
  var HoursSinceLastLogin = Math.abs(timeSinceLastLogin / 36e5);
  console.log(HoursSinceLastLogin);
  if (HoursSinceLastLogin > 4 && from.name !== "login") {
    //|| store.state.user.lastlogindate === null
    //|| isNaN(HoursSinceLastLogin)
    //console.log(timeSinceLastLogin);
    //console.log(Math.floor((timeSinceLastLogin / (1000 * 60 * 60)) % 24))
    store.state.user = "";
    store.state.isUserLoggedIn = false;
  }
  Vue.$ga.set(
    "userId",
    `${store.state.user.firstname} ${store.state.user.lastname}`
  );
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // console.log(to.name);
    // console.log(store.state.isUserLoggedIn);
    if (to.name !== "login" && !store.state.isUserLoggedIn) {
      //  console.log("test1111");
      //  console.log(from);
      next({ name: "login" });
    } else if (
      to.matched.some(
        (record) =>
          record.meta.adminOnly &&
          parseInt(store.state.user.isAdmin) === parseInt(0)
      )
    ) {
      next({ name: "accessDenied" });
    } else if (
      to.matched.some(
        (record) =>
          record.meta.packerOnly &&
          parseInt(store.state.user.isPacker) === parseInt(0) &&
          parseInt(store.state.user.isAdmin) === parseInt(0)
      )
    ) {
      next({ name: "accessDenied" });
    } else {
      // console.log("Inside Else")
      next();
    }
  } else if (to.name === "login" && store.state.isUserLoggedIn) {
    // console.log("test2222");
    // console.log(from);
    next({ name: "orderEntry" });
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

// router.afterEach(() => {
//   console.log(store.state.user.lastlogindate);
//   var timeSinceLastLogin = Date.now() - new Date(store.state.user.lastlogindate);
//   console.log(timeSinceLastLogin);
//   var minutesSinceLastLogin = Math.floor((timeSinceLastLogin / (1000 * 60)) % 60);
//   console.log(minutesSinceLastLogin);
//   if(minutesSinceLastLogin > 1 || store.state.user.lastlogindate === null){
//     //console.log(timeSinceLastLogin);
//     //console.log(Math.floor((timeSinceLastLogin / (1000 * 60 * 60)) % 24))
//     store.state.user = "";
//     store.state.isUserLoggedIn = false;
//   }
// })

Vue.use(VueAnalytics, {
  id: "UA-163162436-2",
  router,
});
export default router;
