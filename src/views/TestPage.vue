<template>
  <div>
    <v-card class="mx-auto mt-3" max-width="600">
      <!-- <v-list-item v-for="user in localUsers" :key="user.id" dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row class="ma-0 pa-0">
              <v-col>{{user.firstname}} {{user.lastname}}</v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>-->
      <v-row>
        <v-col cols="5">
          <v-autocomplete
            v-model="selectedUser"
            item-value="id"
            item-text="firstname"
            :items="localUsers"
            dense
            filled
            label="User"
          ></v-autocomplete>
        </v-col>
        <v-col cols="5">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Packer Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2">
            <v-btn small class="mt-3" color="primary" dark>Save</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { dataService } from "../shared";
export default {
  data() {
    return {
      localUsers: [],
      selectedUser: null,
      dateMenu: null,
      date: null,
    };
  },
  async created() {
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        this.localUsers = response;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>