<template>
  <div>
    <v-card class="overflow-hidden">
      <v-app-bar color="blue-grey accent-4" elevate-on-scroll dense dark>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dense small text>
              <v-icon>mdi-hamburger</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" click>
              <v-list-item-title>
                <v-btn :to="item.path">{{ item.title }}</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <!-- <v-list>
          <v-list-tile v-for="(item, index) in items" :key="index" :to="item.path" router exact>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
          </v-list>-->
        </v-menu>
        <v-divider class="mx-2" inset vertical></v-divider>
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
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/manageitems">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </template>
            <span>Manage Items</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/orderEntry">
                <v-icon>mdi-cart</v-icon>
              </v-btn>
            </template>
            <span>My Order</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/bulkOrder">
                <v-icon>mdi-view-agenda-outline</v-icon>
              </v-btn>
            </template>
            <span>Bulk Order</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/packagingByItem">
                <v-icon>mdi-scale-balance</v-icon>
              </v-btn>
            </template>
            <span>Package Order By Item</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/allUserOrders">
                <v-icon>mdi-scale</v-icon>
              </v-btn>
            </template>
            <span>Package Order By User</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>

        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dense small text to="/orderRecon">
                <v-icon>mdi-ballot-recount</v-icon>
              </v-btn>
            </template>
            <span>Order Reconciliation</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-toolbar-title>
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
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" to="/profile" dense small text>
              <v-icon dark>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <span>{{getUserName}}</span>
        </v-tooltip>
        <v-divider class="mx-2" inset vertical></v-divider>
        <!-- <v-tooltip bottom>
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
              <v-icon v-on:click="clearUser">mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>-->
        <v-btn v-if="!isUserSignedIn" to="/login" dense small text>
          <v-icon v-on:click="signInUser">mdi-login</v-icon>
        </v-btn>
        <v-btn v-if="isUserSignedIn" to="/login" dense small text>
          <v-icon v-on:click="clearUser">mdi-logout</v-icon>
        </v-btn>
        <v-menu left bottom></v-menu>
      </v-app-bar>
    </v-card>
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    items: [
      { title: "My Order", path: "/" },
      { title: "Bulk Order", path: "/BulkOrder" },
      { title: "Packaging By User", path: "/AllUserOrders" },
      { title: "Packaging By Item", path: "/PackagingByItem" },
      { title: "Manage Items", path: "/ManageItems" },
      { title: "Reconcile Orders", path: "/OrderRecon" },
      { title: "FAQ", path: "/About" }
    ],
    valid: false,
    snackbar: false,
    message: null,
    multiLine: true,
    isValidUser: false
  }),

  mounted() {
    console.log(this.isUserSignedIn);
  },
  updated() {
    console.log(this.isUserSignedIn);
    this.isValidUser = this.isUserSignedIn;
    console.log(this.isValidUser);
  },
  computed: {
    ...mapState({ currentUser: "user" }),
    ...mapGetters(["getUserName", "getCurrentOrder", "isUserSignedIn"]),
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
    ...mapActions(["clearUserAction", "updateOrderAction"]),
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
      console.log(this.isPounds);
    },
    async toggleOrderLock() {
      this.isOrderLocked = this.isOrderLocked ? 0 : 1;
      console.log(this.getCurrentOrder);
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
    clearUser: function() {
      this.clearUserAction({
        firstname: "",
        lastname: "",
        phone: "",
        email: ""
      });
    },
    signInUser: function() {}
  }
};
</script>
