<template>
  <div>
    <v-card class="mx-auto ma-3" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="5"></v-col>
              <v-col cols="6">Package Order By Items</v-col>
              <v-col cols="1"></v-col>
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
                        <v-col cols="3"></v-col>

                        <v-col cols="2"></v-col>
                        <v-col cols="2"></v-col>
                        <v-col cols="1"></v-col>
                        <v-col cols="2">Total Qty</v-col>
                        <v-col cols="2">{{item.actQty}}</v-col>
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
                        <v-col cols="2">Orderd Qty</v-col>
                        <v-col cols="2">Suggested Qty</v-col>
                        <v-col cols="2">Act Qty</v-col>
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
                          <v-text-field
                            v-model="itempo.buyer"
                            hide-details="auto"
                            class="ma-0 pa-0 text-xl-left"
                            :value="item.buyer"
                            color="success"
                            disabled
                            label
                            dense
                          ></v-text-field>
                        </v-col>

                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="itempo.qty"
                              :label="itempo.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseInt(itempo.qty).toFixed(2)"
                              disabled
                              color="success"
                              dense
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mt-4 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="itempo.suggestedQty"
                              :label="itempo.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(itempo.actQty).toFixed(2)"
                              color="success"
                              dense
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="2" class="mb-2 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="itempo.actQty"
                              :label="itempo.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-xl-left"
                              :value="parseFloat(itempo.actQty).toFixed(2)"
                              @change="calcItemPrice(itempo)"
                              color="success"
                              dense
                              outlined
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <v-col cols="1" class="mb-2 pl-8">
                          <v-icon
                            @click="itemPacked(itempo, item)"
                            v-if="parseInt(itempo.isPacked) === 1"
                            color="green"
                          >mdi-toggle-switch</v-icon>
                          <v-icon
                            @click="itemPacked(itempo, item)"
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
                        <v-col cols="1" class="ml-0 pb-0">
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
                        <v-col cols="3" class="mb-0 pb-0"></v-col>
                        <v-col cols="4" class="mb-0 pb-0"></v-col>
                        <v-col cols="4" class="mb-0 pb-3">
                          <v-btn
                            color="success"
                            @click="savePo()"
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
      multiLine: true
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
      "updatePurchaseOrderAction"
    ]),
    async getItems() {
      await this.bulkOrders.forEach(bo => {
        bo.orderId === this.getCurrentOrder.id;
        var item = this.items.find(
          it => parseInt(it.id) === parseInt(bo.itemId)
        );
        if (item) {
          this.ordItems.push({
            itemId: item.id,
            itemName: item.name,
            actQty: bo.actQty,
            actPrice: bo.actPrice,
            totalPrice: bo.totalPrice,
            defaultUnits: item.defaultUnits
          });
        }
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
            actQty: lp.actQty > 0 ? lp.actQty : null,
            suggestedQty: lp.suggestedQty,
            actPrice: item.actPrice,
            isCancelled: lp.isCancelled,
            isPacked: lp.isPacked,
            itemName: item.name,
            defaultUnits: item.defaultUnits,
            totalPrice: (
              (item.actPrice ? parseFloat(item.actPrice) : 0) *
              (lp.actQty ? parseFloat(lp.actQty) : 0)
            ).toFixed(2)
          });
        }
      });
    },
    savePo() {
      this.localItemPo.forEach(lp => {
        this.tempPO = {
          id: lp.id,
          orderId: lp.orderId,
          itemId: lp.itemId,
          userId: lp.userId,
          qty: lp.qty,
          actQty: parseFloat(lp.actQty),
          actPrice: parseFloat(lp.actPrice),
          isCancelled: lp.isCancelled,
          isPacked: lp.isPacked
        };
        this.updatePurchaseOrderAction(this.tempPO);
      });
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
    calcItemPrice: function(item) {
      item.totalPrice = (
        parseFloat(item.actPrice) * parseFloat(item.actQty)
      ).toFixed(2);
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    getUserName: function(userId) {
      return this.localUsers.find(u => parseInt(u.id) === parseInt(userId));
    },
    async itemPacked(itempo, item) {
      if (itempo.actQty) {
        let flag = parseInt(itempo.isPacked) === 1 ? 0 : 1;
        await this.updatePurchaseOrderAction({
          id: itempo.id,
          orderId: itempo.orderId,
          itemId: itempo.itemId,
          userId: itempo.userId,
          qty: itempo.qty,
          actQty: itempo.actQty,
          suggestedQty: itempo.suggestedQty,
          actPrice: itempo.actPrice,
          isCancelled: itempo.isCancelled,
          isPacked: flag
        });
        this.getItemPo(itempo);
        if (flag)
          this.snackMessage(`${item.itemName} packed for ${itempo.buyer}!`);
        else
          this.snackMessage(`${item.itemName} not packed for ${itempo.buyer}!`);
      } else
        this.snackMessage(
          `Please enter a value in Actual Quantity before setting this flag`
        );
    }
  },
  computed: {
    ...mapState(["bulkOrders", "items", "purchaseOrders"]),
    ...mapGetters(["getCurrentOrder"]),
    grandTotal: function() {
      var total = 0;
      this.localItemPo.forEach(item => {
        if (item) {
          if (parseInt(item.isPacked)) total += parseFloat(item.totalPrice);
        }
      });

      return total.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>