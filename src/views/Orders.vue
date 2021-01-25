<template>
  <div id="app">
    <v-card class="mx-auto mt-5" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="10" class="pt-1 text-md-center">Manage Orders</v-col>
              <v-col v-if="isAdminUser" cols="2" class="text-md-center pl-2">
                <v-dialog v-model="dialog" width="500" :key="localOrder.id" :id="localOrder.id">
                  <template v-slot:activator="{ on }">
                    <v-icon color="black" dark v-on="on" @click="initializeOrder()">mdi-plus</v-icon>
                  </template>
                  <v-card>
                    <v-form ref="form" v-model="valid">
                      <v-card-title class="headline grey lighten-2" primary-title>New Order</v-card-title>
                      <v-card-text>
                        <v-autocomplete
                          v-model="updatedOrder.orderStatus"
                          item-value="id"
                          item-text="status"
                          :items="orderstatus"
                          label="Order Status"
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
                              v-model="updatedOrder.orderDt"
                              label="Order Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...addAttrs}"
                              v-on="{...addMenu}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="updatedOrder.orderDt"
                            v-model="updatedOrder.orderDt"
                            @input="addMenu = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu>

                        <!-- <v-menu
                          v-model="addCutOffDtMenu"
                          :close-on-content-click="true"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on:addMenuCutOff, attrs: addAttrs }">
                            <v-text-field
                              v-model="updatedOrder.cutOffDt"
                              label="Order Cut Off Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...addAttrs}"
                              v-on="{...addMenuCutOff}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="updatedOrder.cutOffDt"
                            v-model="updatedOrder.cutOffDt"
                            @input="addMenuCutOff = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu> -->

                        <v-btn
                          :disabled="!valid"
                          color="success"
                          class="mr-4"
                          @click="addNewOrder()"
                          @click.stop="dialog = false"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializeOrder()"
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

    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped v-if="this.getCurrentOrder">
      <v-subheader light>Current Order</v-subheader>
      <v-form ref="form" v-model="valid">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Order Id</th>
                <th class="text-left">Order Date</th>
                <!-- <th class="text-left">Cut Off Date</th> -->
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activeOrder in activeOrders" :key="activeOrder.id">
                <td>{{activeOrder.id }}</td>
                <td>{{activeOrder.orderDt}}</td>
                <!-- <td>{{activeOrder.cutOffDt}}</td> -->
                <td>
                  <!-- <v-icon
                    :color="getStatusName(activeOrder.orderStatus).color"
                  >{{getStatusName(activeOrder.orderStatus).icon}}</v-icon> -->
                  {{getOrderStatus(activeOrder.orderStatus).status}}
                </td>
                <td v-if="isAdminUser">
                  <v-dialog
                    v-model="dialogEdit[activeOrder.id]"
                    width="500"
                    :key="activeOrder.id"
                    :id="activeOrder.id"
                  >
                    <template v-slot:activator="{ on:editTemplate }">
                      <v-icon
                        color="primary"
                        :id="activeOrder.id"
                        dark
                        v-on="{...editTemplate}"
                        @click="editOrder(activeOrder)"
                      >mdi-pencil</v-icon>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>Order Details</v-card-title>

                      <v-card-text>
                        <v-autocomplete
                          v-model="tempOrder.orderStatus"
                          item-value="id"
                          item-text="status"
                          :items="orderstatus"
                          label="Order Status"
                          required
                        ></v-autocomplete>

                        <v-menu
                          v-model="editDateMenu[activeOrder.id]"
                          :close-on-content-click="true"
                          :nudge-right="40"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on:editMenu, attrs:editAttrs }">
                            <v-text-field
                              v-model="tempOrder.orderDt"
                              label="Order Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...editAttrs}"
                              v-on="{...editMenu}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="tempOrder.orderDt"
                            v-model="tempOrder.orderDt"
                            @input="editMenuFlag = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu>

                        <!-- <v-menu
                          v-model="editDateMenu[activeOrder.id]"
                          :close-on-content-click="true"
                          :nudge-right="40"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on:editMenu, attrs:editAttrs }">
                            <v-text-field
                              v-model="tempOrder.cutOffDt"
                              label="Order Cut Off Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="{...editAttrs}"
                              v-on="{...editMenu}"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :return-value.sync="tempOrder.cutOffDt"
                            v-model="tempOrder.cutOffDt"
                            @input="editMenuFlag = false"
                            :min="nowDate"
                          ></v-date-picker>
                        </v-menu> -->

                        <v-btn
                          color="success"
                          class="mr-4"
                          @click="updateOrder()"
                          @click.stop="$set(dialogEdit, activeOrder.id,  false)"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializeOrder()"
                          @click.stop="$set(dialogEdit, activeOrder.id,  false)"
                        >Cancel</v-btn>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-form>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" color="primary" elevation>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header color="grey lighten-1">Past Orders</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Id</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">Order Date</th>
                    <!-- <th class="text-left">Cut off Date</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in getPastOrder()" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>
                      <!-- <v-icon
                        :color="getStatusName(item.orderStatus).color"
                      >{{ getStatusName(item.orderStatus).icon }}</v-icon> -->
                       {{getOrderStatus(item.orderStatus).status}}
                    </td>
                    <td>{{item.orderDt}}</td>
                    <!-- <td>{{item.cutOffDt}}</td> -->
                    
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
  name: "ManageOrder",

  data() {
    return {
      order: "",
      activeOrders: [],
      pastOrder: [],
      localOrder: {
        id: 0,
        orderDt: null,
        cutOffDt: null,
        orderStatus: 3,
        isLocked: 0,
      },
      updatedOrder: {
        id: 0,
        orderDt: null,
        cutOffDt: null,
        orderStatus: 3,
        isLocked: 0,
      },
      tempOrder: {
        id: 0,
        orderDt: null,
        cutOffDt: null,
        orderStatus: 3,
        isLocked: 0,
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
      addCutOffDtMenu: null,
      editDateMenu: [],
      date: null,
      addMenu: false,
      editMenuFlag: false,
      nowDate: new Date().toISOString().slice(0, 10),
    };
  },
  async created() {},
  async mounted() {
    this.getOrderStatusAction();
    this.getOrdersAction();
    this.activeOrders.push(this.getCurrentOrder);    
  },

  methods: {
    ...mapActions([
      "addOrderAction",
      "updateOrderAction",
      "deleteOrderAction",
      "getOrdersAction",
      "getOrderStatusAction",
    ]),
    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    deleteOrder: function (order) {
      if (confirm(`Do you really want to delete Order: ${order.id}?`)) {
        this.deleteOrderAction(order);
        this.snackMessage(`Order "${order.id}" deleted successfully!`);
      }
    },
    editOrder: function (order) {
      this.valid = true;
      this.tempOrder = {
        id: order.id,
        orderDt: order.orderDt,
        cutOffDt: order.cutOffDt,
        orderStatus: order.orderStatus,
        isLocked: order.isLocked,
      };
    },
    initializeOrder: function () {
      this.$refs.form.validate();
      this.updatedOrder = {
        id: 0,
        orderDt: null,
        cutOffDt: null,
        orderStatus: 3,
        isLocked: 0
      };
    },
    getPastOrder() {
      return this.orders.filter((po) => parseInt(po.orderStatus) === 6).sort(function (a, b) {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
      });
    },
    addNewOrder: function () {
      if (this.$refs.form.validate()) {
        console.log(this.updatedOrder);
        this.addOrderAction(this.updatedOrder);
        this.snackMessage(
          `New Order "${this.updatedOrder.id}" added successfully!`
        );
      }
    },
    updateOrder: async function () {
      console.log(this.tempOrder);
      await this.updateOrderAction({
        id: this.tempOrder.id,
        orderDt: this.tempOrder.orderDt,
        cutOffDt: this.tempOrder.cutOffDt,
        orderStatus: this.tempOrder.orderStatus,
        isLocked: this.tempOrder.isLocked,
      });
      this.activeOrders = [];
      this.activeOrders.push(this.getCurrentOrder);
      this.snackMessage(`Order: ${this.tempOrder.id} updated successfully!`);
      this.sortedData();
    },
    sortedData: function () {
      return this.orders.sort(function (a, b) {
        if (a.orderDate < b.orderDate) {
          return -1;
        }
        if (a.orderDate > b.orderDate) {
          return 1;
        }
        return 0;
      });
    },
    getStatusName(id) {
      let orderStatus = this.orderstatus.find((o) => o.id === id);
      let status = orderStatus ? `${orderStatus.status}` : "Not Found";
      if (status === "Cancelled")
        return { icon: "mdi-cancel", color: "red", status: "Cancelled" };
      else if (status === "Complete")
        return {
          icon: "mdi-emoticon-happy",
          color: "green",
          status: "Complete",
        };
      else if (status === "Active")
        return { icon: "mdi-check", color: "blue", status: "Active" };
      else return { icon: "mdi-clock", color: "black", status: "Not Found" };
    },
    getOrderStatus: function(id){
      return this.orderstatus.find((o) => o.id === id);
    }
  },
  computed: {
    ...mapState(["orders", "orderstatus"]),
    ...mapGetters(["getActiveOrderStatus", "getCurrentOrder", "isAdminUser"]),
    sortedItems: function () {
      return 0;
    },
    
  },
};
</script>