<template>
  <div>
    <v-form ref="form" v-model="valid">
      <v-card class="mx-auto ma-12" max-width="1100" color="orange" rounded>
        <v-container fluid>
          <v-layout column>
            <v-card>
              <v-card-text>
                <v-text-field v-model="localUser.firstname" label="FirstName"></v-text-field>
                <v-text-field v-model="localUser.lastname" label="Last Name"></v-text-field>
                <v-text-field v-model="localUser.email" label="Email Address" disabled></v-text-field>
                <v-text-field v-model="localUser.phone" label="Phone"></v-text-field>
                <v-text-field v-model="localUser.password" label="Password" :rules="passwordRules"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click.native="updateUser">
                  <v-icon left dark>mdi-check</v-icon>Save Changes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-layout>
        </v-container>
      </v-card>
    </v-form>
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  pageTitle: "My Profile",
  data() {
    return {
      password: "",
      localUser: {
        id: 0,
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        isAdmin: 0,
        isPacker: 0,
        active: 0
      },
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      passwordRules: [] //[v => !!v || "Password is required"]
    };
  },
  mounted() {
    this.localUser = {
      id: this.user.id,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      phone: this.user.phone,
      email: this.user.email,
      isAdmin : this.user.isAdmin,
      isPacker: this.user.isPacker,
      active: this.user.active,
      password: ""
    };
  },
  methods: {
    ...mapActions(["updateUserAction"]),
    updateUser() {
      if (this.$refs.form.validate()) {
        this.updateUserAction(this.localUser);
        this.snackMessage("User Data updated!");
      }
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    }
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>
