<template>
  <div>
    <BaseNoActiveOrderMessage v-if="!getCurrentOrder" />
    <v-card
      class="mx-auto mt-5"
      max-width="1100"
      color="orange"
      rounded
      v-if="getCurrentOrder"
    >
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col
                cols="10"
                class="ma-0 pt-2 text-md-center hidden-sm-and-down"
                >Final Check & Email</v-col
              >
              <v-col cols="10" class="ma-0 pt-2 text-sm-center hidden-md-and-up"
                >Final Check & Email</v-col
              >
              <v-col
                cols="1"
                class="ma-0 pt-1 text-md-center hidden-sm-and-down"
              >
                <v-btn
                  class="ma-0"
                  color="primary"
                  small
                  @click.stop="dialog = true"
                >
                  <v-icon @click="setReadyToSendEmailFlag()">mdi-email</v-icon>
                </v-btn>
                <v-dialog v-model="dialog" max-width="290" modal>
                  <v-card>
                    <v-card-title class="headline" color="red">
                      Send Email~
                      <v-spacer></v-spacer>
                      <v-icon v-if="readyToSendEmail" color="green" large
                        >mdi-email-alert</v-icon
                      >
                      <v-icon v-if="!readyToSendEmail" color="red" large
                        >mdi-email-alert</v-icon
                      >
                    </v-card-title>
                    <v-card-text v-if="readyToSendEmail"
                      >"Are you ready to send email?"</v-card-text
                    >
                    <v-card-text v-if="!readyToSendEmail"
                      >Looks like there are items that needs to be
                      packed</v-card-text
                    >
                    <v-card-actions v-if="readyToSendEmail">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click.stop="dialog = false"
                        >No</v-btn
                      >
                      <v-btn
                        color="green darken-1"
                        text
                        @click="
                          sendEmailAll();
                          dialog = false;
                        "
                        >Yes</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="2" class="ma-0 pt-0 text-sm-center hidden-md-and-up">
                <v-btn
                  class="ma-0"
                  color="primary"
                  small
                  @click.stop="dialog = true"
                >
                  <v-icon @click="setReadyToSendEmailFlag()">mdi-email</v-icon>
                </v-btn>
                <v-dialog v-model="dialog" max-width="290" modal>
                  <v-card>
                    <v-card-title class="headline" color="red">
                      Send Email
                      <v-spacer></v-spacer>
                      <v-icon v-if="readyToSendEmail" color="green" large
                        >mdi-email-alert</v-icon
                      >
                      <v-icon v-if="!readyToSendEmail" color="red" large
                        >mdi-email-alert</v-icon
                      >
                    </v-card-title>
                    <v-card-text v-if="readyToSendEmail"
                      >"Are you ready to send email?"</v-card-text
                    >
                    <v-card-text v-if="!readyToSendEmail"
                      >Looks like there are items that needs to be
                      packed</v-card-text
                    >
                    <v-card-actions v-if="readyToSendEmail">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click.stop="dialog = false"
                        >No</v-btn
                      >
                      <v-btn
                        color="green darken-1"
                        text
                        @click="
                          sendEmailAll();
                          dialog = false;
                        "
                        >Yes</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="1" class="ma-0 pt-1 text-md-end hidden-sm-and-down">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" dense small text>
                      <v-icon
                        class="pa-0"
                        large
                        v-if="!isPounds"
                        @click="toggleGmsLbs"
                        >mdi-weight-kilogram</v-icon
                      >
                      <v-icon large v-if="isPounds" @click="toggleGmsLbs"
                        >mdi-weight-pound</v-icon
                      >
                    </v-btn>
                  </template>
                  <span>lbs - kgs</span>
                </v-tooltip>
              </v-col>
              <!-- <v-col cols="2" class="ma-0 pa-0 text-md-start hidden-md-and-up">              
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">                      
                      <v-btn v-on="on" dense small text >
                        <v-icon v-if="!isPounds" @click="toggleGmsLbs">mdi-weight-kilogram</v-icon>
                        <v-icon v-if="isPounds" @click="toggleGmsLbs">mdi-weight-pound</v-icon>
                      </v-btn>
                    </template>
                    <span>lbs - kgs</span>
                  </v-tooltip>
              
              </v-col>-->
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto mt-2" max-width="1100" dense>
      <v-progress-linear
        v-model="progress"
        color="brown lighten-2"
        height="20"        
      >
        <template v-slot="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" dense>
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="user in localUsers" :key="user.id">
          <v-expansion-panel-header
            ripple
            @click="getUserPo(user.id)"
            color="#ECEFF1"
          >
            <div v-if="user.allPacked" style="color: #1b5e20">
              {{ user.firstname }} {{ user.lastname }} ({{ user.itemCount }})
            </div>
            <div v-if="!user.allPacked" style="color: #dd2c00">
              {{ user.firstname }} {{ user.lastname }} ({{ user.itemCount }})
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form v-model="valid" v-if="displayItems">
              <v-card class="mx-auto mt-3" max-width="1100" tile dense>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row no-gutters>
                        <v-col
                          class="ma-0 pa-0 align-centre hidden-sm-and-down"
                          cols="4"
                          >Item</v-col
                        >
                        <v-col
                          class="ma-0 pa-0 align-centre hidden-md-and-up"
                          cols="9"
                          >Item</v-col
                        >
                        <!-- <v-col cols="2">Orderd Qty</v-col>
                        <v-col cols="2">Suggested Qty</v-col>-->
                        <v-col
                          class="pl-5 text-md-center hidden-sm-and-down"
                          cols="2"
                          >Act Qty</v-col
                        >
                        <v-col
                          cols="1"
                          class="text-md-center hidden-sm-and-down"
                          >Verified</v-col
                        >
                        <v-col cols="3" class="text-sm-center hidden-md-and-up"
                          >Verified</v-col
                        >
                        <v-col class="text-md-end hidden-sm-and-down" cols="2"
                          >Unit Price</v-col
                        >
                        <v-col
                          style="text-align: right"
                          class="pl-12 hidden-sm-and-down"
                          cols="3"
                          >Total</v-col
                        >
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-0" max-width="1100">
                <v-list-item v-for="item in localUserPo" :key="item.id" dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="4" class="mt-4 pb-0 hidden-sm-and-down">{{
                          item.itemName
                        }}</v-col>
                        <v-col cols="9" class="mt-4 pb-0 hidden-md-and-up">{{
                          item.itemName
                        }}</v-col>

                        <v-col
                          cols="2"
                          class="mt-4 pb-0 text-md-center hidden-sm-and-down"
                          >{{ item.actQtyConv }}
                          {{ item.defaultUnitsConv }}</v-col
                        >
                        <v-col
                          cols="1"
                          class="mt-2 pl-5 text-md-center hidden-sm-and-down"
                        >
                          <v-icon
                            v-if="parseInt(item.isPacked) === 1"
                            @click="itemPacked(item, user)"
                            color="green"
                            >mdi-check</v-icon
                          >
                          <v-icon
                            v-if="parseInt(item.isPacked) === 0"
                            @click="itemPacked(item, user)"
                            color="red"
                            >mdi-close</v-icon
                          >
                        </v-col>
                        <v-col
                          cols="3"
                          class="mt-2 pl-5 text-md-center hidden-md-and-up"
                        >
                          <v-icon
                            v-if="parseInt(item.isPacked) === 1"
                            @click="itemPacked(item, user)"
                            color="green"
                            >mdi-check</v-icon
                          >
                          <v-icon
                            v-if="parseInt(item.isPacked) === 0"
                            @click="itemPacked(item, user)"
                            color="red"
                            >mdi-close</v-icon
                          >
                        </v-col>
                        <v-col
                          cols="2"
                          class="mt-4 pb-0 text-md-right hidden-sm-and-down"
                          >$ {{ parseFloat(item.actPrice).toFixed(2) }}</v-col
                        >
                        <v-col
                          cols="3"
                          class="mt-4 pb-0 text-md-right hidden-sm-and-down"
                          >$ {{ item.totalPrice }}</v-col
                        >
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item dense>
                  <v-list-item-content dens class="mb-2 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row no-gutters>
                        <v-col cols="9" class="mb-0 pb-0"></v-col>

                        <v-col
                          cols="3"
                          style="font-weight: bold"
                          class="mt-4 pr-3 text-md-right hidden-sm-and-down"
                          >$ {{ grandTotal }}</v-col
                        >
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
                <!-- <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col cols="8" class="ml-0 pb-0"></v-col>
                        <v-col cols="4">
                          <v-row justify="end" class="mr-0 pb-0">
                            <v-btn
                              color="primary"
                              dark
                              @click.stop="getEmailText(user.allPacked, user.nonePacked); dialog = true;"
                            >
                              <v-icon dark>mdi-email</v-icon>
                            </v-btn>
                            <v-dialog v-model="dialog" max-width="290" modal>
                              <v-card>
                                <v-card-title class="headline" color="red">
                                  Send Email
                                  <v-spacer></v-spacer>
                                  <v-icon v-if="localAllPacked " color="green" large>mdi-email-alert</v-icon>
                                  <v-icon v-if="!localAllPacked" color="red" large>mdi-email-alert</v-icon>
                                </v-card-title>
                                <v-card-text>{{emailDialogText}}</v-card-text>
                                <v-card-actions v-if="localAllPacked ">
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
                  </v-list-item-content> 
                </v-list-item>-->
              </v-card>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card class="mx-auto ma-3 text-md-end" max-width="1100" light dense>
      <!-- <v-btn
        :loading="loading3"
        :disabled="loading3"
        color="blue-grey"
        class="ma-2 white--text"
        @click="loader = 'loading3'"
      >
        Send Email
        <v-icon right dark>mdi-email</v-icon>
      </v-btn>-->
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
        isCancelled: 0,
      },
      dialog: false,
      emailDialogText: "",
      emailDialogTextColor: "",
      localAllPacked: false,
      localNonePacked: false,
      actPriceList: [],
      displayItems: false,
      readyToSendEmail: true,
      progressCount: [],
    };
  },
  async created() {},
  async mounted() {
    if (!this.getCurrentOrder) return;
    await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
    await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);
    await this.getUsers();
    this.actPriceList = this.getActualPrice;
  },
  methods: {
    ...mapActions([
      "getOrdersAction",
      "getItemsAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction",
      "updatePurchaseOrderAction",
    ]),

    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
      this.localUserPo.forEach((po) => {
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
    calcPrice: function (item) {
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
    setReadyToSendEmailFlag() {
      this.readyToSendEmail = true;
      let pos = this.purchaseOrders.filter(
        (po) => parseInt(po.isPacked) === 0 && parseInt(po.isCancelled) === 0
      );
      let boItems = this.bulkOrders.filter(
        (bo) => parseInt(bo.isCancelled) === 0 && bo.actQty > 0
      );
      if (boItems.length === 0) this.readyToSendEmail = false;
      pos.forEach((po) => {
        if (this.readyToSendEmail) {
          if (
            boItems.find((bo) => parseInt(bo.itemId) === parseInt(po.itemId))
          ) {
            this.readyToSendEmail = false;
          }
        }
      });
    },
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        if (response && response.length > 0)
          response.forEach((u) => {
            // let user = this.purchaseOrders.find(
            //   po => po.userId === u.id && parseInt(po.isPacked) === 1
            // );

            let user = this.purchaseOrders.find(
              (po) =>
                po.userId === u.id &&
                parseInt(po.isCancelled) === 0 &&
                parseInt(po.suggestedQty) > 0
            );
            if (user) {
              this.localUsers.push(u);
              this.progressCount.push({ userId: u.id, allPacked: true });
            }
          });
      });

      let boItems = await this.bulkOrders.filter(
        (bo) => parseInt(bo.isCancelled) === 0 && parseFloat(bo.actQty) > 0
      );
      await this.localUsers.forEach((lo) => {
        let pos = this.purchaseOrders.filter(
          (po) =>
            parseInt(po.userId) === parseInt(lo.id) &&
            parseInt(po.isPacked) === 0 &&
            parseInt(po.isCancelled) === 0
        );
        this.progressCount.find((u) => u.userId === lo.id).allPacked = true;        
        lo["allPacked"] = true;
        pos.forEach((po) => {
          if (
            this.bulkOrders.find(
              (bo) =>
                parseInt(bo.itemId) === parseInt(po.itemId) &&
                parseFloat(bo.actQty) > 0
            )
          ) {
            if (lo["allPacked"]) {
              lo["allPacked"] = false;
              this.progressCount.find(
                (u) => u.userId === lo.id
              ).allPacked = false;
            }
            if (this.readyToSendEmail) this.readyToSendEmail = false;
          }
        });

        lo["itemCount"] = this.purchaseOrders.filter(
          (po) =>
            parseInt(po.userId) === parseInt(lo.id) &&
            parseInt(po.isCancelled) === 0 &&
            boItems.find((i) => parseInt(i.itemId) === parseInt(po.itemId))
        ).length;
        //this.setPackedFlags(lo, lo.id);
      });

      this.localUsers.sort(function (a, b) {
        if (a.firstname < b.firstname) {
          return -1;
        }
        if (a.firstname > b.firstname) {
          return 1;
        }
        return 0;
      });
    },
    calcItemPrice: function (item) {
      this.calcPrice(item);
      item.totalPrice = (
        parseFloat(item.actPrice) * parseFloat(item.actQty)
      ).toFixed(2);
    },
    getEmailText(allPacked, nonePacked) {
      this.localAllPacked = allPacked;
      this.localNonePacked = nonePacked;
      if (allPacked) {
        this.emailDialogTextColor = "green";
        this.emailDialogText = "Are you ready to send the email?";
      } else {
        this.emailDialogTextColor = "red";
        this.emailDialogText =
          "Looks like the order is not completely packed, please pack the items before you can send the email";
      }
      // else {
      //   this.emailDialogTextColor = "orange";

      //   this.emailDialogText =
      //     "Order is only partially filled, do you want to send an email?";
      // }
    },
    sendEmailAll() {
      //this.setReadyToSendEmailFlag();
      if (this.readyToSendEmail)
        this.localUsers.forEach((lu) => this.sendEmail(lu.id));
      else this.snackMessage("Please make sure all the items have been packed");
    },
    sendEmail(id) {
      let pol = this.purchaseOrders.find(
        (pos) =>
          parseInt(pos.isPacked) === 1 && parseInt(pos.userId) === parseInt(id)
      );
      if (pol) {
        dataService
          .sendEmailPurchaseOrder(
            { userId: id, orderId: pol.orderId },
            this.user.id
          )
          .then(() => {
            this.snackMessage("Email sent successfully!");
          })
          .catch((error) => {
            console.log(error);
            this.snackMessage("Failed to send Email.");
          });
      } else {
        this.snackMessage("No items packed yet!");
      }
    },
    savePo() {
      this.localUserPo.forEach((lp) => {
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
          isPacked: lp.isPacked,
        };
        this.updatePurchaseOrderAction(this.tempPO);
        //console.log(this.tempPO);
      });
      this.snackMessage(`Updated Data!`);
    },

    getActPrice(item) {
      let actItem = this.actPriceList.find((ap) => ap.itemId === item.id);
      if (actItem) return actItem;
      else return { itemId: 0, price: 0 };
    },

    setPackedFlags(pos, userId) {
      //console.log(pos);
      let unPackedItems = pos.find((po) => parseInt(po.isPacked) === 0);
      let packedItems = pos.find((po) => parseInt(po.isPacked) === 1);
      let user = this.localUsers.find(
        (u) => parseInt(u.id) === parseInt(userId)
      );
      if (user) {
        user.allPacked = unPackedItems ? false : true;
        this.progressCount.find((u) => u.userId === userId).allPacked =
          user.allPacked;
        user.nonePacked = packedItems ? false : true;
        this.setReadyToSendEmailFlag();
      }
    },

    async itemPacked(itempo, user) {
      let unitPriceNotSet = this.bulkOrders.find(
        (bo) =>
          bo.itemId === itempo.itemId && parseFloat(bo.actPriceFinal) === 0
      )
        ? true
        : false;
      if (!unitPriceNotSet) {
        itempo.allPacked = "true";
        user.allPacked = "true";
        this.progressCount.find(
          (u) => u.userId === user.id
        ).allPacked = true;
      }
      if (unitPriceNotSet) {
        this.snackMessage(
          `Please go back to Pack Items page & enter Actual Quantity for all buyers of this item to calculate the Unit Price, before setting 'packed'`
        );
      } else if (itempo.actQty && itempo.actQty > 0) {
        let flag = parseInt(itempo.isPacked) === 1 ? 0 : 1;
        itempo.isPacked = flag;
        await this.updatePurchaseOrderAction(itempo);
        await this.setPackedFlags(this.localUserPo, itempo.userId);
      } else
        this.snackMessage(
          `Please enter Actual Quantity before selecting 'packed'`
        );
    },

    getUserPo(id) {
      this.localUserPo = [];
      let pos = this.purchaseOrders.filter(
        (po) =>
          parseInt(po.userId) === parseInt(id) && parseInt(po.isCancelled) === 0
      );

      pos.forEach((lp) => {
        let item = this.getActiveItems.find((i) => i.id === lp.itemId);

        if (item) {
          let actItems = this.getActPrice(item);

          let actPrice = actItems.itemId > 0 ? actItems.price : 0.0;
          let bulkItem = this.bulkOrders.find(
            (bo) =>
              bo.itemId === item.id &&
              parseInt(bo.actQty) > 0 &&
              parseFloat(bo.actPrice) > 0
          );
          if (bulkItem) {
            this.displayItems = true;
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
              ).toFixed(2),
            });
          }
        }
      });
      this.localUserPo.sort(function (a, b) {
        if (a.itemName < b.itemName) {
          return -1;
        }
        if (a.itemName > b.itemName) {
          return 1;
        }
        return 0;
      });

      this.setPackedFlags(this.localUserPo, id);
    },
  },
  watch: {},
  computed: {
    ...mapState(["purchaseOrders", "items", "user", "bulkOrders"]),
    ...mapGetters([
      "getCurrentOrder",
      "getActiveItems",
      "getActualPrice",
      "noActiveOrder",
    ]),

    grandTotal: function () {
      var total = 0;
      this.localUserPo.forEach((item) => {
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
      },
    },
    progress() {
      let packedItems = this.progressCount.filter((item) => item.allPacked);
      if (packedItems.length === 0) return 0;
      else return (packedItems.length / this.progressCount.length) * 100;
    },
  },
};
</script>

<style lang="scss" scoped>
$text-field-label-top: 2px;
</style>