<template>
  <div id="app">
    <v-card class="mx-auto mt-5" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="10" class="pt-1 text-md-center">Packer Schedule</v-col>
              <v-col v-if="isAdminUser" cols="2" class="text-md-center pl-2">
                <v-dialog
                  v-model="dialog"
                  width="500"
                  :key="localPackerSchedule.id"
                  :id="localPackerSchedule.id"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="black"
                      dark
                      v-on="on"
                      @click="initializePackerSchedule()"
                    >mdi-plus</v-icon>
                  </template>
                  <v-card>
                    <v-form ref="form" v-model="valid">
                      <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                      >Add a Packer Schedule</v-card-title>
                      <v-card-text>
                        <v-autocomplete
                          v-model="updatedPackerSchedule.userId"
                          item-value="id"
                          item-text="firstname"
                          :items="localUsers"
                          label="User"
                          required
                        ></v-autocomplete>

                        <v-menu
                          v-model="addDateMenu"
                          :close-on-content-click="true"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on:addMenu, attrs: addAttrs }">
                            <v-text-field
                              v-model="updatedPackerSchedule.date"
                              label="Packer Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...addAttrs}"
                              v-on="{...addMenu}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="updatedPackerSchedule.date"
                            v-model="updatedPackerSchedule.date"
                            @input="addMenu = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu>

                        <v-btn
                          :disabled="!valid"
                          color="success"
                          class="mr-4"
                          @click="addNewPackerSchedule()"
                          @click.stop="dialog = false"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializePackerSchedule()"
                          @click.stop="dialog = false"
                        >Cancel</v-btn>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" color="primary" elevation>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header color="grey lighten-1">Past Schedule</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">User</th>
                    <th class="text-left">Packing Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in getPastPackerSchedule()" :key="item.id">
                    <td>{{ getUserName(item.userId) }}</td>
                    <td>{{item.date}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-form ref="form" v-model="valid">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">User</th>
                <th class="text-left">Packing Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in packerSchedules" :key="item.id">
                <td>{{ getUserName(item.userId) }}</td>
                <td>{{item.date}}</td>
                <td v-if="isAdminUser">
                  <v-dialog v-model="dialogEdit[item.id]" width="500" :key="item.id" :id="item.id">
                    <template v-slot:activator="{ on:editTemplate }">
                      <v-icon
                        color="primary"
                        :id="item.id"
                        dark
                        v-on="{...editTemplate}"
                        @click="editPackerSchedule(item)"
                      >mdi-pencil</v-icon>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>Item Details</v-card-title>

                      <v-card-text>
                        <v-autocomplete
                          v-model="tempPackerSchedule.userId"
                          item-value="id"
                          item-text="firstname"
                          :items="localUsers"
                          label="User"
                          required
                        ></v-autocomplete>

                        <v-menu
                          v-model="editDateMenu[item.id]"
                          :close-on-content-click="true"
                          :nudge-right="40"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on:editMenu, attrs:editAttrs }">
                            <v-text-field
                              v-model="tempPackerSchedule.date"
                              label="Packer Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...editAttrs}"
                              v-on="{...editMenu}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="tempPackerSchedule.date"
                            v-model="tempPackerSchedule.date"
                            @input="editMenuFlag = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu>

                        <v-btn
                          color="success"
                          class="mr-4"
                          @click="updatePackerSchedule()"
                          @click.stop="$set(dialogEdit, item.id,  false)"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializePackerSchedule()"
                          @click.stop="$set(dialogEdit, item.id,  false)"
                        >Cancel</v-btn>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </td>
                <td>
                  <v-icon
                    v-if="isAdminUser"
                    color="red"
                    @click="deletePackerSchedule(item)"
                  >mdi-delete</v-icon>
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
import { mapActions, mapState, mapGetters } from "vuex";
import { dataService } from "../shared";
export default {
  name: "PackerSchedule",

  data() {
    return {
      pastSchedule: [],
      localPackerSchedule: {
        id: 0,
        userId: null,
        date: null,
        isActive: true,
      },
      updatedPackerSchedule: {
        id: 0,
        userId: null,
        date: null,
        isActive: true,
      },
      tempPackerSchedule: {
        id: 0,
        userId: null,
        date: null,
        isActive: true,
      },
      valid: false,
      name: "",
      rules: {
        required: (v) => !!v || "Name is required",
        checkNumber: (v) => !isNaN(v) || "Please enter a number",
      },
      dialog: false,
      dialogEdit: [],
      message: null,
      multiLine: true,
      snackbar: false,
      selected: [],
      localUsers: [],
      selectedUser: null,
      addDateMenu: null,
      editDateMenu: [],
      date: null,
      addMenu: false,
      editMenuFlag: false,
      nowDate: new Date().toISOString().slice(0, 10),
    };
  },
  async created() {
    await this.getUsers();
  },
  async mounted() {
    await this.getPackerScheduleAction("c");
    await this.sortedData();
  },

  methods: {
    ...mapActions([
      "getPackerScheduleAction",
      "addPackerScheduleAction",
      "deletePackerScheduleAction",
      "updatePackerScheduleAction",
    ]),

    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        this.localUsers = response;
      });
    },
    deletePackerSchedule: function (schedule) {
      if (
        confirm(
          `Do you really want to delete schedule for ${this.getUserName(
            schedule.userId
          )}?`
        )
      ) {
        this.deletePackerScheduleAction(schedule);
        this.snackMessage(
          `Schedule for "${this.getUserName(
            schedule.userId
          )}" deleted successfully!`
        );
      }
    },
    getPastPackerSchedule() {
      if (this.pastSchedule.length === 0 || !this.pastSchedule)
        dataService.getPackerSchedule("p").then((response) => {
          this.pastSchedule = response;
        });
      return this.pastSchedule;
    },
    editPackerSchedule: function (item) {
      this.valid = true;
      //console.log(this.$refs.form.validate())
      this.tempPackerSchedule = {
        id: item.id,
        userId: item.userId,
        date: item.date,
        active: true,
      };
    },
    initializePackerSchedule: function () {
      this.$refs.form.validate();
      this.updatedPackerSchedule = {
        id: 0,
        userId: null,
        date: null,
        isActive: true,
      };
    },
    addNewPackerSchedule: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.addPackerScheduleAction(this.updatedPackerSchedule);
        this.snackMessage(
          `Schedule added for packer "${this.getUserName(
            this.updatedPackerSchedule.userId
          )}" added successfully!`
        );
      }
    },
    updatePackerSchedule: async function () {
      //if (this.$refs.form.validate()) {

      await this.updatePackerScheduleAction({
        id: this.tempPackerSchedule.id,
        userId: this.tempPackerSchedule.userId,
        date: this.tempPackerSchedule.date,
        active: true,
      });
      let userName = this.getUserName(this.tempPackerSchedule.userId);
      this.snackMessage(
        `Schedule for packer ${userName} updated successfully!`
      );

      this.sortedData();
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    sortedData: function () {
      return this.packerSchedules.sort(function (a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
    },
    getUserName(id) {
      let user = this.localUsers.find((u) => u.id === id);
      return user ? `${user.firstname} ${user.lastname}` : "User Not Found";
    },
  },
  computed: {
    ...mapState(["packerSchedules"]),
    ...mapGetters(["isAdminUser"]),
    sortedItems: function () {
      return 0;
    },
  },
};
</script>