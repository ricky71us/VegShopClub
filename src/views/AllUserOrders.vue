<template>
  <div>
    <v-card class="mx-auto ma-3" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="5"></v-col>
              <v-col cols="6">Package Order By User</v-col>
              <v-col cols="1"></v-col>
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
                              v-model="item.qty"
                              :label="item.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseInt(item.qty).toFixed(2)"
                              disabled
                              color="success"
                              dense
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.suggestedQty"
                              :label="item.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(item.suggestedQty).toFixed(2)"
                              color="success"
                              dense
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mb-2 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="item.actQty"
                              :label="item.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(item.actQty).toFixed(2)"
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
                          <v-row justify="end">
                            <v-btn
                              color="primary"
                              dark
                              @click.stop="getEmailText(user.allPacked, user.nonePacked); dialog = true;"
                            >
                              <v-icon dark>mdi-email</v-icon>
                            </v-btn>
                            <v-dialog v-model="dialog" max-width="290">
                              <v-card >
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
                        <v-col cols="4" class="mb-0 pb-0"></v-col>
                        <v-col cols="4" class="mb-0 pb-3">
                          <v-btn
                            color="success"
                            @click="savePo()"
                            :disabled="!valid"
                            class="float-right"
                          >Save</v-btn>
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
    async getUsers() {
      await dataService.getAllUsers().then(response => {
        this.localUsers = response;
      });
      this.localUsers.forEach(lo => {
        lo["allPacked"] = false;
      });
    },
    calcItemPrice: function(item) {
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
          this.localUserPo.push({
            id: lp.id,
            orderId: lp.orderId,
            itemId: lp.itemId,
            userId: lp.userId,
            qty: lp.qty,
            actQty: lp.actQty > 0 ? lp.actQty : null,
            suggestedQty: lp.suggestedQty,
            actPrice: actPrice,
            isCancelled: lp.isCancelled,
            isPacked: lp.isPacked,
            itemName: item.name,
            defaultUnits: item.defaultUnits,
            totalPrice: (
              (actPrice ? parseFloat(actPrice) : 0) *
              (lp.actQty ? parseFloat(lp.actQty) : 0)
            ).toFixed(2)
          });
        }
      });
    },
    async itemPacked(item, user) {      
      if (item.actQty) {
        let flag = parseInt(item.isPacked) === 1 ? 0 : 1;
        await this.updatePurchaseOrderAction({
          id: item.id,
          orderId: item.orderId,
          itemId: item.itemId,
          userId: item.userId,
          qty: item.qty,
          actQty: item.actQty,
          actPrice: item.actPrice,
          suggestedQty: item.suggestedQty,
          isCancelled: item.isCancelled,
          isPacked: flag
        });
        this.getUserPo(item.userId);
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
    ...mapState(["purchaseOrders", "items", "user"]),
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
    }
  }
};
</script>

<style lang="scss" scoped>
$text-field-label-top: 2px;
</style>