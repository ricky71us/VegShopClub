<template>
  <div>
    <v-card class="mx-auto mt-12" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="10" class="mt-2 text-md-center">Manage Users</v-col>
              <v-col cols="2" class="text-md-center ma-0 pa-0">
                <!-- <v-toolbar-title>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" dense small text>
                        <v-icon v-if="isOrderLocked" @click="toggleOrderLock">mdi-lock</v-icon>
                        <v-icon v-if="!isOrderLocked" @click="toggleOrderLock">mdi-lock-open</v-icon>
                      </v-btn>
                    </template>
                    <span>Order Locked</span>
                  </v-tooltip>
                </v-toolbar-title>-->
                <v-toolbar-title>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" text to="/register">
                        <v-icon left>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add New User</span>
                  </v-tooltip>
                </v-toolbar-title>

                <!-- <v-col cols="1" class="mb-2 pl-8">
                  <v-icon >mdi-lock</v-icon>
                  <v-icon
                    @click="toggleOrderLock"
                    v-if="!isOrderLocked"
                    color="green"
                  >mdi-toggle-switch</v-icon>
                  <v-icon
                    @click="toggleOrderLock"
                    v-if="isOrderLocked"
                    color="red"
                  >mdi-toggle-switch-off</v-icon>
                   <v-icon >mdi-lock-open</v-icon>
                </v-col>-->
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-form ref="form" v-model="valid">
        <div v-if="isNewPwd" class="text-center">
          <v-sheet
            color="orange lighten-2"
          >Password of {{userPwdReset}} has been reset to {{newPwd}}</v-sheet>
        </div>
        <v-data-table
          :headers="header"
          :items="users"
          hide-default-footer
          :items-per-page="5"
          class="elevation-1 mt-8"
        >
          <template v-slot:item.isPacker="{ item }">
            <v-icon @click="toggleIsPacker(item)" v-if="item.isPacker" color="green">mdi-check</v-icon>
            <v-icon @click="toggleIsPacker(item)" v-if="!item.isPacker" color="red">mdi-close</v-icon>
          </template>
          <template v-slot:item.isAdmin="{ item }">
            <v-icon @click="toggleIsAdmin(item)" v-if="item.isAdmin" color="green">mdi-check</v-icon>
            <v-icon @click="toggleIsAdmin(item)" v-if="!item.isAdmin" color="red">mdi-close</v-icon>
          </template>
          <template v-slot:item.active="{ item }">
            <v-icon @click="toggleIsActive(item)" v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon @click="toggleIsActive(item)" v-if="!item.active" color="red">mdi-close</v-icon>
          </template>
          <template v-slot:item.resetpwd="{item }">
            <v-btn @click="resetPwd(item)">reset</v-btn>
            <!-- <v-chip  class="ma-2 text-md-center">{{newPwd}}</v-chip> -->
          </template>
        </v-data-table>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { dataService } from "../shared";
export default {
  name: "ManangeUser",
  data() {
    return {
      localUsers: [],
      header: [
        { text: "Name", value: "name", align: "start" },
        // { text: "Admin", value: "isAdmin" },
        { text: "Active", value: "active" },
        { text: "Packer", value: "isPacker" },
        { text: "Password", value: "resetpwd" }
      ],
      users: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      isNewPwd: false,
      newPwd: "",
      dialog: false,
      userPwdReset: ""
    };
  },
  created() {
    //this.getUsers();
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    ...mapActions(["updateUserAction"]),
    async getData() {
      await this.getUsers();
      this.localUsers.forEach(lu => {
        this.users.push({
          name: `${lu.firstname} ${lu.lastname}`,
          isAdmin: parseInt(lu.isAdmin) === 1,
          isPacker: parseInt(lu.isPacker) === 1,
          active: parseInt(lu.active) === 1,
          id: lu.id,
          firstname: lu.firstname,
          lastname: lu.lastname
        });
      });

      this.users.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    },
    async getUsers() {
      await dataService.getAllUsers().then(response => {
        this.localUsers = response;
      });
    },
    async updateUser(user) {
      await dataService.updateUser(user);
      //this.updateUserAction(this.localUser);
      this.snackMessage("User Data updated!");
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    async toggleIsPacker(user) {
      user.isPacker = user.isPacker ? false : true;
      await this.updateUser({
        id: user.id,
        isPacker: user.isPacker ? 1 : 0,
        isAdmin: user.isAdmin ? 1 : 0,
        active: user.active ? 1 : 0,
        firstname: user.firstname
      });

      this.snackMessage(`Update Successful!`);
    },
    async toggleIsAdmin(user) {
      user.isAdmin = user.isAdmin ? false : true;
      await this.updateUser({
        id: user.id,
        isPacker: user.isPacker ? 1 : 0,
        isAdmin: user.isAdmin ? 1 : 0,
        active: user.active ? 1 : 0,
        firstname: user.firstname,
        lastname: user.lastname
      });
      this.snackMessage(`Update Successful!`);
      //await this.getUsers();
    },
    async toggleIsActive(user) {
      user.active = user.active ? false : true;
      await this.updateUser({
        id: user.id,
        isPacker: user.isPacker ? 1 : 0,
        isAdmin: user.isAdmin ? 1 : 0,
        active: user.active ? 1 : 0,
        firstname: user.firstname,
        lastname: user.lastname
      });
      this.snackMessage(`Update Successful!`);
      //await this.getUsers();
    },
    async resetPwd(user) {
      console.log(user);
      this.newPwd = this.generatePassword;
      await this.updateUser({
        id: user.id,
        isPacker: user.isPacker ? 1 : 0,
        isAdmin: user.isAdmin ? 1 : 0,
        active: user.active ? 1 : 0,
        firstname: user.firstname,
        password: this.newPwd,
        lastname: user.lastname
      });
      this.snackMessage(`Update Successful!`);
      this.isNewPwd = true;
      this.userPwdReset = user.name;
    }
  },
  computed: {
    ...mapState(["user"]),
    generatePassword() {
      var length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>