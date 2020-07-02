<template>
  <div>
    <v-card class="overflow-hidden">
      <v-app-bar color="blue-grey accent-4" elevate-on-scroll dense dark>
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dense small text>
              <v-icon>mdi-hamburger</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in getMenuItems()" :key="index" click>
              <v-list-item-title>
                <v-btn :to="item.path">{{ item.title }}</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list>
          <v-list-tile v-for="(item, index) in items" :key="index" :to="item.path" router exact>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
          </v-list>
        </v-menu>-->
        <!-- <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text>
                <v-icon v-if="!isPounds" @click="toggleGmsLbs">mdi-weight-gram</v-icon>
                <v-icon v-if="isPounds" @click="toggleGmsLbs">mdi-weight-pound</v-icon>
              </v-btn>
            </template>
            <span>lbs - gms</span>
          </v-tooltip>
        </v-toolbar-title>-->

        <div class="text-center">
          <v-menu offset-y transition="scale-transition">
            <template v-slot:activator="{ on: menu }">
              <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on">Dropdown</v-btn> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on:tooltip  }">
                  <v-btn v-on="{...tooltip, ...menu}" dense small text>
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>Menu</span>
              </v-tooltip>
            </template>
            <v-list v-if="displayMenu">
              <v-list-item v-for="(item, index) in getMenuItems()" :key="index" :to="item.path">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- <v-divider v-if="displayAdminMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/manageitems">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </template>
            <span>Manage Items</span>
          </v-tooltip>
        </v-toolbar-title> -->

        

        <v-divider v-if="displayMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/orderEntry">
                <v-icon>mdi-cart-outline</v-icon>
              </v-btn>
            </template>
            <span>My Order</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-divider v-if="displayAdminMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/orderReport">
                <v-icon>mdi-account-multiple</v-icon>
              </v-btn>
            </template>
            <span>Order Summary</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-divider v-if="displayAdminMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/bulkOrder">
                <v-icon>mdi-receipt</v-icon>
              </v-btn>
            </template>
            <span>Invoice</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-divider v-if="displayMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/packagingByItem">
                <v-icon>mdi-scale-balance</v-icon>
              </v-btn>
            </template>
            <span>Pack Items</span>
          </v-tooltip>
        </v-toolbar-title>

        <v-divider v-if="displayMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/allUserOrders">
                <v-icon>mdi-email-outline</v-icon>
              </v-btn>
            </template>
            <span>Send Email</span>
          </v-tooltip>
        </v-toolbar-title>

        <!-- <v-divider v-if="displayAdminMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/orderRecon">
                <v-icon>mdi-ballot-recount</v-icon>
              </v-btn>
            </template>
            <span>Reconcile Order</span>
          </v-tooltip>
        </v-toolbar-title> -->

        <!-- <v-divider v-if="displayAdminMenu" class="mx-2" inset vertical></v-divider>
        <v-toolbar-title v-if="displayAdminMenu">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text>
                <v-icon v-if="isOrderLocked" @click="toggleOrderLock">mdi-lock</v-icon>
                <v-icon v-if="!isOrderLocked" @click="toggleOrderLock">mdi-lock-open</v-icon>
              </v-btn>
              <v-btn v-on="on" dense small text></v-btn>
            </template>
            <span>Lock/Unlock Order</span>
          </v-tooltip>
        </v-toolbar-title> -->

        <v-spacer></v-spacer>
        <!-- <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" to="/profile" dense small text>
                <v-icon dark>mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <span>{{getUserName}}</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>-->
        <div class="text-center" v-if="displayMenu">
          <v-menu offset-y>
            <template v-slot:activator="{ on: menu }">
              <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on">Dropdown</v-btn> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on:tooltip  }">
                  <v-btn v-on="{...tooltip, ...menu}" dense small text>
                    <v-icon dark>mdi-account-circle</v-icon>
                  </v-btn>
                </template>
                <span>{{getUserName}}</span>
              </v-tooltip>
            </template>
            <v-list>
              <!-- <template v-slot:activator="{ on: menuClick}"> -->
                <v-list-item
                  v-for="(item, index) in profileItems"
                  :key="index"                                    
                  :to="item.path"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              <!-- </template> -->
            </v-list>
          </v-menu>
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" v-if="!isUserSignedIn" to="/login" dense small text>
              <v-icon v-on:click="signInUser">mdi-login</v-icon>
            </v-btn>
          </template>
          <span>Login</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" v-if="isUserSignedIn" to="/login" dense small text>
              <v-icon v-on:click="resetState">mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
        <!-- <v-toolbar-title>
          <v-btn v-if="!isUserSignedIn" to="/login" dense small text>
            <v-icon v-on:click="signInUser">mdi-login</v-icon>
          </v-btn>
          <v-btn v-if="isUserSignedIn" to="/login" dense small text>
            <v-icon v-on:click="resetState">mdi-logout</v-icon>
          </v-btn>
        </v-toolbar-title>-->
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
    menuItems: [
      
      { title: "My Order", path: "/", admin: false },
      { title: "Order Summary", path: "/OrderReport", admin: true },
      { title: "Bulkorder Invoice", path: "/BulkOrder", admin: true },
      { title: "Pack Items", path: "/PackagingByItem", admin: false },
      { title: "Send Email", path: "/AllUserOrders", admin: false },
      { title: "Reconcile Order", path: "/OrderRecon", admin: true },
      

      { title: "Add User", path: "/Register", admin: true },
      { title: "Add Item", path: "/ManageItems", admin: true },
      { title: "Manage Users", path: "/ManageUsers", admin: true },
      { title: "FAQ", path: "/About", admin: false }
    ],
    profileItems: [
      { title: "Profile", path: "/profile", admin: false, onClick: "" },      
    ],
    valid: false,
    snackbar: false,
    message: null,
    multiLine: true,
    isValidUser: false,
    displayMenu: false,
    displayAdminMenu: false
  }),
  created() {
    this.items = [];
    this.setDisplayMenu();
  },
  mounted() {
    this.getOrderStatusAction();
    this.getOrdersAction();
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
      }
    },
    isOrderLocked: {
      get() {
        return this.$store.state.isOrderLocked;
      },
      set(value) {
        this.$store.commit("toggleOrderLocked", value);
      }
    }
  },
  methods: {
    ...mapActions([
      "resetStateAction",
      "updateOrderAction",
      "getOrderStatusAction",
      "getOrdersAction"
    ]),
    snackMessage: function(message) {
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
      console.log(this.isPounds);
    },
    getMenuItems() {
      if (this.isAdminUser) {
        return this.menuItems;
      } else {
        return this.menuItems.filter(i => i.admin === false);
      }
    },
    async toggleOrderLock() {
      this.isOrderLocked = this.isOrderLocked ? false : true;
      await this.updateOrderAction({
        id: this.getCurrentOrder.id,
        orderDt: this.getCurrentOrder.orderDt,
        cutOffDt: null,
        orderStatus: this.getCurrentOrder.orderStatus,
        isLocked: this.isOrderLocked
      });
      if (parseInt(this.isOrderLocked) === 1)
        this.snackMessage("Order is Locked!");
    },
    resetState: function() {
      this.resetStateAction();
      this.setDisplayMenu();
    },
    signInUser: function() {}
  }
};
</script>
<style lang="scss" scoped>
body {
  overflow: hidden;
  height: 100vh;
}
</style>