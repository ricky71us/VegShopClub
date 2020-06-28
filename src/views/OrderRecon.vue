<template>
  <div>
    <v-card class="mx-auto ma-3" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="5"></v-col>
              <v-col cols="6">Order Reconciliation</v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-form ref="form" v-model="valid">
        <v-card class="mx-auto mt-1" max-width="1100" tile dense shaped>
          <v-list-item dense>
            <v-list-item-content dens class="ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row >
                  <v-col cols="2"></v-col>
                  <v-col cols="4">Bulk Order</v-col>
                  <v-col cols="4">Packed Order</v-col>
                  <v-col cols="2"></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="1"></v-col>
                  <v-col cols="1">Item</v-col>
                  <v-col cols="2">Qty</v-col>
                  <v-col cols="2">Total</v-col>
                  <v-col cols="2">Qty</v-col>
                  <v-col cols="2">Total</v-col>
                  <v-col cols="2">Unit Price</v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto mt-1" max-width="1100" tile dense shaped>
          <v-list-item v-for="item in reportData" :key="item.itemId" dense>
            <v-list-item-content dens class="ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row class="ma-0 pa-0 red--text text--lighten-1" >
                  <v-col cols="2">
                    <v-icon small class="ma-0 pa-0" :color="item.starColor">mdi-star</v-icon>
                    <v-flex shrink class="text-xl-left">
                      <v-text-field
                        v-model="item.itemName"
                        hide-details="auto"
                        class="mb-0 pb-0 text-xl-left"
                        :value="item.itemName"
                        color="success"                        
                        dense
                        label
                        disabled
                        rounded
                      ></v-text-field>
                    </v-flex>
                  </v-col>
                  <v-col cols="2">
                    <v-flex shrink class="text-xl-left">
                      <v-text-field
                        v-model="item.boQty"
                        :label="item.defaultUnits"
                        hide-details="auto"
                        class="ma-0 pa-0 text-xl-left"
                        :value="item.boQty"
                        color="success"
                        dense
                        disabled
                        rounded
                      ></v-text-field>
                    </v-flex>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0">
                    <v-flex shrink class="text-xl-left">
                      <v-text-field
                        v-model="item.boTotal"
                        hide-details="auto"
                        class="ma-0 pa-0 text-xl-left"
                        :value="parseFloat(item.qty).toFixed(2)"
                        color="success"
                        disabled
                        dense
                        prepend-inner-icon="mdi-currency-usd"
                        rounded
                      ></v-text-field>
                    </v-flex>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0">
                    <v-flex shrink class="text-xl-left">
                      <v-text-field
                        v-model="item.pQty"
                        :label="item.defaultUnits"
                        hide-details="auto"
                        class="ma-0 pa-0 text-xl-left"
                        :value="parseFloat(item.qty).toFixed(2)"
                        color="success"
                        dense
                        disabled
                        rounded
                      ></v-text-field>
                    </v-flex>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0">
                    <v-text-field
                      v-model="item.pTotal"
                      hide-details="auto"
                      class="ma-0 pa-0 centered-input"
                      :value="item.totalPrice"
                      color="success"
                      disabled
                      dense
                      prepend-inner-icon="mdi-currency-usd"
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0">
                    <v-text-field
                      v-model="item.unitPrice"
                      hide-details="auto"
                      class="mr-0 pr-0 centered-input"
                      :value="parseFloat(item.actPrice).toFixed(2)"
                      disabled
                      prepend-inner-icon="mdi-currency-usd"
                      dense
                      rounded
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
                  <v-col cols="2" class="mb-0 pb-0"></v-col>
                  <v-col cols="2" class="mb-0 pb-0"></v-col>
                  <v-col cols="2" class="mb-0 pb-0">
                    <v-text-field
                      hide-details="auto"
                      class="ma-0 pa-0 float-right"
                      disabled
                      label
                      :value="parseFloat(pGrTotal).toFixed(2)"
                      prepend-inner-icon="mdi-currency-usd"
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0 float-right"></v-col>
                  <v-col cols="2" class="mb-0 pb-3">
                    <v-text-field
                      hide-details="auto"
                      class="ma-0 pa-0 float-right"
                      disabled
                      label
                      :value="parseFloat(boGrTotal).toFixed(2)"
                      prepend-inner-icon="mdi-currency-usd"
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0"></v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "OrderRecon",
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
      },
      reportRow: {
        id: 0,
        boQty: 0,
        boTotal: 0,
        pQty: 0,
        pTotal: 0,
        unitPrice: 0
      },
      reportData: [],
      pGrTotal: 0,
      boGrTotal: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions([
      "getItemsAction",
      "getOrdersAction",
      "getOrderStatusAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction"
    ]),
    async getData() {
      await this.getOrderStatusAction();
      await this.getOrdersAction();
      await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);

      this.bulkOrders.forEach(bo => {
        if (bo.actQty > 0) {
          let po = this.purchaseOrders.filter(
            po => po.itemId === bo.itemId && parseInt(po.isCancelled) === 0
          );
          let pTotal = 0;
          let pQty = 0;

          po.forEach(p => {
            pTotal += p.actPrice * p.actQty;
            pQty += p.actQty ? parseFloat(p.actQty) : 0;
          });

          this.pGrTotal += pTotal;
          this.boGrTotal += bo.totalPrice ? parseFloat(bo.totalPrice) : 0;

          let item = this.items.find(i => i.id === bo.itemId);

          this.reportData.push({
            itemName: item.name,
            itemId: bo.itemId,
            defaultUnits: item.defaultUnits,
            boQty: bo.actQty,
            boTotal: bo.totalPrice,
            pQty: pQty,
            pTotal: pTotal.toFixed(2),
            unitPrice: bo.actPrice,
            starColor:
              bo.totalPrice === pTotal
                ? "white"
                : pTotal - bo.totalPrice > 0
                ? "green"
                : "red"
          });
        }
      });
      return this.reportData;
    }
  },
  computed: {
    ...mapState(["bulkOrders", "purchaseOrders", "items"]),
    ...mapGetters(["getCurrentOrder"]),
    grandTotal: function() {
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>