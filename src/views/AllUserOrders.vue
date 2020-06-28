<template>
  <div>
    <v-card class="mx-auto ma-3" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="5" class="ma-0 pa-0"></v-col>
              <v-col cols="6" class="ma-0 pa-0">Package Order By User</v-col>
              <v-col cols="1" class="ma-0 pa-0">
                <v-toolbar-title class="ma-0 pa-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" dense small text>
                        <v-icon large v-if="!isPounds" @click="toggleGmsLbs">mdi-weight-kilogram</v-icon>
                        <v-icon large v-if="isPounds" @click="toggleGmsLbs">mdi-weight-pound</v-icon>
                      </v-btn>
                    </template>
                    <span>lbs - kgs</span>
                  </v-tooltip>
                </v-toolbar-title>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="user in localUsers" :key="user.id">
          <v-expansion-panel-header @click="getUserPo(user.id)">{{user.firstname}} {{user.lastname}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form v-model="valid">
              <v-card class="mx-auto mt-3" max-width="1100" tile dense>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row no-gutters>
                        <v-col class="ma-0 pa-0 align-centre" cols="2">Item</v-col>
                        <v-col cols="2">Orderd Qty</v-col>
                        <v-col cols="2">Suggested Qty</v-col>
                        <v-col cols="2">Act Qty</v-col>
                        <v-col cols="1">Packed</v-col>
                        <v-col cols="2">Unit Price</v-col>
                        <v-col cols="1">Total</v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-1" max-width="1100" tile dense>
                <v-list-item v-for="item in localUserPo" :key="item.id" dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-text-field
                            v-model="item.itemName"
                            hide-details="auto"
                            class="ma-0 pa-0 .flex-wrap"
                            :value="item.itemName"
                            color="success"
                            disabled
                            label
                            dense
                            wrap
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.qtyConv"
                              :label="getDefaultUnits(item.defaultUnitsConv)"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseInt(item.qtyConv).toFixed(2)"
                              disabled
                              color="success"
                              dense
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-flex shrink class="text-xl-left">
                              <v-text-field
                                v-model="item.suggestedQtyConv"
                                :label="getDefaultUnits(item.defaultUnitsConv)"
                                hide-details="auto"
                                class="ma-0 pa-0 text-xl-left"
                                :value="parseFloat(item.suggestedQtyConv).toFixed(2)"
                                color="success"
                                dense
                                disabled
                              ></v-text-field>
                            </v-flex>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mb-2 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.actQtyConv"
                              :label="getDefaultUnits(item.defaultUnitsConv)"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(item.actQtyConv).toFixed(2)"
                              @change="calcItemPrice(item)"
                              color="success"
                              dense
                              outlined
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="1" class="mt-2 pl-5">
                          <v-icon
                            @click="itemPacked(item, user)"
                            v-if="parseInt(item.isPacked) === 1"
                            color="green"
                          >mdi-toggle-switch</v-icon>
                          <v-icon
                            @click="itemPacked(item, user)"
                            v-if="parseInt(item.isPacked) === 0"
                            color="red"
                          >mdi-toggle-switch-off</v-icon>
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.actPrice"
                              style="text-align:right"
                              hide-details
                              class="ma-0 pa-0 float-right"
                              :value="parseFloat(item.actPrice).toFixed(2)"
                              @change="calcItemPrice(item)"
                              prepend-inner-icon="mdi-currency-usd"
                              dense
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="1" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.totalPrice"
                              hide-details
                              class="ma-0 pa-0 float-right"
                              :value="item.totalPrice"
                              disabled
                              prepend-inner-icon="mdi-currency-usd"
                              dense
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row no-gutters>
                        <v-col cols="3" class="mb-0 pb-0"></v-col>
                        <v-col cols="2" class="mb-0 pb-0"></v-col>
                        <v-col cols="2" class="mb-0 pb-0"></v-col>
                        <v-col cols="2" class="mb-0 pb-0"></v-col>
                        <v-col cols="2" class="mb-0 pb-0"></v-col>
                        <v-col cols="1" class="mb-0 pb-3">
                          <v-text-field
                            hide-details
                            class="ma-0 pa-0 float-right"
                            :value="grandTotal"
                            disabled
                            label
                            prepend-inner-icon="mdi-currency-usd"
                            readonly
                            full-width
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col cols="1" class="ml-0 pb-0">
                          <!-- <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="sendEmail(user.id)"
                        >
                          <v-icon dark>mdi-email</v-icon>
                          </v-btn>-->
                        </v-col>
                        <v-col cols="3" class="mb-0 pb-0"></v-col>
                        <v-col cols="4" class="mb-0 pb-0">
                          <v-btn
                            color="success"
                            @click="savePo()"
                            :disabled="!valid"
                            class="float-right"
                          >Save</v-btn>
                        </v-col>
                        <v-col cols="4" class="mb-0 pb-3">
                          <v-row justify="center">
                            <v-btn
                              color="primary"
                              dark
                              @click.stop="getEmailText(user.allPacked, user.nonePacked); dialog = true;"
                            >
                              <v-icon dark>mdi-email</v-icon>
                            </v-btn>
                            <v-dialog v-model="dialog" max-width="290">
                              <v-card>
                                <v-card-title class="headline" color="red">
                                  Order Email
                                  <v-spacer></v-spacer>
                                  <v-icon v-if="user.nonePacked " color="red" large>mdi-email-alert</v-icon>
                                  <v-icon
                                    v-if="!user.nonePacked && !user.allPacked"
                                    color="orange"
                                    large
                                  >mdi-email-alert</v-icon>
                                </v-card-title>
                                <v-card-text>{{emailDialogText}}</v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                                  <v-btn
                                    color="green darken-1"
                                    text
                                    @click="sendEmail(user.id); dialog = false"
                                  >Yes</v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-form>
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
import { mapState, mapActions, mapGetters } from "vuex";
import { dataService } from "../shared";
export default {
  name: "AllUserOders",
  data() {
    return {
      localUsers: [],
      localUserPo: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      tempPO: {
        id: 0,
        orderId: 0,
        itemId: 0,
        userId: 0,
        qty: 0,
        actQty: 0,
        actPrice: 0,
        isCancelled: 0
      },
      dialog: false,
      emailDialogText: "",
      emailDialogTextColor: ""
    };
  },
  created() {
    this.getUsers();
  },
  mounted() {
    this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
  },
  methods: {
    ...mapActions([
      "getOrdersAction",
      "getItemsAction",
      "getPurchaseOrderByOrderIdAction",
      "updatePurchaseOrderAction"
    ]),
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
      this.localUserPo.forEach(po => {
        po.qtyConv = this.convertGmsToLbs(po.qtyConv, po.defaultUnitsConv);
        po.suggestedQtyConv = this.convertGmsToLbs(
          po.suggestedQtyConv,
          po.defaultUnitsConv
        );
        po.actQtyConv = this.convertGmsToLbs(
          po.actQtyConv,
          po.defaultUnitsConv
        );
        po.defaultUnitsConv = this.getDefaultUnits(po.defaultUnitsConv);
      });
    },
    convertGmsToLbs(qty, defaultUnits) {
      if (defaultUnits !== "kgs" && defaultUnits !== "lbs") return qty;
      if (this.isPounds && defaultUnits === "lbs") {
        return qty ? qty : null;
      } else if (this.isPounds && defaultUnits === "kgs") {
        return qty ? (qty * 2.20462).toFixed(2) : null;
      }

      if (!this.isPounds && defaultUnits === "kgs") {
        return qty ? qty : null;
      } else if (!this.isPounds && defaultUnits === "lbs") {
        return qty ? (parseFloat(qty) * 0.453592).toFixed(2) : null;
      }
    },
    calcPrice: function(item) {
      if (item.defaultUnits === "lbs" && item.defaultUnitsConv === "kgs")
        item.actQty = item.actQtyConv * 2.20462;
      else if (item.defaultUnits === "kgs" && item.defaultUnitsConv === "lbs")
        item.actQty = item.actQtyConv * 0.453592;
      else item.actQty = item.actQtyConv;
    },
    getDefaultUnits(defaultUnits) {
      //console.log(this.isPounds);
      if (defaultUnits !== "kgs" && defaultUnits !== "lbs") return defaultUnits;
      if (this.isPounds) return "lbs";
      else return "kgs";
    },

    async getUsers() {
      await dataService.getAllUsers().then(response => {
        this.localUsers = response;
      });
      this.localUsers.forEach(lo => {
        lo["allPacked"] = false;
      });
    },
    calcItemPrice: function(item) {
      this.calcPrice(item);
      item.totalPrice = (
        parseFloat(item.actPrice) * parseFloat(item.actQty)
      ).toFixed(2);
    },
    getEmailText(allPacked, nonePacked) {
      if (nonePacked) {
        this.emailDialogTextColor = "red";
        this.emailDialogText =
          "No items have been packed, do you still want to send the email?";
      } else if (allPacked) {
        this.emailDialogTextColor = "green";

        this.emailDialogText = "Are you ready to send the email?";
      } else {
        this.emailDialogTextColor = "orange";

        this.emailDialogText =
          "Order is only partially filled, do you want to send an email?";
      }
    },
    sendEmail(id) {
      let pol = this.purchaseOrders.find(
        pos =>
          parseInt(pos.isPacked) === 1 && parseInt(pos.userId) === parseInt(id)
      );
      if (pol) {
        dataService
          .sendEmailPurchaseOrder(this.localUserPo[0], this.user.id)
          .then(() => {
            this.snackMessage("Email sent successfully!");
          })
          .catch(error => {
            console.log(error);
            this.snackMessage("Failed to send Email.");
          });
      } else {
        this.snackMessage("No items packed yet!");
      }
    },
    savePo() {
      this.localUserPo.forEach(lp => {
        this.tempPO = {
          id: lp.id,
          orderId: lp.orderId,
          itemId: lp.itemId,
          userId: lp.userId,
          qty: lp.qty,
          actQty: parseFloat(lp.actQty),
          suggestedQty: parseFloat(lp.suggestedQty),
          actPrice: parseFloat(lp.actPrice),
          isCancelled: lp.isCancelled,
          isPacked: lp.isPacked
        };
        this.updatePurchaseOrderAction(this.tempPO);
        //console.log(this.tempPO);
      });
      this.snackMessage(`Updated Data!`);
    },

    getActPrice(item) {
      let actItem = this.getActualPrice.find(ap => ap.itemId === item.id);
      if (actItem) return actItem;
      else return { itemId: 0, price: 0 };
    },

    getUserPo(id) {
      this.localUserPo = [];
      let pos = this.purchaseOrders.filter(
        po =>
          parseInt(po.userId) === parseInt(id) && parseInt(po.isCancelled) === 0
      );
      let unPackedItems = pos.find(po => parseInt(po.isPacked) === 0);
      let packedItems = pos.find(po => parseInt(po.isPacked) === 1);
      let user = this.localUsers.find(u => parseInt(u.id) === parseInt(id));
      if (user) {
        user.allPacked = unPackedItems ? false : true;
        user.nonePacked = packedItems ? false : true;
      }

      pos.forEach(lp => {
        let item = this.getActiveItems.find(i => i.id === lp.itemId);

        if (item) {
          let actItems = this.getActPrice(item);
          let actPrice = actItems.itemId > 0 ? actItems.price : lp.actPrice;
          let bulkItem = this.bulkOrders.find(
            bo => bo.itemId === item.id && parseInt(bo.actQty) > 0
          );
          if (bulkItem) {
            this.localUserPo.push({
              id: lp.id,
              orderId: lp.orderId,
              itemId: lp.itemId,
              userId: lp.userId,
              qty: lp.qty,
              qtyConv: this.convertGmsToLbs(lp.qty, item.defaultUnits),
              actQty: lp.actQty > 0 ? lp.actQty : null,
              actQtyConv: this.convertGmsToLbs(lp.actQty, item.defaultUnits),
              suggestedQty: lp.suggestedQty,
              suggestedQtyConv: this.convertGmsToLbs(
                lp.suggestedQty,
                item.defaultUnits
              ),
              actPrice: actPrice,
              isCancelled: lp.isCancelled,
              isPacked: lp.isPacked,
              itemName: item.name,
              defaultUnits: item.defaultUnits,
              defaultUnitsConv: this.getDefaultUnits(item.defaultUnits),
              totalPrice: (
                (actPrice ? parseFloat(actPrice) : 0) *
                (lp.actQty ? parseFloat(lp.actQty) : 0)
              ).toFixed(2)
            });
          }
        }
      });
    },
    async itemPacked(item, user) {
      if (item.actQty) {
        let flag = parseInt(item.isPacked) === 1 ? 0 : 1;
        // await this.updatePurchaseOrderAction({
        //   id: item.id,
        //   orderId: item.orderId,
        //   itemId: item.itemId,
        //   userId: item.userId,
        //   qty: item.qty,
        //   actQty: item.actQty,
        //   actPrice: item.actPrice,
        //   suggestedQty: item.suggestedQty,
        //   isCancelled: item.isCancelled,
        //   isPacked: flag
        // });
        // this.getUserPo(item.userId);
        item.isPacked = flag;
        if (flag)
          this.snackMessage(`${item.itemName} packed for ${user.firstname}!`);
        else
          this.snackMessage(
            `${item.itemName} not packed for ${user.firstname}!`
          );
      } else
        this.snackMessage(
          `Please enter a value in Actual Quantity before setting this flag`
        );
    }
  },

  computed: {
    ...mapState(["purchaseOrders", "items", "user", "bulkOrders"]),
    ...mapGetters(["getCurrentOrder", "getActiveItems", "getActualPrice"]),

    grandTotal: function() {
      var total = 0;
      this.localUserPo.forEach(item => {
        if (item) {
          if (parseInt(item.isPacked) === 1) {
            total += parseFloat(item.totalPrice);
          }
        }
      });

      return total.toFixed(2);
    },
    isPounds: {
      get() {
        return this.$store.state.isPounds;
      },
      set(value) {
        this.$store.commit("togglePounds", value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$text-field-label-top: 2px;
</style>