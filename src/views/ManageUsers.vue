<template>
  <div id="app">
    <v-card class="mx-auto mt-5" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="10" class="pt-3 text-md-center">Manage Users</v-col>
              <v-col cols="2" class="text-md-center pl-3">
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

    <v-card v-if="dataReady" class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-form ref="form" v-model="valid">
        <div v-if="isNewPwd" class="text-center">
          <v-sheet
            color="orange lighten-2"
          >Password of {{userPwdReset}} has been reset to {{newPwd}}</v-sheet>
        </div>
        <!-- <v-data-table
          :headers="header"
          :items="users"
          hide-default-footer
          :items-per-page="100"
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
          </template>
        </v-data-table>-->
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">User Name        </th>
                <th class="text-left">Active</th>
                <th class="text-left">Packer</th>
                <th class="text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>
                  <v-icon @click="toggleIsActive(user)" v-if="user.active" color="green">mdi-check</v-icon>
                  <v-icon @click="toggleIsActive(user)" v-if="!user.active" color="red">mdi-close</v-icon>
                </td>
                <td>
                  <v-icon @click="toggleIsPacker(user)" v-if="user.isPacker" color="green">mdi-check</v-icon>
                  <v-icon @click="toggleIsPacker(user)" v-if="!user.isPacker" color="red">mdi-close</v-icon>
                </td>
                <td class="ma-0 pa-0">
                  <v-btn class="ma-0 pa-0" @click="resetPwd(user)" text>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
        { text: "Password", value: "resetpwd" },
      ],
      users: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      isNewPwd: false,
      newPwd: "",
      dialog: false,
      userPwdReset: "",
      dataReady: false,
    };
  },
  async created() {
    await this.getData();
  },
  async mounted() {},
  methods: {
    ...mapActions(["updateUserAction"]),
    async getData() {
      await this.getUsers();
      this.localUsers.forEach((lu) => {
        this.users.push({
          name: `${lu.firstname} ${lu.lastname}`,
          isAdmin: parseInt(lu.isAdmin) === 1,
          isPacker: parseInt(lu.isPacker) === 1,
          active: parseInt(lu.active) === 1,
          id: lu.id,
          firstname: lu.firstname,
          lastname: lu.lastname,
        });
      });

      this.users.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
      });
      this.dataReady = true;
      return this.users;
    },
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        this.localUsers = response;
      });
    },
    async updateUser(user) {
      await dataService.updateUser(user);
      //this.updateUserAction(this.localUser);
      //this.snackMessage("User Data updated!");
    },
    snackMessage: function (message) {
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
        firstname: user.firstname,
      });
      if (user.isPacker) {
        this.snackMessage(`${user.name} has been assigned as packer`);
      } else {
        this.snackMessage(`${user.name} is not a packer anymore`);
      }
    },
    async toggleIsAdmin(user) {
      user.isAdmin = user.isAdmin ? false : true;
      await this.updateUser({
        id: user.id,
        isPacker: user.isPacker ? 1 : 0,
        isAdmin: user.isAdmin ? 1 : 0,
        active: user.active ? 1 : 0,
        firstname: user.firstname,
        lastname: user.lastname,
      });
      this.snackMessage(`Update Successful1!`);
      //await this.getUsers();
    },
    async toggleIsActive(user) {
      user.active = user.active ? false : true;

      if (user.active) {
        console.log("user being made active");
        if (
          await this.passwordReset(
            user,
            `Do you want to make ${user.name} active?`
          )
        ) {
          this.snackMessage(
            `${user.name} has been made active. Please note the password above.`
          );
          this.isNewPwd = true;
          this.userPwdReset = user.name;
        }
      } else {
        let flag = await this.passwordReset(
          user,
          `Are you sure you want to make ${user.name} inactive?`
        );
        if (flag) {
          this.isNewPwd = false;
          this.snackMessage(`${user.name} has been made inactive`);
        } else {
          user.active = user.active ? false : true;
        }
      }
    },
    async passwordReset(user, message) {
      var con = confirm(`${message}`);
      if (con == true) {
        this.newPwd = this.generatePassword;
        await this.updateUser({
          id: user.id,
          isPacker: user.isPacker ? 1 : 0,
          isAdmin: user.isAdmin ? 1 : 0,
          active: user.active ? 1 : 0,
          firstname: user.firstname,
          password: this.newPwd,
          lastname: user.lastname,
        });
        return true;
      } else {
        return false;
      }
    },
    async resetPwd(user) {
      if (
        await this.passwordReset(
          user,
          `Are you sure you want to reset the password for ${user.name}?`
        )
      ) {
        this.snackMessage(`Password has been reset Successfully! Please note the password above.`);
        this.isNewPwd = true;
        this.userPwdReset = user.name;
      }
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
</style>