<template>
  <div>
    <v-form v-model="valid">
      <v-divider></v-divider>
      <v-card class="mx-auto mt-3" max-width="1100" tile dense color="orange">
        <v-list-item dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row>
                <v-col cols="5"></v-col>
                <v-col cols="4">Bulk Order</v-col>
                <v-col cols="2"></v-col>
                <v-col cols="1"></v-col>
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
                <v-col cols="4">Item</v-col>
                <v-col cols="2">Ordered Qty</v-col>
                <v-col cols="2">Act Qty</v-col>
                <v-col cols="2">Total</v-col>
                <v-col cols="2">Unit Price</v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card class="mx-auto mt-1" max-width="1100" tile dense shaped>
        <v-list-item v-for="item in localItems" :key="item.id" dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row cols="4" class="ma-0 pa-0">
                <v-col>
                  <v-flex shrink class="text-xl-left">
                    <v-text-field
                      v-model="item.name"
                      hide-details="auto"
                      class="ma-0 pa-0 text-xl-left"
                      :value="item.name"
                      color="success"
                      dense
                      disabled
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0">
                  <v-flex shrink class="text-xl-left">
                    <v-text-field
                      v-model="item.qty"
                      :label="item.defaultUnits"
                      hide-details="auto"
                      class="ma-0 pa-0 text-xl-left"
                      :value="parseInt(item.qty).toFixed(2)"
                      color="success"
                      disabled
                      dense
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0">
                  <v-flex shrink class="text-xl-left">
                    <v-text-field
                      v-model="item.actQty"
                      :label="item.defaultUnits"
                      hide-details="auto"
                      class="ma-0 pa-0 text-xl-left"
                      :value="parseInt(item.qty).toFixed(2)"
                      @change="calcItemPrice(item)"
                      color="success"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0">
                  <v-text-field
                    v-model="item.totalPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="parseInt(item.totalPrice).toFixed(2)"
                    label
                    @change="calcItemPrice(item)"
                    height="26"
                    prepend-inner-icon="mdi-currency-usd"
                    dense
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0">
                  <v-text-field
                    v-model="item.actPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="parseInt(item.actPrice).toFixed(2)"
                    height="26"
                    disabled
                    prepend-inner-icon="mdi-currency-usd"
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
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0 float-right"></v-col>
                <v-col cols="2" class="mb-0 pb-3">
                  <v-text-field
                    hide-details="auto"
                    class="ma-0 pa-0 float-right"
                    disabled
                    label
                    :value="grandTotal"
                    prepend-inner-icon="mdi-currency-usd"
                  ></v-text-field>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
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
                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        color="success"
                        @click="updateQty()"
                        class="float-left"
                      >Update Qty</v-btn>
                    </template>
                    <span>Update item quantity for each user proportionate to items ordered</span>
                  </v-tooltip>-->
                </v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-3">
                  <v-btn
                    color="success"
                    @click="saveBo()"
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
  name: "BulkOrder",
  data() {
    return {
      valid: false,
      localItems: [],
      itemQty: [],
      snackbar: false,
      message: null,
      multiLine: true,
      tempBO: {
        id: 0,
        orderId: 0,
        itemId: 0,
        actQty: 0,
        actPrice: 0,
        isCancelled: 0
      }
    };
  },
  mounted() {
    this.getQtyByItem();
    this.getItemsAction();
    this.getItems();
  },
  created() {
    //console.log("created");
  },
  methods: {
    ...mapActions([
      "getItemsAction",
      "getOrdersAction",
      "getOrderStatusAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction",
      "updateBulkOrderAction"
    ]),
    calcItemPrice: function(item) {
      if (parseInt(item.actQty) > 0)
        item.actPrice = (
          parseFloat(item.totalPrice) / parseFloat(item.actQty)
        ).toFixed(4);
    },
    getItemById: function(id) {
      return this.items.find(i => i.id === id);
    },
    getQtyByItem() {
      this.itemQty = [];      
      this.purchaseOrders.forEach(i => {
        if (
          this.itemQty.length === 0 ||
          !this.itemQty.find(iq => iq.itemId === i.itemId)
        ) {
          this.itemQty.push({
            itemId: i.itemId,
            qty: parseFloat(i.qty)
          });
        } else {
          let item = this.itemQty.find(iq => iq.itemId === i.itemId);
          item.qty = parseFloat(item.qty) + parseFloat(i.qty);
        }        
      });
    },
    updateQty() {
      dataService.updateActQty(this.getCurrentOrder.id);
    },
    async saveBo() {
      await this.localItems.forEach(lp => {
        this.tempBO = {
          id: lp.id,
          orderId: lp.orderId,
          itemId: lp.itemId,
          actQty: parseFloat(lp.actQty),
          actPrice: parseFloat(lp.actPrice),
          totalPrice: parseFloat(lp.totalPrice),
          isCancelled: lp.isCancelled
        };
        this.updateBulkOrderAction(this.tempBO);
      });

      await this.updateQty();
      this.snackMessage(`Updated Data!`);
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    async getItems() {
      await this.getOrderStatusAction();
      await this.getOrdersAction();
      await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);      
      this.getActiveBulkOrders.forEach(item => {
        if (item) {
          if (
            this.localItems.length === 0 ||
            !this.localItems.find(li => {
              li.id === item.id;
            })
          )
            this.localItems.push({
              id: item.id,
              itemId: item.itemId,
              name: this.getItemById(item.itemId).name,
              defaultUnits: this.getItemById(item.itemId).defaultUnits,
              orderId: item.orderId,
              qty: this.itemQty.find(iq => iq.itemId === item.itemId).qty,
              actQty: item.actQty > 0 ? parseFloat(item.actQty) : null,
              totalPrice:
                item.totalPrice > 0 ? parseFloat(item.totalPrice) : null,
              isCancelled: item.isCancelled,
              actPrice:
                item.actQty > 0
                  ? (
                      parseFloat(item.totalPrice) / parseFloat(item.actQty)
                    ).toFixed(4)
                  : 0
            });
        }
      });      
      return this.localItems;
    }
  },
  computed: {
    ...mapState(["bulkOrders", "items", "purchaseOrders"]),
    ...mapGetters(["getCurrentOrder", "getActiveItems", "getActiveBulkOrders"]),
    grandTotal: function() {
      var total = 0;
      this.localItems.forEach(item => {
        if (item) {
          if (item.totalPrice) {
            if (!isNaN(item.totalPrice)) {
              total += parseFloat(item.totalPrice);
            }
          }
        }
      });

      return total.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>