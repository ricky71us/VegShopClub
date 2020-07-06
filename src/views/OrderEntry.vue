<template>
  <div>
    <v-form v-if="pageLoaded" v-model="valid">
      <div class="text-center" v-if="isOrderLocked">
        <v-sheet color="orange lighten-2">
          This order is
          <v-icon>mdi-lock</v-icon>. No more changes allowed to this order.
        </v-sheet>
      </div>
      <v-divider></v-divider>

      <v-card class="mx-auto mt-12" max-width="1100" color="orange" rounded>
        <v-list-item dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row>
                <v-col cols="12" class="text-md-center">My Order</v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card class="mx-auto mt-3" max-width="1100" tile dense shaped>
        <v-list-item dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row>
                <v-col class="text-md-center" cols="4">Item</v-col>
                <v-col class="text-md-center" cols="4">Quantity</v-col>
                <v-col class="text-md-center" cols="4">Item Total</v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card class="mx-auto mt-2" max-width="1100" tile dense shaped>
        <v-list-item v-for="item in localItems" :key="item.id" dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row class="ma-0 pa-0">
                <v-col cols="4" class="mb-0 pb-0 text-md-left">
                  <v-checkbox
                    v-model="selected"
                    :label="item.name"
                    :value="item.id"
                    class="ma-0 pa-0"
                    @change="validateForm"
                    dense
                  ></v-checkbox>
                </v-col>

                <v-col cols="4" class="text-md-end mb-0 pb-0">
                  <v-flex shrink class="text-xl-left">
                    <v-text-field
                      v-model="item.qty"
                      :label="item.defaultUnits"
                      hide-details="auto"
                      class="ma-0 pa-0 text-md-right"
                      :value="parseFloat(item.qty).toFixed(2)"
                      @change="calcItemPrice(item)"
                      color="success"
                      :rules="checkMinQty(item)"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="4" class="mb-0 pb-0 text-md-right">
                  $ {{item.totalPrice}}
                  <!-- <strong>
                    <v-text-field
                      v-model="item.totalPrice"
                      hide-details="auto"
                      class="custom ma-0 pa-0 text-md-end"
                      :value="item.totalPrice"
                      disabled
                      label
                      prefix="$"
                      dense
                    ></v-text-field>
                  </strong> -->
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
              <v-row>
                <v-col cols="4" class="mb-0 pb-0"></v-col>
                <v-col cols="4" class="text-md-right ml-0 pt-4">(Approximate Total)</v-col>
                <v-col cols="4" class="pr-6 text-md-right" style="font-weight:bold">
                          ${{grandTotal}}
                  <!-- <strong>
                    <v-text-field
                      hide-details="auto"
                      class="custom ma-0 pa-0 text-md-end"
                      :value="grandTotal"
                      disabled
                      label
                      prefix="$"
                    ></v-text-field>
                  </strong> -->
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
                <v-col cols="12" class="mb-0 pb-3">
                  <v-btn
                    v-if="!isOrderLocked && !orderPlaced"
                    color="success"
                    @click="saveOrder()"
                    :disabled="!valid"
                    class="float-right"
                  >Place Order</v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-form>

    <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
      top
      app
      max-width="5"
      transition="fab-transition"
      text
    >
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "OrderEntry",
  data() {
    return {
      valid: false,
      selected: [],
      localItem: {
        id: 0,
        name: "",
        minQty: 0,
        qty: 0,
        defaultUnits: 0,
        price: 0,
        totalPrice: 0
      },
      bulkItem: {
        id: 0,
        orderId: 0,
        itemId: 0,
        actQty: 0,
        actPrice: 0,
        isCancelled: 0
      },
      localItems: [],
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
      snackbar: false,
      message: null,
      multiLine: true,
      isOrderLocked: false,
      orderPlaced: false,
      pageLoaded: false
    };
  },
  mounted() {
    this.validateForm();
    if (this.localItems.length === 0) this.getItems();
  },
  async created() {},
  methods: {
    ...mapActions([
      "getItemsAction",
      "getOrdersAction",
      "getOrderStatusAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction",
      "addPurchaseOrderAction",
      "addBulkOrderAction",
      "updatePurchaseOrderAction"
    ]),
    calcItemPrice: function(item) {
      item.totalPrice = (parseFloat(item.price) * parseFloat(item.qty)).toFixed(
        2
      );
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    checkMinQty(item) {
      //&& this.selected.indexOf(item.id) > 0
      if (item.qty < item.minQty && this.selected.length > 0) {
        //console.log(item);
        return [false || `Min Qty ${item.minQty} ${item.defaultUnits}`];
      }
    },
    setSelectedItems() {
      this.getPurchaseOrderByUser.forEach(po => {
        if (parseInt(po.isCancelled) === 0) {
          this.selected.push(po.itemId);
        }
      });
    },
    validateForm() {
      if (this.selected.length === 0) {
        this.valid = false;
      } else {
        this.valid = true;
      }

      this.localItems.forEach(li => {
        if (this.selected.indexOf(li.id) === -1) {
          li.qty = li.minQty.toFixed(2);
          li.totalPrice = (0).toFixed(2);
        } else {
          li.totalPrice = (li.qty * li.price).toFixed(2);
        }
      });
    },
    setOrderLock: function() {
      this.isOrderLocked =
        parseInt(this.getCurrentOrder.isLocked) === 1 ? true : false;
    },
    getItemPrice(qty, minQty, price, id) {
      if (this.selected.find(i => i === id)) {
        let lQty = qty > 0 ? qty : parseFloat(minQty);
        return (parseFloat(lQty) * parseFloat(price)).toFixed(2);
      } else return (0).toFixed(2);
    },
    async getItems() {
      await this.getOrderStatusAction();
      await this.getOrdersAction();
      await this.getItemsAction();
      await this.setOrderLock();
      await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);
      this.setSelectedItems();

      let localPo = this.getPurchaseOrderByUser;
      //if (this.localItems.length === 0) {
      this.getActiveItems.forEach(item => {
        let po = localPo.find(lp => lp.itemId === item.id);
        if (
          this.localItems.indexOf(i => parseInt(i.id) === parseInt(item.id)) ===
          -1
        ) {
          if (po) {
            this.localItems.push({
              id: item.id,
              name: item.name,
              minQty: parseFloat(item.minQty),
              qty: po.qty > 0 ? po.qty : parseFloat(item.minQty),
              defaultUnits: item.defaultUnits,
              price: parseFloat(item.price),
              totalPrice: this.getItemPrice(
                po.qty,
                item.minQty,
                item.price,
                item.id
              )
            });
          } else {
            this.localItems.push({
              id: item.id,
              name: item.name,
              minQty: parseFloat(item.minQty),
              qty: parseFloat(item.minQty).toFixed(2),
              defaultUnits: item.defaultUnits,
              price: parseFloat(item.price),
              totalPrice: this.getItemPrice(0, item.minQty, item.price, item.id)
            });
          }
        }
      });

      this.localItems.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.pageLoaded = true;
    },
    async saveOrder() {
      this.orderPlaced = true;
      await this.validateForm();
      if (this.user) {
        var selList = [];
        if (this.selected.length > 0) {
          this.selected.forEach(a => {
            if (
              selList.length === 0 ||
              selList.find(sl => parseInt(sl.id) !== parseInt(a))
            )
              selList.push(
                this.localItems.find(li => parseInt(li.id) === parseInt(a))
              );
          });
        }
        if (selList.length > 0) {
          selList.forEach(item => {
            var pod = this.getPurchaseOrderByUser.find(
              po =>
                po.orderId === this.getCurrentOrder.id &&
                po.itemId === item.id &&
                po.userId === this.user.id
            );
            if (pod) {
              if (pod.id)
                this.tempPO = {
                  id: pod.id,
                  orderId: this.getCurrentOrder.id,
                  itemId: item.id,
                  userId: this.user.id,
                  qty: item.qty,
                  actQty: pod.actQty,
                  suggestedQty: pod.suggestedQty,
                  actPrice: 0,
                  isCancelled: 0
                };

              // console.log({
              //   id: pod.id,
              //   orderId: this.getCurrentOrder.id,
              //   itemId: item.id,
              //   userId: this.user.id,
              //   qty: item.qty,
              //   actQty: 0,
              //   actPrice: 0,
              //   isCancelled: 0
              //});
              this.updatePurchaseOrderAction(this.tempPO);
              this.snackMessage(
                `Thank you for your Order! We'll email you, when it is ready for pick up. Please note, items are subject to availability and prices shown here are approximate.`
              );
            } else {
              // console.log({
              //   orderId: this.getCurrentOrder.id,
              //   itemId: item.id,
              //   qty: item.qty,
              //   actQty: 0,
              //   suggestedQty: 0,
              //   actPrice: 0,
              //   userId: this.user.id,
              //   isCancelled: 0
              //});

              this.addPurchaseOrderAction({
                orderId: this.getCurrentOrder.id,
                itemId: item.id,
                qty: item.qty,
                actQty: 0,
                suggestedQty: 0,
                actPrice: 0,
                userId: this.user.id,
                isCancelled: 0
              });

              if (
                this.bulkOrders.length === 0 ||
                !this.bulkOrders.find(
                  bo => parseInt(bo.itemId) === parseInt(item.id)
                )
              ) {
                this.addBulkOrderAction({
                  orderId: this.getCurrentOrder.id,
                  itemId: item.id,
                  actQty: 0,
                  actPrice: item.price,
                  isCancelled: 0,
                  totalPrice: 0
                });
              }
            }
          });
        }

        this.getPurchaseOrderByUser.forEach(po => {
          if (!selList.find(item => item.id === po.itemId)) {
            if (po.id)
              this.tempPO = {
                id: po.id,
                orderId: this.getCurrentOrder.id,
                itemId: po.itemId,
                userId: this.user.id,
                qty: po.qty,
                actQty: po.actQty,
                actPrice: 0,
                isCancelled: 1
              };

            this.updatePurchaseOrderAction(this.tempPO);
          }
        });
      }
      this.orderPlaced = false;
    }
  },
  computed: {
    ...mapState(["items", "user", "purchaseOrders", "bulkOrders", "isPounds"]),
    ...mapGetters(["getCurrentOrder", "getUserName", "getActiveItems"]),
    getPurchaseOrderByUser() {
      return this.purchaseOrders.filter(po => po.userId === this.user.id);
    },
    getHeaderText: function() {
      return this.isOrderLocked
        ? "<p class='font-weight-black'>(This Order is Locked)</p>"
        : "";
    },
    grandTotal: function() {
      var total = 0;
      var selList = [];
      if (this.selected.length > 0) {
        this.selected.forEach(a => {
          selList.push(
            this.localItems.find(li => parseInt(li.id) === parseInt(a))
          );
        });
      }
      if (selList.length > 0) {
        selList.forEach(item => {
          if (item) total += parseFloat(item.totalPrice);
        });
      }
      return total.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
$textarea-padding: 0px !default;
.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.v-input {
  border-style: none;
}
</style>