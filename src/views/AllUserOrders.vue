<template>
  <div>
    <v-expansion-panels focusable>
      <v-expansion-panel v-for="item in localUsers" :key="item.id">
        <v-expansion-panel-header @click="getUserPo(item.id)">{{item.firstname}} {{item.lastname}}</v-expansion-panel-header>
        <v-expansion-panel-content>
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
                      <v-col cols="2">Act Price</v-col>
                      <v-col cols="2">Total</v-col>
                    </v-row>
                  </v-container>
                </v-list-item-content>
              </v-list-item>
            </v-card>
            <v-card class="mx-auto mt-7" max-width="900" tile dense>
              <v-list-item v-for="item in localUserPo" :key="item.id" dense>
                <v-list-item-content dens class="ma-0 pa-0">
                  <v-container class="ma-0 pa-0">
                    <v-row class="ma-0 pa-0">
                      <v-col cols="4" class="mb-0 pb-0">
                        <v-text-field
                          v-model="item.itemName"
                          hide-details="auto"
                          class="ma-0 pa-0 text-xl-left"
                          :value="item.itemName"
                          color="success"
                          disabled
                          label
                          dense
                          rounded
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" class="mb-2 pb-0">
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
                            rounded
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
                            rounded
                          ></v-text-field>
                        </v-flex>
                      </v-col>
                      <v-col cols="2" class="pb-0 ma-0">
                        <v-flex shrink class="text-xl-left">
                          <v-text-field
                            v-model="item.actPrice"
                            hide-details="auto"
                            class="ma-0 pa-0 float-right"
                            :value="parseFloat(item.actPrice).toFixed(2)"
                            @change="calcItemPrice(item)"
                            color="success"
                            prepend-inner-icon="mdi-currency-usd"
                            dense
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
                      <v-col cols="2" class="mb-0 pb-0">Total</v-col>
                      <v-col cols="2" class="mb-0 pb-3">
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
                          @click="savePo()"
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
      }
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
    getUsers() {
      dataService.getAllUsers().then(response => (this.localUsers = response));
    },
    calcItemPrice: function(item) {
      item.totalPrice = (
        parseFloat(item.actPrice) * parseFloat(item.actQty)
      ).toFixed(2);
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
          isCancelled: lp.isCancelled
        };
        this.updatePurchaseOrderAction(this.tempPO);
        //console.log(this.tempPO);
      });
      this.snackMessage(`Updated Data!`);
    },

    getUserPo(id) {
      this.localUserPo = [];
      let pos = this.purchaseOrders.filter(
        po =>
          parseInt(po.userId) === parseInt(id) && parseInt(po.isCancelled) === 0
      );

      pos.forEach(lp => {
        let item = this.getActiveItems.find(i => i.id === lp.itemId);
        if (item)
          this.localUserPo.push({
            id: lp.id,
            orderId: lp.orderId,
            itemId: lp.itemId,
            userId: lp.userId,
            qty: lp.qty,
            actQty: lp.actQty,
            actPrice: lp.actPrice,
            isCancelled: lp.isCancelled,
            itemName: item.name,
            defaultUnits: item.defaultUnits,
            totalPrice: (
              (lp.actPrice ? parseFloat(lp.actPrice) : 0) *
              (lp.actQty ? parseFloat(lp.actQty) : 0)
            ).toFixed(2)
          });
      });
    }
  },

  computed: {
    ...mapState(["purchaseOrders", "items"]),
    ...mapGetters(["getCurrentOrder", "getActiveItems"]),
    grandTotal: function() {
      var total = 0;

      this.localUserPo.forEach(item => {
        if (item) total += parseFloat(item.totalPrice);
      });

      return total.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>