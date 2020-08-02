<template>
  <div>
    <v-card class="mx-auto mt-5" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="11" class="ma-0 pt-2 text-md-center hidden-sm-and-down">Pack Order</v-col>
              <v-col cols="10" class="ma-0 pt-2 text-md-center hidden-md-and-up">Pack Order</v-col>
              <v-col cols="1" class="ma-0 pa-0 text-md-start hidden-sm-and-down">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" dense small text>
                      <v-icon large v-if="!isPounds" @click="toggleGmsLbs">mdi-weight-kilogram</v-icon>
                      <v-icon large v-if="isPounds" @click="toggleGmsLbs">mdi-weight-pound</v-icon>
                    </v-btn>
                  </template>
                  <span>lbs - kgs</span>
                </v-tooltip>
              </v-col>
              <v-col cols="2" class="ma-0 pa-0 text-md-start hidden-md-and-up">
                <v-btn dense small text>
                  <v-icon v-if="!isPounds" @click="toggleGmsLbs">mdi-weight-kilogram</v-icon>
                  <v-icon v-if="isPounds" @click="toggleGmsLbs">mdi-weight-pound</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="item in ordItems" :key="item.itemId">
          <v-expansion-panel-header ripple @click="getItemPo(item)" color="#ECEFF1">
            <div
              v-if="parseFloat(item.actPriceFinal) > 0"
              style="color:#1B5E20"
            >{{item.itemName}} ({{item.userCount}})</div>
            <div
              v-if="parseFloat(item.actPriceFinal) === 0"
              style="color:red"
            >{{item.itemName}} ({{item.userCount}})</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form v-model="valid">
              <v-card class="ma-auto mt-3" max-width="1000" dense color="grey lighten-4">
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-md-center hidden-sm-and-down"                          
                        >Total Quantity Ordered - <span style="font-weight:bold;color:#33691E">{{convertGmsToLbs(item.actQty, item.defaultUnits)}} {{getDefaultUnits(item.defaultUnits)}}</span></v-col>
                        <v-col
                          cols="12"
                          class="text-sm-center hidden-md-and-up"
                          style="font-size:12px"
                        >Total Quantity Ordered - <span style="font-weight:bold;color:#33691E">{{convertGmsToLbs(item.actQty, item.defaultUnits)}} {{getDefaultUnits(item.defaultUnits)}}</span></v-col>
                        <!-- <v-col
                          cols="6"
                          class="text-md-right hidden-sm-and-down"
                        >Unit Price $ {{item.actPriceFinal}} / {{item.defaultUnits}}</v-col>
                        <v-col
                          cols="6"
                          class="text-md-center hidden-md-and-up"
                          style="font-size:12px"
                        >Unit Price $ {{item.actPriceFinal}} / {{item.defaultUnits}}</v-col>-->
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-1" max-width="1000" dense>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col cols="6" justify="centre"></v-col>

                        <v-col cols="2" class="hidden-sm-and-down">Ordered Qty</v-col>

                        <v-col cols="2" class="hidden-sm-and-down">Approximate Qty</v-col>
                        <v-col
                          cols="3"
                          class="hidden-md-and-up"
                          style="font-size:12px"
                        >Approx. Qty ({{getDefaultUnits(item.defaultUnits)}})</v-col>
                        <v-col cols="2" class="hidden-sm-and-down">Actual Qty</v-col>
                        <v-col
                          cols="3"
                          class="hidden-md-and-up"
                          style="font-size:12px"
                        >Actual ({{getDefaultUnits(item.defaultUnits)}})</v-col>
                        <!-- <v-col cols="1">Packed</v-col> -->
                        <!-- <v-col cols="2">Unit Price</v-col>
                        <v-col cols="2">Total</v-col>-->
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-1" max-width="1000" dense>
                <v-list-item v-for="itempo in localItemPo" :key="itempo.id" dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="6" class="mt-6 pb-0">{{itempo.buyer}}</v-col>
                        <v-col
                          cols="2"
                          class="mt-4 pb-0 text-md-center hidden-sm-and-down"
                        >{{itempo.qtyConv}} {{itempo.defaultUnitsConv}}</v-col>
                        <v-col
                          cols="2"
                          class="mt-4 pb-0 text-md-center hidden-sm-and-down"
                        >{{itempo.suggestedQtyConv}} {{itempo.defaultUnitsConv}}</v-col>
                        <v-col
                          cols="3"
                          class="mt-6 pb-0 text-md-center hidden-md-and-up"
                          style="font-size:14px"
                        >{{itempo.suggestedQtyConv}}</v-col>
                        <v-col cols="2" class="mb-2 pb-0 hidden-sm-and-down">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="itempo.actQtyConv"
                              :label="getDefaultUnits(itempo.defaultUnitsConv)"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(itempo.actQtyConv).toFixed(2)"
                              @change="calcItemPrice(itempo, item)"
                              color="success"
                              dense
                              outlined
                              :rules="qtyRules"
                              onclick="this.select();"
                            ></v-text-field>
                          </v-flex>
                        </v-col>

                        <v-col cols="3" class="mb-0 pb-0 hidden-md-and-up">
                          <v-text-field
                            v-model="itempo.actQtyConv"
                            hide-details="auto"
                            class="mt-4 pa-0 centered-input"
                            :value="parseFloat(itempo.actQtyConv).toFixed(2)"
                            label
                            @change="calcItemPrice(itempo, item)"
                            height="26"
                            background-color="grey lighten-4"
                            single-line
                            onclick="this.select();"
                            :rules="qtyRules"
                            style="font-size:14px; border: 1px solid;border-radius:3px;display:block;text-decoration:none; text-align:center !default;"
                          ></v-text-field>
                        </v-col>
                        <!-- <v-col cols="1" class="mb-2 pl-8">
                          <v-icon
                            @click="itemPacked(itempo)"
                            v-if="parseInt(itempo.isPacked) === 1"
                            color="green"
                          >mdi-toggle-switch</v-icon>
                          <v-icon
                            @click="itemPacked(itempo)"
                            v-if="parseInt(itempo.isPacked) === 0"
                            color="red"
                          >mdi-toggle-switch-off</v-icon>
                        </v-col>-->
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col
                          cols="6"
                          style="font-size:11px;font-style: italic;"
                          class="mt-2 pb-0 hidden-sm-and-down"
                        >Unit Price $ {{item.actPriceFinal}} / {{item.defaultUnits}}</v-col>
                        <v-col
                          cols="6"
                          style="font-size:11px;font-style: italic;"
                          class="mt-2 pb-0 hidden-md-and-up"
                        >Unit Price $ {{item.actPriceFinal}} / {{item.defaultUnits}}</v-col>
                        <v-col
                          cols="4"
                          class="mt-2 pl-6 hidden-sm-and-down text-md-end"
                        >Total Packed Qty:</v-col>

                        <v-col
                          cols="2"
                          style="font-weight:bold;color:#33691E"
                          class="mt-2 pa-3 hidden-sm-and-down"                          
                        >{{grandTotal}}</v-col>
                        <v-col
                          cols="6"
                          style="font-size:12px; text-align:right;"
                          class="mt-2 pa-3 hidden-md-and-up"
                        >Total Qty: <span style="color:#33691E;font-weight:bold;">{{grandTotal}}</span> </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="hidden-md-and-up">
                          <v-btn
                            color="success"
                            @click="savePo(item)"
                            :disabled="!valid"
                            class="float-right"
                            small
                          >Save</v-btn>
                        </v-col>
                        <v-col class="hidden-sm-and-down">
                          <v-btn
                            color="success"
                            @click="savePo(item)"
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
import { mapState, mapGetters, mapActions } from "vuex";
import { dataService } from "../shared";
export default {
  name: "packagingByItem",
  data() {
    return {
      ordItems: [],
      localItemPo: [],
      localUsers: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      hiddenTextFlag: false,
      itemUnitPrice: 0,
      allQtyEntered: true,
      qtyRules: [(v) => !isNaN(v) || `Please enter a number`],
      itemQty: [],
    };
  },
  async mounted() {
    await this.getItems();
  },
  created() {    
    this.getQtyByItem();
    this.getUsers();
  },
  methods: {
    ...mapActions([
      "getOrdersAction",
      "getItemsAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction",
      "updatePurchaseOrderAction",
      "updateBulkOrderAction",
    ]),
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
      this.localItemPo.forEach((po) => {
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
    calcItemPrice: function (itempo, item) {
      if (parseFloat(itempo.actQtyConv) === 0 || itempo.actQtyConv === "") {
        itempo.isPacked = 0;
      }
      if (itempo.defaultUnits === "lbs" && itempo.defaultUnitsConv === "kgs")
        itempo.actQty = itempo.actQtyConv * 2.20462;
      else if (
        itempo.defaultUnits === "kgs" &&
        itempo.defaultUnitsConv === "lbs"
      )
        itempo.actQty = itempo.actQtyConv * 0.453592;
      else itempo.actQty = itempo.actQtyConv;

      this.allQtyEntered = true;
      if (parseInt(item.totalPrice) > 0 && parseInt(this.grandTotalAct) > 0) {
        if (this.allQtyEntered) {
          this.itemUnitPrice = itempo.actPriceFinal = item.actPriceFinal =
            this.grandTotalAct > 0
              ? this.roundUp(item.totalPrice / this.grandTotalAct, 2).toFixed(2)
              : 0;
        }
      }

      if (!this.allQtyEntered) {
        this.itemUnitPrice = itempo.actPriceFinal = item.actPriceFinal = 0;
      }
    },

    roundUp(num, precision) {
      precision = Math.pow(10, precision);
      return Math.ceil(num * precision) / precision;
    },

    getDefaultUnits(defaultUnits) {
      //console.log(this.isPounds);
      if (defaultUnits !== "kgs" && defaultUnits !== "lbs") return defaultUnits;
      if (this.isPounds) return "lbs";
      else return "kgs";
    },
    getQtyByItem() {
      this.itemQty = [];
      this.purchaseOrders.forEach((i) => {
        if (parseFloat(i.isCancelled) === 0) {
          if (
            this.itemQty.length === 0 ||
            !this.itemQty.find((iq) => iq.itemId === i.itemId)
          ) {
            this.itemQty.push({
              itemId: i.itemId,
              qty: parseFloat(i.qty),
            });
          } else {
            let item = this.itemQty.find((iq) => iq.itemId === i.itemId);
            item.qty = parseFloat(item.qty) + parseFloat(i.qty);
          }
        }
      });
    },
    async getItems() {
      await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.bulkOrders.forEach((bo) => {
        bo.orderId === this.getCurrentOrder.id;
        let itemqty = this.itemQty.find((iq) => iq.itemId === bo.itemId);
        if (itemqty) {
          var item = this.items.find(
            (it) =>
              parseInt(it.id) === parseInt(bo.itemId) &&
              parseInt(it.isActive) === 1
          );
          if (item) {
            let bulkItem = this.bulkOrders.find(
              (bo) =>
                bo.itemId === item.id &&
                parseInt(bo.actQty) > 0 &&
                parseFloat(bo.actPrice) > 0
            );
            if (bulkItem) {
              this.ordItems.push({
                id: bo.id,
                orderId: bo.orderId,
                itemId: item.id,
                itemName: item.name,
                actQty: bo.actQty,
                actPrice: bo.actPrice,
                actPriceFinal: bo.actPriceFinal
                  ? parseFloat(this.roundUp(bo.actPriceFinal, 2)).toFixed(2)
                  : 0,
                totalPrice: bo.totalPrice,
                defaultUnits: item.defaultUnits,
                userCount: this.purchaseOrders.filter(
                  (po) =>
                    po.itemId === item.id && parseInt(po.isCancelled) === 0
                ).length,
              });
            }
          }
        }
      });

      this.ordItems.sort(function (a, b) {
        if (a.itemName < b.itemName) {
          return -1;
        }
        if (a.itemName > b.itemName) {
          return 1;
        }
        return 0;
      });
    },
    async getItemPo(item) {
      //await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      //await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);

      this.localItemPo = [];
      let pos = await this.purchaseOrders.filter(
        (po) =>
          parseInt(po.itemId) === parseInt(item.itemId) &&
          parseInt(po.isCancelled) === 0
      );

      await pos.forEach((lp) => {
        var po = this.purchaseOrders.find(
          (po) => parseInt(po.itemId) === parseInt(lp.itemId)
        );
        if (po) {
          this.localItemPo.push({
            id: lp.id,
            orderId: lp.orderId,
            itemId: lp.itemId,
            userId: lp.userId,
            buyer: this.getUserName(lp.userId).firstname,
            qty: lp.qty,
            qtyConv: this.convertGmsToLbs(lp.qty, item.defaultUnits),
            actQty: lp.actQty,
            actQtyConv: this.convertGmsToLbs(lp.actQty, item.defaultUnits),
            suggestedQty: lp.suggestedQty,
            suggestedQtyConv: this.convertGmsToLbs(
              lp.suggestedQty,
              item.defaultUnits
            ),
            actPrice: item.actPrice,
            isCancelled: lp.isCancelled,
            isPacked: lp.isPacked,
            itemName: item.name,
            defaultUnits: item.defaultUnits,
            defaultUnitsConv: this.getDefaultUnits(item.defaultUnits),
            totalPrice: (
              (item.actPrice ? parseFloat(item.actPrice) : 0) *
              (lp.actQty ? parseFloat(lp.actQty) : 0)
            ).toFixed(2),
          });
        }
      });

      //await this.calcItemPrice(this.localItemPo[0], item);

      this.localItemPo.sort(function (a, b) {
        if (a.buyer < b.buyer) {
          return -1;
        }
        if (a.buyer > b.buyer) {
          return 1;
        }
        return 0;
      });
    },
    async savePo(item) {
      await this.localItemPo.forEach((lp) => {
        this.tempPO = {
          id: lp.id,
          orderId: lp.orderId,
          itemId: lp.itemId,
          userId: lp.userId,
          qty: lp.qty,
          actQty: parseFloat(lp.actQty),
          actPrice: parseFloat(lp.actPrice),
          suggestedQty: lp.suggestedQty,
          isCancelled: lp.isCancelled,
          isPacked: lp.isPacked,
        };
        this.updatePurchaseOrderAction(this.tempPO);
      });

      //console.log(item);
      await this.updateBulkOrderAction(item);

      this.snackMessage(`Updated Data!`);
    },
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        this.localUsers = response;
      });
      this.localUsers.forEach((lo) => {
        lo["allPacked"] = false;
      });
    },

    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    getUserName: function (userId) {
      return this.localUsers.find((u) => parseInt(u.id) === parseInt(userId));
    },
    async itemPacked(itempo) {
      if (itempo.actQty && itempo.actQty > 0) {
        let flag = parseInt(itempo.isPacked) === 1 ? 0 : 1;
        itempo.isPacked = flag;
      } else
        this.snackMessage(
          `Please enter 'Actual Quantity' before marking it packed.`
        );
    },
  },
  computed: {
    ...mapState([
      "bulkOrders",
      "items",
      "purchaseOrders",
      "getActiveBulkOrders",
    ]),
    ...mapGetters(["getCurrentOrder"]),
    grandTotal: function () {
      var totalQty = 0;
      this.localItemPo.forEach((item) => {
        if (item) {
          //if (parseInt(item.isPacked) === 1)
          if (!isNaN(item.actQtyConv))
            totalQty += item.actQtyConv ? parseFloat(item.actQtyConv) : null;
        }
      });
      return totalQty.toFixed(2);
    },
    grandTotalAct: function () {
      var totalQty = 0;

      this.localItemPo.forEach((item) => {
        if (item) {
          if (this.allQtyEntered)
            this.allQtyEntered = parseInt(item.actQty) === 0 ? false : true;
          totalQty += item.actQty ? parseFloat(item.actQty) : null;
        }
      });
      return totalQty.toFixed(2);
    },

    isPounds: {
      get() {
        return this.$store.state.isPounds;
      },
      set(value) {
        this.$store.commit("togglePounds", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>