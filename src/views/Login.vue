<template>
  <v-card width="400" class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Login</h2>
    </v-card-title>
    <v-card-text class="pt-5">
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="E-mail"
          prepend-icon="mdi-account-circle"
          v-model="email"
          required
          :rules="emailRules"
          @keyup.enter="signInUser"
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          v-model="password"
          required
          :rules="passwordRules"
          @keyup.enter="signInUser"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <!-- <v-btn color="success" to="/register">Register</v-btn> -->
      <v-spacer></v-spacer>
      <v-btn color="info" @click="signInUser" ref="login">Login</v-btn>
    </v-card-actions>
    <!-- <v-sheet v-if="this.msg" color="orange lighten-2">{{ this.msg }}</v-sheet> -->
    <v-snackbar v-model="isMsg" :bottom="true" :right="true" :timeout="4000">
      {{ this.msg }}
      <!-- <v-btn color="pink" text @click="snackbar = false">Close</v-btn> -->
    </v-snackbar>
  </v-card>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      errors: [],
      msg: "",
      isMsg: false,
      valid: true,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [v => !!v || "Password is required"]
    };
  },
  methods: {
    ...mapActions(["signInAction"]),

    async signInUser() {      
      this.$refs.form.validate();
      if (this.valid) {
        var userInfo = {
          email: this.email,
          password: this.password
        };
        await this.signInAction(userInfo);        
        if (this.currentUser !== null && this.currentUser.id > 0)
          this.$router.push({ path: "/" });
        else {
          this.msg = "Invalid Credentials";
          this.isMsg = !(this.msg === "");
        }
      }
    },   
    async register() {
      console.log("test");
      await this.$router.push({ path: "/" }).catch(err => {
        console.log(err);
        throw new Error(`Problem handling something: ${err}.`);
      });
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  computed: {
    ...mapState({ currentUser: "user" })
  }
};
</script>
