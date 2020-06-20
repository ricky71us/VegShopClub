<template>
  <div>
    <v-form v-model="valid">
      <v-divider></v-divider>
      <v-card class="mx-auto mt-7" max-width="900" tile dense>
        <v-list-item dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row>
                <v-col cols="4">Item</v-col>
                <v-col cols="2">Orderd Qty</v-col>
                <v-col cols="2">Act Qty</v-col>
                <v-col cols="2">Total</v-col>
                <v-col cols="2">Act Price</v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card class="mx-auto mt-7" max-width="900" tile dense>
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
                      rounded
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
                      rounded
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
                      rounded
                    ></v-text-field>
                  </v-flex>
                </v-col>
                <v-col cols="2" class="mb-0 pb-0">
                  <v-text-field
                    v-model="item.totalPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="item.totalPrice"
                    label
                    @change="calcItemPrice(item)"
                    height="26"
                    prepend-inner-icon="mdi-currency-usd"
                    dense
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
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0 float-right">Total</v-col>
                <v-col cols="2" class="mb-0 pb-3">
                  <v-text-field
                    hide-details="auto"
                    class="ma-0 pa-0 float-right"
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
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-0"></v-col>
                <v-col cols="2" class="mb-0 pb-3">
                  <v-btn
                    color="success"
                    @click="saveBo()"
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
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
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
    this.getItemsAction();
    this.getBulkOrderAction();
    this.getPurchaseOrderAction();    
  },
  created() {
    //console.log("created");
    this.getItems;
  },
  methods: {
    ...mapActions([
      "getItemsAction",
      "getBulkOrderAction",
      "getPurchaseOrderAction",
      "updateBulkOrderAction"
    ]),
    calcItemPrice: function(item) {
      item.totalPrice = (
        parseFloat(item.totalPrice) / parseFloat(item.actQty)
      ).toFixed(2);
    },
    getItemById: function(id) {
      return this.items.find(i => i.id === id);
    },
    getQtyByItem() {
      this.purchaseOrders.forEach(i => {
        if (
          this.itemQty.length === 0 ||
          !this.itemQty.find(iq => iq.itemId === i.itemId)
        ) {
          this.itemQty.push({
            itemId: i.itemId,
            qty: i.qty
          });
        } else {
          let item = this.itemQty.find(iq => iq.itemId === i.itemId);
          item.qty += i.qty;
        }
      });
    },
    saveBo() {
      this.localItems.forEach(lp => {
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
        console.log(this.tempBO);
      });
      this.snackMessage(`Updated Data!`);
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    }
  },
  computed: {
    ...mapState(["bulkOrders", "items", "purchaseOrders"]),
    ...mapGetters(["getCurrentOrder", "getActiveItems", "getActiveBulkOrders"]),

    getItems: function() {
      if (this.getUserName !== "Guest") {
        this.getActiveBulkOrders.forEach(item => {
          if (
            this.localItems.length === 0 ||
            !this.localItems.find(li => li.id === item.id)
          )
            this.localItems.push({
              id: item.id,
              itemId: item.itemId,
              name: this.getItemById(item.itemId).name,
              defaultUnits: this.getItemById(item.itemId).defaultUnits,
              orderId: item.orderId,
              qty: 0,
              actQty: parseFloat(item.actQty),
              actPrice: parseFloat(item.actPrice),
              isCancelled: item.isCancelled,
              totalPrice: (
                parseFloat(item.actPrice) * parseFloat(item.actQty)
              ).toFixed(2)
            });
        });
        this.purchaseOrders.forEach(i => {
          if (
            this.localItems.length === 0 ||
            !this.localItems.find(iq => iq.itemId === i.itemId)
          ) {
            this.localItems.push({
              itemId: i.itemId,
              qty: i.qty
            });
          } else {
            let item = this.localItems.find(iq => iq.itemId === i.itemId);

            item.qty += parseFloat(i.qty);
          }
        });
      }
      return this.localItems;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>