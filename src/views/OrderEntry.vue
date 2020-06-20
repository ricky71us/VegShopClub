<template>
  <div>
    <v-form v-model="valid">
      <v-divider></v-divider>
      <v-card class="mx-auto mt-7" max-width="700" tile dense>
        <v-list-item v-for="item in localItems" :key="item.id" dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row class="ma-0 pa-0">
                <v-col cols="4" class="mb-0 pb-0">
                  <v-checkbox
                    v-model="selected"
                    :label="item.name"
                    :value="item.id"
                    class="ma-0 pa-0"
                    dense
                  ></v-checkbox>
                </v-col>

                <v-col cols="4" class="mb-0 pb-0">
                  <v-flex shrink class="text-xl-left">
                    <v-text-field
                      v-model="item.qty"
                      :label="item.defaultUnits"
                      hide-details="auto"
                      class="ma-0 pa-0 text-xl-left"
                      :value="parseFloat(item.qty).toFixed(2)"
                      @change="calcItemPrice(item)"
                      color="success"
                      :rules="checkMinQty(item)"
                      dense
                      rounded
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="4" class="mb-0 pb-0">
                  <v-text-field
                    v-model="item.totalPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="item.totalPrice"
                    disabled
                    label
                    height="26"
                    prepend-icon="mdi-currency-usd"
                    dense
                  ></v-text-field>
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
                <v-col cols="4" class="mb-0 pb-0">(Approximate Total Value)</v-col>
                <v-col cols="4" class="mb-0 pb-3">
                  <v-text-field
                    hide-details="auto"
                    class="ma-0 pa-0 float-right"
                    :value="grandTotal"
                    disabled
                    label
                    prepend-icon="mdi-currency-usd"
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
                <v-col cols="4" class="mb-0 pb-0">
                  <!-- <v-btn color="error">Cancel</v-btn> -->
                </v-col>
                <v-col cols="4" class="mb-0 pb-0"></v-col>
                <v-col cols="4" class="mb-0 pb-3">
                  <v-btn
                    color="success"
                    @click="saveOrder()"
                    :disabled="!valid"
                    class="float-right"
                  >Submit</v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-form>
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
      }
    };
  },
  mounted() {
    this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
    this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);
    this.setSelectedItems();    
  },
  created() {
    this.getOrderStatusAction();
    this.getOrdersAction();
    if (this.localItems.length === 0) this.getItems;
  },
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
    checkMinQty(item) {
      //&& this.selected.indexOf(item.id) > 0
      if (item.qty < item.minQty ) {
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
    saveOrder() {
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
                  actQty: 0,
                  actPrice: 0,
                  isCancelled: 0
                };
              this.updatePurchaseOrderAction(this.tempPO);
            } else {
              this.addPurchaseOrderAction({
                orderId: this.getCurrentOrder.id,
                itemId: item.id,
                qty: item.qty,
                userId: this.user.id,
                isCancelled: 0
              });

              if (
                this.bulkOrders.length === 0 ||
                !this.bulkOrders.some(bo => bo.itemId === item.id)
              ) {
                console.log(item.id);
                this.addBulkOrderAction({
                  orderId: this.getCurrentOrder.id,
                  itemId: item.id,
                  actQty: 0,
                  actPrice: item.price,
                  isCancelled: 0
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
                actQty: 0,
                actPrice: 0,
                isCancelled: 1
              };

            this.updatePurchaseOrderAction(this.tempPO);
          }
        });
      }
    }
  },
  computed: {
    ...mapState(["items", "user", "purchaseOrders", "bulkOrders"]),
    ...mapGetters(["getCurrentOrder", "getUserName", "getActiveItems"]),
    getPurchaseOrderByUser() {
      return this.purchaseOrders.filter(po => po.userId === this.user.id);
    },
    getItems: function() {
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
              totalPrice: (
                parseFloat(item.price) * parseFloat(item.minQty)
              ).toFixed(2)
            });
          } else {
            this.localItems.push({
              id: item.id,
              name: item.name,
              minQty: parseFloat(item.minQty),
              qty: parseFloat(item.minQty),
              defaultUnits: item.defaultUnits,
              price: parseFloat(item.price),
              totalPrice: (
                parseFloat(item.price) * parseFloat(item.minQty)
              ).toFixed(2)
            });
          }
        }
      });
      //}

      return this.localItems;
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
</style>