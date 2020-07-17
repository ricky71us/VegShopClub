<template>
  <div>
    <v-form v-if="pageLoaded && parseInt(this.getCurrentOrder.isLocked) === 1" v-model="valid">
      <v-divider></v-divider>
      <v-card class="mx-auto mt-5" max-width="1100" dense color="orange" rounded>
        <v-list-item dense>
          <v-list-item-content dens class="ma-0 pa-0">
            <v-container class="ma-0 pa-0">
              <v-row>
                <v-col cols="12" class="text-md-center hidden-sm-and-down">Bulkorder Invoice</v-col>
                <v-col cols="12" class="text-sm-center hidden-md-and-up">Bulkorder Invoice</v-col>
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
                <v-col cols="4" class="hidden-md-and-up" style="font-size:12px">Item</v-col>
                <v-col cols="4" class="hidden-sm-and-down">Item</v-col>
                <v-col class="text-md-center hidden-sm-and-down" cols="2">Ordered Qty</v-col>
                <v-col
                  class="text-md-center hidden-md-and-up"
                  style="font-size:12px"
                  cols="2"
                >Ord Qty</v-col>
                <v-col
                  class="text-md-center hidden-md-and-up"
                  style="font-size:12px"
                  cols="3"
                >Act Qty</v-col>
                <v-col class="text-md-center hidden-sm-and-down" cols="3">Act Qty</v-col>
                <v-col class="text-md-center hidden-sm-and-down" cols="3">Total</v-col>
                <v-col
                  class="text-md-center hidden-md-and-up"
                  style="font-size:12px"
                  cols="3"
                >Total($)</v-col>
                <!-- <v-col cols="2">Unit Price</v-col> -->
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
                <v-col class="mt-2 hidden-md-and-up" style="font-size:12px">
                  <div class="tooltip">
                    {{item.name.length > 15 ? item.name.substring(0,15) + '...' : item.name}}
                    <span class="tooltiptext">{{item.name}}</span>
                  </div>
                </v-col>
                <v-col class="mt-2 hidden-sm-and-down">{{item.name}}</v-col>
                <v-col
                  cols="2"
                  class="mt-2 pb-0 text-md-center hidden-md-and-up"
                  style="font-size:12px"
                >{{item.qty}} {{item.defaultUnits}}</v-col>
                <v-col
                  cols="2"
                  class="mt-2 pb-0 text-md-center hidden-sm-and-down"
                >{{item.qty}} {{item.defaultUnits}}</v-col>
                <v-col cols="3" class="mb-0 pb-2 hidden-sm-and-down">
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
                    onclick="this.select();"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mb-0 pb-2 hidden-md-and-up">
                  <v-text-field
                    v-model="item.actQty"
                    :label="item.defaultUnits"
                    hide-details="auto"
                    class="ma-0 pa-0 text-xl-left"
                    :value="parseInt(item.qty).toFixed(2)"
                    @change="calcItemPrice(item)"
                    color="success"
                    background-color="grey"
                    height="26"
                    single-line
                    onclick="this.select();"
                    style="font-size:14px"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mb-0 pb-0 hidden-sm-and-down">
                  <v-text-field
                    v-model="item.totalPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="parseInt(item.totalPrice).toFixed(2)"
                    label
                    @change="calcItemPrice(item)"
                    height="26"
                    prefix="$"
                    dense
                    outlined
                    onclick="this.select();"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mb-0 pb-0 hidden-md-and-up">
                  <v-text-field
                    v-model="item.totalPrice"
                    hide-details="auto"
                    class="ma-0 pa-0 centered-input"
                    :value="parseInt(item.totalPrice).toFixed(2)"
                    label
                    @change="calcItemPrice(item)"
                    height="26"
                    background-color="grey"
                    single-line
                    onclick="this.select();"
                    style="font-size:14px"
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
                <v-col cols="12" style="font-weight:bold; text-align:right;">Total - ${{grandTotal}}</v-col>
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
    <v-form v-if="parseInt(this.getCurrentOrder.isLocked) === 0" v-model="valid">
      <v-card class="mx-auto mt-4" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">Order is Not Locked</v-list-item-title>
            <v-list-item-subtitle>Please lock the order from Order Summary page before accessing this page.</v-list-item-subtitle>
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
      },
      pageLoaded: false
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
        if (parseFloat(i.isCancelled) === 0) {
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
          actPriceFinal: parseFloat(lp.actPriceFinal),
          totalPrice: parseFloat(lp.totalPrice),
          isCancelled: lp.isCancelled
        };
        this.updateBulkOrderAction(this.tempBO);
      });

      let wait = time => new Promise(resolve => setTimeout(resolve, time));
      await wait(1000);
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
          ) {
            let itemqty = this.itemQty.find(iq => iq.itemId === item.itemId);
            this.localItems.push({
              id: item.id,
              itemId: item.itemId,
              name: this.getItemById(item.itemId).name,
              defaultUnits: this.getItemById(item.itemId).defaultUnits,
              orderId: item.orderId,
              qty: itemqty ? itemqty.qty : 0,
              actQty: item.actQty > 0 ? parseFloat(item.actQty) : null,
              totalPrice:
                item.totalPrice > 0 ? parseFloat(item.totalPrice) : null,
              isCancelled: item.isCancelled,
              actPrice:
                item.actQty > 0
                  ? (
                      parseFloat(item.totalPrice) / parseFloat(item.actQty)
                    ).toFixed(4)
                  : 0,
              actPriceFinal: parseFloat(item.actPriceFinal).toFixed(2)
            });
          }
        }
      });
      this.pageLoaded = true;
      this.localItems.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
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
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  //border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: -5%;
  left: 155%;
  margin-left: -60px;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.6s;
}

/* Tooltip arrow */
// .tooltip .tooltiptext::after {
//   content: "";
//   position: absolute;
//   top: 100%;
//   left: 50%;
//   margin-left: -5px;
//   border-width: 5px;
//   border-style: solid;
//   border-color: #555 transparent transparent transparent;
// }

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>