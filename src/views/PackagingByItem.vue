<template>
  <div>
    <v-card class="mx-auto mt-12" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="11" class="ma-0 pt-2 text-md-center">Pack Order</v-col>
              <v-col cols="1">
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
        <v-expansion-panel v-for="item in ordItems" :key="item.itemId">
          <v-expansion-panel-header @click="getItemPo(item)">{{item.itemName}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form v-model="valid">
              <v-card class="mx-auto mt-3" max-width="1000" tile dense dark>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-md-center"
                        >Total Quantity Ordered - {{convertGmsToLbs(item.actQty, item.defaultUnits)}} {{getDefaultUnits(item.defaultUnits)}}</v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-1" max-width="1000" tile dense>
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col cols="5" justify="centre">Buyer</v-col>
                        <v-col cols="2">Ordered Qty</v-col>
                        <v-col cols="2">Suggested Qty</v-col>
                        <v-col cols="2">Actual Qty</v-col>
                        <v-col cols="1">Packed</v-col>
                        <!-- <v-col cols="2">Unit Price</v-col>
                        <v-col cols="2">Total</v-col>-->
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mx-auto mt-1" max-width="1000" tile dense>
                <v-list-item v-for="itempo in localItemPo" :key="itempo.id" dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="5" class="mt-4 pb-0">
                           {{itempo.buyer}}
                        <!--  <strong>
                            <v-text-field
                              v-model="itempo.buyer"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="item.buyer"
                              color="success"
                              disabled
                              label
                              dense
                              flat
                              solo
                            ></v-text-field>
                          </strong> -->
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0 text-md-center">
                          {{itempo.qtyConv}} {{itempo.defaultUnitsConv}}
                          <!-- <v-flex shrink class="text-xl-left">                            
                            <strong>
                              <v-text-field
                                v-model="itempo.qtyConv"
                                :label="getDefaultUnits(itempo.defaultUnitsConv)"
                                hide-details="auto"
                                class="ma-0 pa-0 text-xl-left"
                                :value="parseInt(itempo.qtyConv).toFixed(2)"
                                disabled
                                color="success"
                                dense
                                flat
                                rounded
                              ></v-text-field>
                            </strong>
                          </v-flex> -->
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0 text-md-center">
                          {{itempo.suggestedQtyConv}} {{itempo.defaultUnitsConv}}
                          <!-- <v-flex shrink class="text-xl-left">
                            
                            <strong>
                              <v-text-field
                                v-model="itempo.suggestedQtyConv"
                                :label="getDefaultUnits(itempo.defaultUnitsConv)"
                                hide-details="auto"
                                class="ma-0 pa-0 text-xl-left"
                                :value="parseFloat(itempo.suggestedQtyConv).toFixed(2)"
                                color="success"
                                dense
                                disabled
                                flat
                                rounded
                              ></v-text-field>
                            </strong>
                          </v-flex> -->
                        </v-col>
                        <v-col cols="2" class="mb-2 pb-0">
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
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="1" class="mb-2 pl-8">
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
                        </v-col>
                        <!-- <v-col cols="2" class="pb-0 ma-0">
                        <v-flex shrink class="text-xl-left">
                          <v-text-field
                            v-model="item.actPrice"
                            style="text-align:right"
                            hide-details="auto"
                            class="ma-0 pa-0 float-right"
                            :value="parseFloat(item.actPrice).toFixed(2)"
                            @change="calcItemPrice(item)"
                            color="success"
                            prepend-inner-icon="mdi-currency-usd"
                            dense
                            disabled
                            rounded
                          ></v-text-field>
                        </v-flex>
                      </v-col>
                      <v-col cols="2" class="pb-0 ma-0">
                        <v-text-field
                          v-model="item.totalPrice"
                          hide-details="auto"
                          class="ma-0 pa-0 float-right"
                          :value="item.totalPrice"
                          disabled
                          label
                          height="26"
                          prepend-inner-icon="mdi-currency-usd"
                          dense
                        ></v-text-field>
                        </v-col>-->
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
                <!-- <v-divider></v-divider>
              <v-list-item dense>
                <v-list-item-content dens class="ma-0 pa-0">
                  <v-container class="ma-0 pa-0">
                    <v-row>
                      <v-col cols="4" class="mb-0 pb-0"></v-col>
                      <v-col cols="2" class="mb-0 pb-0"></v-col>
                      <v-col cols="2" class="mb-0 pb-0"></v-col>
                      <v-col cols="2" class="mb-0 pb-0"></v-col>
                      <v-col cols="2" class="mb-0 pb-3">
                        <v-text-field
                          hide-details="auto"
                          class="ma-0 pa-0 float-right"
                          :value="grandTotal"
                          disabled
                          label
                          prepend-inner-icon="mdi-currency-usd"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-divider></v-divider>
                </v-list-item-content>
                </v-list-item>-->
                <v-list-item dense>
                  <v-list-item-content dens class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row>
                        <v-col cols="4" class="ml-0 pb-0">
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
                        <v-col cols="3" style="color:#33691E; font-weight:bold" class="mt-2 pb-0" justify="end">
                          [ Unit Price $ {{item.actPriceFinal}} / {{item.defaultUnits}} ]
                          <!-- <v-chip class="ma-0 pa-0"  label>
                            <v-text-field
                              v-model="item.actPriceFinal"
                              hide-details="auto"
                              class="ml-5 pa-0 float-right"
                              :value="itemUnitPrice"
                              readonly
                              rounded
                              color="red darken-4"
                              prefix="Unit Price $"                              
                            ></v-text-field>
                          </v-chip>-->
                        </v-col>
                        <v-col cols="2" class="mt-2 pl-6">Total Packed Qty:</v-col>
                        <v-col cols="2" style="font-weight:bold" class="mt-2 pa-3">
                          {{grandTotal}} 
                          <!-- <strong>
                            <v-text-field
                              hide-details="auto"
                              class="ma-0 pa-0 float-right"
                              :value="grandTotal"
                              disabled
                              label
                            ></v-text-field>
                          </strong> -->
                        </v-col>
                        <v-col cols="1" class="mb-0 pb-3">
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
      itemUnitPrice: 0
    };
  },
  mounted() {
    this.getItems();
    this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
  },
  created() {
    this.getUsers();
  },
  methods: {
    ...mapActions([
      "getOrdersAction",
      "getItemsAction",
      "getPurchaseOrderByOrderIdAction",
      "updatePurchaseOrderAction",
      "updateBulkOrderAction"
    ]),
    toggleGmsLbs() {
      this.isPounds = this.isPounds ? false : true;
      this.localItemPo.forEach(po => {
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
    calcItemPrice: function(itempo, item) {
      if (parseInt(itempo.actQtyConv) === 0 || itempo.actQtyConv === "")
        itempo.isPacked = 0;
      if (itempo.defaultUnits === "lbs" && itempo.defaultUnitsConv === "kgs")
        itempo.actQty = itempo.actQtyConv * 2.20462;
      else if (
        itempo.defaultUnits === "kgs" &&
        itempo.defaultUnitsConv === "lbs"
      )
        itempo.actQty = itempo.actQtyConv * 0.453592;
      else itempo.actQty = itempo.actQtyConv;
      if (parseInt(item.totalPrice) > 0)
        this.itemUnitPrice = itempo.actPriceFinal = item.actPriceFinal = (
          item.totalPrice / this.grandTotalAct
        ).toFixed(2);
    },
    getDefaultUnits(defaultUnits) {
      //console.log(this.isPounds);
      if (defaultUnits !== "kgs" && defaultUnits !== "lbs") return defaultUnits;
      if (this.isPounds) return "lbs";
      else return "kgs";
    },
    async getItems() {
      await this.bulkOrders.forEach(bo => {
        bo.orderId === this.getCurrentOrder.id;
        var item = this.items.find(
          it =>
            parseInt(it.id) === parseInt(bo.itemId) &&
            parseInt(it.isActive) === 1
        );
        if (item) {
          let bulkItem = this.bulkOrders.find(
            bo =>
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
                ? parseFloat(bo.actPriceFinal).toFixed(2)
                : 0,
              totalPrice: bo.totalPrice,
              defaultUnits: item.defaultUnits
            });
          }
        }
      });

      this.ordItems.sort(function(a, b) {
        if (a.itemName < b.itemName) {
          return -1;
        }
        if (a.itemName > b.itemName) {
          return 1;
        }
        return 0;
      });
    },
    getItemPo(item) {
      this.localItemPo = [];
      let pos = this.purchaseOrders.filter(
        po =>
          parseInt(po.itemId) === parseInt(item.itemId) &&
          parseInt(po.isCancelled) === 0
      );

      pos.forEach(lp => {
        var po = this.purchaseOrders.find(
          po => parseInt(po.itemId) === parseInt(lp.itemId)
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
            ).toFixed(2)
          });
        }
      });

      this.localItemPo.sort(function(a, b) {
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
      await this.localItemPo.forEach(lp => {
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
          isPacked: lp.isPacked
        };
        this.updatePurchaseOrderAction(this.tempPO);
      });

      //console.log(item);
      await this.updateBulkOrderAction(item);

      this.snackMessage(`Updated Data!`);
    },
    async getUsers() {
      await dataService.getAllUsers().then(response => {
        this.localUsers = response;
      });
      this.localUsers.forEach(lo => {
        lo["allPacked"] = false;
      });
    },

    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    getUserName: function(userId) {
      return this.localUsers.find(u => parseInt(u.id) === parseInt(userId));
    },
    async itemPacked(itempo) {
      if (itempo.actQty && itempo.actQty > 0) {
        let flag = parseInt(itempo.isPacked) === 1 ? 0 : 1;
        itempo.isPacked = flag;
      } else
        this.snackMessage(
          `Please enter 'Actual Quantity' before marking it packed.`
        );
    }
  },
  computed: {
    ...mapState(["bulkOrders", "items", "purchaseOrders"]),
    ...mapGetters(["getCurrentOrder"]),
    grandTotal: function() {
      var totalQty = 0;
      this.localItemPo.forEach(item => {
        if (item) {
          //if (parseInt(item.isPacked) === 1)
          totalQty += item.actQtyConv ? parseFloat(item.actQtyConv) : null;
        }
      });
      return totalQty.toFixed(2);
    },
    grandTotalAct: function() {
      var totalQty = 0;
      this.localItemPo.forEach(item => {
        if (item) {
          //if (parseInt(item.isPacked) === 1)
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
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>