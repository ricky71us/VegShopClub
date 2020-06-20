<template>
  <div>

     

    <v-container>

      <v-card class="mx-auto float-center" max-width="644">
        <!-- <v-btn class="success align-right" rounded @click="createNewOrder()">New Order</v-btn> -->       

        <v-list-item two-line>
          <v-list-item-content>
                <div class="overline mb-4">Current Order</div>
            <v-list-item-title class="headline mb-1">Order Id: {{curActiveOrder.id}}</v-list-item-title>
            <v-list-item-subtitle>Order Date: {{curActiveOrder.orderDt}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
      <v-btn class="green" >Details</v-btn>
      
    </v-card-actions>
      </v-card>

 <v-expansion-panels class="mb-6 pa-6">
         <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Previous Orders
          <template v-slot:actions>
            <v-icon color="red">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
      
          <div v-for="order in orders" :key="order.id">
          <v-card class="mx-auto" max-width="1044" rounded >
            <v-list-item single-line>
              <v-list-item-content class="ma-0 pa-0">
                <div class="overline mb-4">ORDER No</div>                
                <v-row>
                  <v-col cols="4">{{order.id}}</v-col>
                  <v-col class="float-right" cols="4">{{order.orderDt}}</v-col>
                  <!-- <v-col class="ma-0 pa-0 float-right">
                    <v-icon
                      color="success"
                      v-if="getOrderStatus(order.orderStatus).status === 'Active'"
                    >mdi-check</v-icon>
                    <v-icon
                      color="red"
                      v-if="getOrderStatus(order.orderStatus).status === 'Complete'"
                    >mdi-close</v-icon>
                  </v-col> -->
                  <v-col cols="4"><v-btn class="yellow float-right">Details</v-btn></v-col>
                </v-row>                
              </v-list-item-content>              
            </v-list-item>           
          </v-card>
        </div>      
        </v-expansion-panel-content>
      </v-expansion-panel>
       </v-expansion-panels>

      
    </v-container>


  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "Orders",
  data() {
    return {
      order: "",
      curActiveOrder: ""
    };
  },
  mounted() {
    this.getOrderStatusAction();
    this.getOrdersAction();
    this.curActiveOrder = this.getCurrentOrder;
  },
  methods: {
    ...mapActions([
      "addOrderAction",
      "getOrdersAction",
      "getOrderStatusAction"
    ]),
    getTodaysDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + "/" + dd + "/" + yyyy;
      return today;
    },
    createNewOrder() {
      this.addOrderAction({
        orderDt: new Date().toJSON(),
        orderStatus: this.getActiveOrderStatus.id
      });
    },
    getOrderStatus(id) {
      if (id > 0) return this.orderstatus.find(os => os.id === id);
      return { status: "none" };
    }
  },
  computed: {
    ...mapState(["orders", "orderstatus"]),
    ...mapGetters(["getActiveOrderStatus", "getCurrentOrder"])
  }
};
</script>

<style lang="scss" scoped>
</style>