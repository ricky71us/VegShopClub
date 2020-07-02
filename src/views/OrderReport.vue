<template>
  <div>
    <v-card class="mx-auto mt-3" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pb-0">
          <v-container class="ma-0 pa-0">
            <v-row>
              <v-col cols="10" class="text-md-center mt-0">Order Summary</v-col>
              <v-col cols="2" class="text-md-center ma-0 pa-0">
                <!-- <v-toolbar-title>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" dense small text>
                        <v-icon v-if="isOrderLocked" @click="toggleOrderLock">mdi-lock</v-icon>
                        <v-icon v-if="!isOrderLocked" @click="toggleOrderLock">mdi-lock-open</v-icon>
                      </v-btn>
                    </template>
                    <span>Order Locked</span>
                  </v-tooltip>
                </v-toolbar-title>-->

                <v-btn v-if="isOrderLocked" @click="toggleOrderLock" text >
                  <v-icon left>mdi-lock-open</v-icon>unlock
                </v-btn>
                <v-btn v-if="!isOrderLocked" @click="toggleOrderLock" text>
                  <v-icon left>mdi-lock</v-icon>lock
                </v-btn>

                <!-- <v-col cols="1" class="mb-2 pl-8">
                  <v-icon >mdi-lock</v-icon>
                  <v-icon
                    @click="toggleOrderLock"
                    v-if="!isOrderLocked"
                    color="green"
                  >mdi-toggle-switch</v-icon>
                  <v-icon
                    @click="toggleOrderLock"
                    v-if="isOrderLocked"
                    color="red"
                  >mdi-toggle-switch-off</v-icon>
                   <v-icon >mdi-lock-open</v-icon>
                </v-col>-->
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-data-table
      :headers="reportHeader"
      :items="reportData"
      hide-default-footer
      :items-per-page="5"
      class="elevation-1 mt-8"
    >
      <template slot="body.append">
        <tr>
          <th v-for="(item, index) in reportTotalRow" :key="index">{{item}}</th>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar id="header-snackbar" v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { dataService } from "../shared";
export default {
  name: "orderReport",
  data() {
    return {
      localUsers: [],
      allItems: [],
      reportData: [],
      reportHeader: [],
      reportRow: [],
      reportTotalRow: [],
      itemQty: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      isOrderLocked: false
    };
  },
  async created() {
    await this.setOrderLock();
  },
  mounted() {
    this.getQtyByItem();
    this.getData();
  },
  methods: {
    ...mapActions(["getPurchaseOrderByOrderIdAction", "updateOrderAction"]),
    getQtyByItem() {
      this.itemQty = [];
      this.purchaseOrders.forEach(i => {
        if (parseInt(i.isCancelled) === 0) {
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
    setOrderLock: function() {
      this.isOrderLocked =
        parseInt(this.getCurrentOrder.isLocked) === 1 ? true : false;
    },
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    async toggleOrderLock() {
      console.log(this.isOrderLocked);
      this.isOrderLocked = parseInt(this.isOrderLocked) === 1 ? 0 : 1;
      await this.updateOrderAction({
        id: this.getCurrentOrder.id,
        orderDt: this.getCurrentOrder.orderDt,
        cutOffDt: null,
        orderStatus: this.getCurrentOrder.orderStatus,
        isLocked: this.isOrderLocked
      });
      if (parseInt(this.isOrderLocked) === 1)
        this.snackMessage("This order is now closed for changes!");
      else if (parseInt(this.isOrderLocked) === 0)
        this.snackMessage("This order is Unlocked!");
    },
    //  isOrderLocked: {
    //   get() {
    //     return this.$store.state.isOrderLocked;
    //   },
    //   set(value) {
    //     this.$store.commit("toggleOrderLocked", value);
    //   }
    // },
    async getData() {
      await this.getUsers();
      this.bulkOrders.forEach(bo => {
        if (bo.actQty > 0) {
          let item = this.items.find(i => i.id === bo.itemId);
          this.allItems.push({ id: bo.itemId, name: item.name });
        }
      });

      this.allItems.forEach(ai => {
        let item = this.items.find(i => i.id === ai.id);
        if (item) {
          this.reportHeader.push({ text: item.name, value: "i_" + item.id });
        }
      });

      this.reportHeader.unshift({
        text: "Buyer",
        value: "userName",
        sortable: false,
        align: "start"
      });

      this.localUsers.forEach(u => {
        // clear report Row
        this.reportRow = [];
        this.reportTotalRow = [];
        this.reportRow = { userName: `${u.firstname} ${u.lastname} ` };

        this.purchaseOrders.forEach(po => {
          if (po.userId === u.id && parseInt(po.isCancelled) === 0) {
            this.reportRow["i_" + po.itemId] = po.qty;
          }
        });

        this.reportData.push(this.reportRow);
      });

      this.allItems.forEach(i => {
        let tot = this.itemQty.find(iq => iq.itemId === i.id);
        if (tot) this.reportTotalRow.push(tot.qty);
        else this.reportTotalRow.push("");
      });

      this.reportTotalRow.unshift("Total");
    },
    async getUsers() {
      await dataService.getAllUsers().then(response => {
        this.localUsers = response;
      });
    }
  },
  computed: {
    ...mapState(["purchaseOrders", "bulkOrders", "items"]),
    ...mapGetters(["getCurrentOrder"])
  }
};
</script>

<style lang="scss" scoped>
</style>