<template>
  <div>
    <div>
      <v-list-item v-for="item in this.localItems" :key="item.id">
        <v-row>
          <v-col cols="4">
            <label class="mx-auto" label="true" large="true">{{item.name}}</label>
          </v-col>
          <v-col cols="4">
            <v-text-field label="Quantity" v-model="item.minQty"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field label="Amount" v-model="item.price" prefix="$"></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <label>Total</label>
          </v-col>
          <v-col cols="4">
            <v-chip rounded>{{this.totalAmount}}</v-chip>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col cols="5"></v-col>
          <v-col cols="2">
            <v-btn class="mx-12" color="info">Place Order</v-btn>
          </v-col>
          <v-col cols="5"></v-col>
        </v-row>
      </v-list-item>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "purchaseOrder",
  data: () => ({ 
  }),  
  methods: {
    ...mapActions([""])
  },
  computed: {
    ...mapState(["items"]),
    totalAmount: function() {
      console.log(this.items);
      var total = 0;
      this.items.forEach(element => {
        total += parseInt(element.price);
      });
      return total;
    },
    //localItems: this.items.slice(),
  }
};
</script>

<style lang="scss" scoped>
</style>