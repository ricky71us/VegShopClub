<template>
  <div>
    <v-app-bar color="blue-grey accent-4" dense dark>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">
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
        <v-btn to="/">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" dark>mdi-account-circle</v-icon>
        </template>
        <span>{{getUserName}}</span>
      </v-tooltip>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-btn v-if="!this.isUserSignedIn()" v-on:click="signInUser" to="/login">Login</v-btn>
      <v-btn v-if="this.isUserSignedIn()" v-on:click="clearUser" to="/login">Logout</v-btn>
      <v-menu left bottom></v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    items: [
      { title: "Manage Items", path: "/ManageItems" },
      { title: "Bulk Order", path: "/BulkOrder" },
      { title: "All Orders", path: "/AllUserOrders" },
      { title: "About", path: "/About" }
    ]
  }),
  computed: {
    ...mapState({ currentUser: "user" }),
    ...mapGetters(["getUserName"])
  },
  methods: {
    ...mapActions(["clearUserAction"]),
    isUserSignedIn: function() {
      if (this.getUserName !== "Guest") {
        return true;
      }
      return false;
    },
    clearUser: function() {
      console.log(this.isUserSignedIn());
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
