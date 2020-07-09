<template>
  <div v-if="pageLoaded">
    <v-card class="mx-auto mt-12" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="12" class="text-md-center">Reconcile Order</v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <!-- <v-card class="mx-auto ma-3" max-width="1100" > -->
      <!-- <v-form ref="form" v-model="valid"> -->
        <v-card class="mx-auto mt-3" max-width="1100" color="#B0BEC5">
          <v-list-item >
            <v-list-item-content dens class="ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row>
                  <v-col style="background:#78909C;color:white" cols="4"></v-col>
                  <v-col
                    style="background:#8D6E63;color:white"
                    class="text-md-center"
                    cols="4"
                  >Bulkorder Invoice</v-col>
                  <v-col
                    style="background:#4DB6AC;color:white"
                    class="text-md-center"
                    cols="4"
                  >Packed Order</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>                  
                  <v-col class="text-md-center" style="background:#B0BEC5;color:white" cols="4">Items</v-col>
                  <v-col class="text-md-center" style="background:#BCAAA4;color:white" cols="2">Qty</v-col>
                  <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-sm-and-down">Unit Price</v-col>
                  <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-md-and-up">$</v-col>
                  <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-sm-and-down">Total</v-col>
                  <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-md-and-up">$ </v-col>
                  <v-col class="text-md-center" style="background:#B2DFDB;color:white" cols="2">Qty</v-col>
                  <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-sm-and-down">Unit Price</v-col>
                  <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-md-and-up">$</v-col>                  
                  <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-sm-and-down">Total</v-col>
                  <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-md-and-up">$</v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto mt-1" max-width="1100">
          <v-list-item v-for="item in reportData" :key="item.itemId" dense>
            <v-list-item-content dens class="ma-0 pa-0">
              <v-container class="ma-0 pa-0">
                <v-row class="ma-0 pa-0">
                  <v-col cols="4" class="mt-3">
                    <div v-if="item.starColor === 'red'" style="color:red">{{item.itemName}}</div>
                    <div v-if="item.starColor === 'green'" style="color:green" >{{item.itemName}}</div>
                    <div v-if="item.starColor === 'white'" style="color:black" >{{item.itemName}}</div>
                     <!-- <div v-if="item.starColor === 'white'" style="color:blue" >{{item.itemName}}</div><div >{{item.itemName}}</div> -->
                    <!-- <v-badge :color="item.starColor" icon="mdi-star"  class="ma-0 pa-0" > 
                    </v-badge>-->
                    <!-- <v-flex shrink class="text-xl-left"> -->
                    <!-- <strong>
                        <v-text-field
                          v-model="item.itemName"
                          hide-details="auto"
                          class="ma-0 pa-0"
                          :value="item.itemName"
                          dense
                          :color="item.starColor"
                          label
                          disabled                          
                          full-width
                        ></v-text-field>
                    </strong>-->
                    <!-- </v-flex> -->

                    <!-- <v-icon small class="ma-0 pa-0" :color="item.starColor">mdi-star</v-icon>
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
                    </v-flex>-->
                  </v-col>
                  <v-col cols="2" class="text-md-right">
                    {{item.boQty}} {{item.defaultUnits}}
                    <!-- <v-flex shrink class="text-xl-left">
                      <strong>
                        <v-text-field
                          v-model="item.boQty"
                          :label="item.defaultUnits"
                          hide-details="auto"
                          class="mt- pa-0 text-xl-left"
                          :value="item.boQty"
                          color="success"
                          dense
                          disabled
                        ></v-text-field>
                      </strong>
                    </v-flex> -->
                  </v-col>
                  <v-col cols="1" class="mb-0 pb-0 text-md-right">
                    $ {{parseFloat(item.unitPrice).toFixed(2)}}
                    <!-- <v-flex shrink class="text-xl-left">
                      <strong>
                        <v-text-field
                          v-model="item.unitPrice"
                          hide-details="auto"
                          class="ma-0 pa-0 text-xl-left"
                          :value="parseFloat(item.unitPrice).toFixed(2)"
                          color="success"
                          disabled
                          dense
                          prefix="$"
                        ></v-text-field>
                      </strong>
                    </v-flex> -->
                  </v-col>
                  <v-col cols="1" class="mb-0 pb-0 text-md-right">
                    $ {{item.boTotal}}
                    <!-- <v-flex shrink class="text-xl-left">
                      <strong>
                        <v-text-field
                          v-model="item.boTotal"
                          hide-details="auto"
                          class="ma-0 pa-0 text-xl-left"
                          :value="parseFloat(item.qty).toFixed(2)"
                          color="success"
                          disabled
                          dense
                          prefix="$"
                        ></v-text-field>
                      </strong>
                    </v-flex> -->
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0 text-md-right">
                    {{item.pQty}} {{item.defaultUnits}}
                    <!-- <v-flex shrink class="text-xl-left">
                      <strong>
                        <v-text-field
                          v-model="item.pQty"
                          :label="item.defaultUnits"
                          hide-details="auto"
                          class="ma-0 pa-0 text-xl-left"
                          :value="parseFloat(item.qty).toFixed(2)"
                          color="success"
                          dense
                          disabled
                        ></v-text-field>
                      </strong>
                    </v-flex> -->
                  </v-col>
                  <v-col cols="1" class="mb-0 pb-0 text-md-right">
                    $ {{parseFloat(item.unitPriceFinal).toFixed(2)}} 
                    <!-- <strong>
                      <v-text-field
                        v-model="item.unitPriceFinal"
                        hide-details="auto"
                        class="mr-0 pr-0 centered-input"
                        :value="parseFloat(item.actPriceFinal).toFixed(2)"
                        disabled
                        prefix="$"
                        dense
                      ></v-text-field>
                    </strong> -->
                  </v-col>
                  <v-col cols="1"  class="mb-0 pb-0 text-md-right">
                    $ {{item.pTotal}}
                    <!-- <strong>
                      <v-text-field                      
                        v-model="item.pTotal"
                        hide-details="auto"
                        class="ma-0 pa-0 centered-input"
                        :value="item.totalPrice"
                        color="success"
                        disabled
                        dense
                        prefix="$"
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
                  <v-col cols="7" class="mb-0 pb-0"></v-col>
                  <v-col cols="2" class="mb-0 pb-0 float-right" style="font-weight:bold">
                    $ {{parseFloat(boGrTotal).toFixed(2)}}
                    <!-- <strong>
                      <v-text-field
                        hide-details="auto"
                        class="ma-0 pa-0 float-right"
                        disabled
                        label
                        :value="parseFloat(pGrTotal).toFixed(2)"
                        prefix="$"
                      ></v-text-field>
                    </strong> -->
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0 float-right"></v-col>
                  <v-col cols="1" class="mb-0 pb-3" style="font-weight:bold" >
                    ${{parseFloat(pGrTotal).toFixed(2)}}                    
                    <!-- <strong>
                      <v-text-field
                        hide-details="auto"
                        class="ma-0 pa-0 float-right"
                        disabled
                        label
                        :value="parseFloat(boGrTotal).toFixed(2)"
                        prefix="$"
                      ></v-text-field>
                    </strong> -->
                  </v-col>
                  <v-col cols="2" class="mb-0 pb-0"></v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      <!-- </v-form> -->
    <!-- </v-card> -->
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
      boGrTotal: 0,
      pageLoaded: false
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
            pTotal += bo.actPriceFinal * p.actQty;
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
            pQty: pQty.toFixed(2),
            pTotal: pTotal.toFixed(2),
            unitPrice: bo.actPrice.toString(),
            unitPriceFinal: bo.actPriceFinal.toString(),
            starColor:
              parseFloat(bo.totalPrice) === parseFloat(pTotal)
                ? "white"
                : parseFloat(pTotal) - parseFloat(bo.totalPrice) > 0
                ? "green"
                : "red"
          });
        }
      });
      this.reportData.sort(function(a, b) {
        if (a.itemName < b.itemName) {
          return -1;
        }
        if (a.itemName > b.itemName) {
          return 1;
        }
        return 0;
      });
      this.pageLoaded = "true";
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