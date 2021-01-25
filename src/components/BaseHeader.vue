<template>
  <div>
    <v-card class="overflow-hidden mb-10">
      <v-app-bar color="blue-grey accent-4" elevate-on-scroll dense dark fixed>
        <div class="text-center">
          <v-menu offset-y transition="expand-transition">
            <template v-slot:activator="{ on: menu }" >
              <v-btn v-on="{...menu}" dense small text fab> 
                <v-icon fab class="hidden-sm-and-down">mdi-dots-vertical</v-icon>
                <v-icon fab small class="hidden-md-and-up">mdi-dots-vertical</v-icon>
                vbc
              </v-btn>
            </template>

            <v-list v-if="displayMenu">
              <v-list-item v-for="(item, index) in getMenuItems()" :key="index" :to="item.path">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <!-- <v-list-item v-for="(item, index) in item.childRoutes" :key="index" :to="item.path">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item> -->
              </v-list-item>

              <v-list-item class="hidden-md-and-up" to="/profile">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item class="hidden-md-and-up" to="/login" @click="resetState">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
             
            </v-list>
          </v-menu>
        </div>

        <v-divider v-if="displayMenu" class="mx-2 hidden-sm-and-down" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu" class="hidden-sm-and-down">
          <v-tooltip bottom :open-on-click="false" class="hidden-sm-and-down">
            <template dense v-slot:activator="{ on }">
              <v-btn v-on="on" class="ma-2" text icon small to="/orderEntry">
                <v-icon class="hidden-sm-and-down">mdi-cart-outline</v-icon>
              </v-btn>
            </template>
            <span class="hidden-sm-and-down">My Order</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-btn class="ma-2 hidden-md-and-up" text icon small to="/orderEntry">
          <v-icon dense small class="ma-0 pr-0 hidden-md-and-up">mdi-cart-outline</v-icon>
        </v-btn>

        <v-divider v-if="displayAdminMenu" class="mx-2 hidden-sm-and-down" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu" class="hidden-sm-and-down">
          <v-tooltip bottom class="hidden-sm-and-down">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ma-2" text icon small to="/orderReport">
                <v-icon class="hidden-sm-and-down">mdi-account-multiple</v-icon>
                <!-- <v-icon small class="hidden-md-and-up">mdi-account-multiple</v-icon> -->
              </v-btn>
            </template>
            <span>Order Summary</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-btn
          v-if="displayAdminMenu"
          class="ma-2 hidden-md-and-up"
          text
          icon
          small
          to="/orderReport"
        >
          <v-icon small class="hidden-md-and-up">mdi-account-multiple</v-icon>
        </v-btn>

        <v-divider v-if="displayAdminMenu" class="mx-2 hidden-sm-and-down" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu" class="hidden-sm-and-down">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ma-2" text icon small to="/bulkOrder">
                <v-icon class="hidden-sm-and-down">mdi-receipt</v-icon>
                <!-- <v-icon small class="hidden-md-and-up">mdi-receipt</v-icon> -->
              </v-btn>
            </template>
            <span>Invoice</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-btn
          v-if="displayAdminMenu"
          class="ma-2 hidden-md-and-up"
          text
          icon
          small
          to="/bulkOrder"
        >
          <v-icon small class="hidden-md-and-up">mdi-receipt</v-icon>
        </v-btn>

        <v-divider v-if="displayMenu" class="mx-2 hidden-sm-and-down" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu" class="hidden-sm-and-down">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ma-2" text icon small to="/packagingByItem">
                <v-icon class="hidden-sm-and-down">mdi-scale-balance</v-icon>
                <!-- <v-icon small class="hidden-md-and-up">mdi-scale-balance</v-icon> -->
              </v-btn>
            </template>
            <span>Pack Items</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-btn class="ma-2 hidden-md-and-up" text icon small to="/packagingByItem">
          <v-icon small class="hidden-md-and-up">mdi-scale-balance</v-icon>
        </v-btn>

        <v-divider v-if="displayMenu" class="mx-2 hidden-sm-and-down" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu" class="hidden-sm-and-down">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ma-2" text icon small to="/allUserOrders">
                <v-icon class="hidden-sm-and-down">mdi-email-outline</v-icon>
                <!-- <v-icon small class="hidden-md-and-up">mdi-email-outline</v-icon> -->
              </v-btn>
            </template>
            <span>Send Email</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-btn class="ma-2 hidden-md-and-up" text icon small to="/allUserOrders">
          <v-icon small class="hidden-md-and-up">mdi-email-outline</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <div class="text-center hidden-sm-and-down" v-if="displayMenu">
          <v-menu offset-y open-on-hover transition="expand-transition">
            <template v-slot:activator="{ on: menu }">
              <v-btn v-on="{...menu}" dense small text>
                <v-icon dark class="hidden-sm-and-down">mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in profileItems" :key="index" :to="item.path">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
              <v-list-item to="/login" @click="resetState">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-menu left bottom></v-menu>
      </v-app-bar>
    </v-card>
    <v-snackbar id="header-snackbar" v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    admins: [
      ["Management", "mdi-mail"],
      ["Settings", "settings"],
    ],
    menuItems: [
      // { title: "My Order", path: "/", admin: false },
      // { title: "Order Summary", path: "/OrderReport", admin: true },
      // { title: "Bulkorder Invoice", path: "/BulkOrder", admin: true },
      { title: "Pack Items", path: "/PackagingByItem", admin: false },
      { title: "Send Email", path: "/AllUserOrders", admin: false },
      { title: "Reconcile Order", path: "/OrderRecon", admin: true },

      // { title: "Add User", path: "/Register", admin: true },
      // {
      //   title: "Manage",
      //   path: "",
      //   admin: true,
      //   childRoutes: [
      //     {
      //       title: "User",
      //       path: "/ManageUsers",
      //     },
      //     { title: "Order", path: "/orders" },
      //     { title: "Schedule", path: "/PackerSchedule" },
      //     { title: "Items", path: "/ManageItems" },
      //   ],
      // },
      { title: "Manage Items", path: "/ManageItems", admin: true },
      { title: "Manage Users", path: "/ManageUsers", admin: true },
      { title: "Manage Order", path: "/orders", admin: true },
      { title: "Packer Schedule", path: "/PackerSchedule", admin: false },

      // { title: "FAQ", path: "/About", admin: false }

      //{ title: "Profile", path: "/profile", admin: false },
    ],
    ManageMenu: {
        title: "Manage",
        path: "",
        admin: true,
        childRoutes: [
          {
            title: "User",
            path: "/ManageUsers",
          },
          { title: "Order", path: "/orders" },
          { title: "Schedule", path: "/PackerSchedule" },
          { title: "Items", path: "/ManageItems" },
        ],
      },
    profileItems: [
      { title: "Profile", path: "/profile", admin: false, onClick: "" },
    ],
    valid: false,
    snackbar: false,
    message: null,
    multiLine: true,
    isValidUser: false,
    displayMenu: false,
    displayAdminMenu: false,
    viewPortFlag: true,
  }),
  created() {
    this.items = [];
    this.setDisplayMenu();
  },
  mounted() {
    //this.getOrderStatusAction();
    //this.getOrdersAction();
  },
  updated() {
    this.isValidUser = this.isUserSignedIn;
  },
  computed: {
    ...mapState({ currentUser: "user", isUserSignedIn: "isUserLoggedIn" }),
    ...mapGetters(["getUserName", "getCurrentOrder", "isAdminUser"]),
    isPounds: {
      get() {
        return this.$store.state.isPounds;
      },
      set(value) {
        this.$store.commit("togglePounds", value);
      },
    },
    isOrderLocked: {
      get() {
        return this.$store.state.isOrderLocked;
      },
      set(value) {
        this.$store.commit("toggleOrderLocked", value);
      },
    },
  },
  methods: {
    ...mapActions([
      "resetStateAction",
      "updateOrderAction",
      "getOrderStatusAction",
      "getOrdersAction",
    ]),
    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    setDisplayMenu() {
      if (this.isUserSignedIn) {
        this.displayMenu = true;
        if (this.isAdminUser) this.displayAdminMenu = true;
      } else {
        this.displayMenu = false;
      }
    },
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
    },
    getMenuItems() {
      if (this.isAdminUser) {
        return this.menuItems;
      } else {
        return this.menuItems.filter((i) => i.admin === false);
      }
    },
    async toggleOrderLock() {
      this.isOrderLocked = this.isOrderLocked ? false : true;
      await this.updateOrderAction({
        id: this.getCurrentOrder.id,
        orderDt: this.getCurrentOrder.orderDt,
        cutOffDt: null,
        orderStatus: this.getCurrentOrder.orderStatus,
        isLocked: this.isOrderLocked,
      });
      if (parseInt(this.isOrderLocked) === 1)
        this.snackMessage("Order is Locked!");
    },
    resetState: function () {
      this.resetStateAction();
      this.setDisplayMenu();
      this.$router.push({ path: "/login" });
    },
    signInUser: function () {},
  },
};
</script>
<style lang="scss" scoped>
body {
  overflow: hidden;
  height: 100vh;
}
</style>