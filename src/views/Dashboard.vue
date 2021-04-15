<template>
  <v-card class="mt-12 mx-auto" max-width="1800">
    <v-layout v-resize="onResize" class="mt-2" column style="padding-top: 7px">
      <v-data-table
        :headers="headers"
        :items="itemPrice"
        hide-default-footer
        :items-per-page="100"
        class="elevation-1 mt-8; text-align:right; pa-0"
        :hide-default-header="false"
        :class="{ mobile: isMobile }"
        :mobile="isMobile"
        :disable-sort="isMobile"
        :disable-filtering="isMobile"
        :disable-pagination="isMobile"
      >
      </v-data-table>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { dataService } from "../shared";
export default {
  data() {
    return {
      headers: [
        {
          text: "Item Name",
          align: "start",
          //sortable: false,
          value: "itemName",
        },
      ],
      itemPrice: [],
      reportRow: [],
      isMobile: false,
    };
  },
  created() {
    this.getItemPrice();
  },
  mounted() {
    //console.log(this.itemPrice);
  },
  onResize() {
    if (parseInt(window.innerWidth) < 769) this.isMobile = true;
    else this.isMobile = false;
  },
  methods: {
    ...mapActions(["getItemsAction"]),
    onResize() {
      if (parseInt(window.innerWidth) < 769) this.isMobile = true;
      else this.isMobile = false;
    },
    async getItemPrice() {
      this.reportRow = {};

      await dataService.getOrders().then((response) => {
       
        response.forEach((o) => {
          
          this.headers.push({ text: o.orderDt, value: o.id, align: "center" });
        });
      });

      this.items.forEach((i) => {
        if (i.isActive === "1") {
          dataService.getItemPrice(i.id).then((response) => {
            this.reportRow["itemName"] = i.name + " (" + i.defaultUnits + ")";
            if (response && response.length > 0)
              response.forEach((u) => {
                this.reportRow[u.orderid] = `$ ${parseFloat(
                  u.actPriceFinal
                ).toFixed(2)}`;
              });
            this.itemPrice.push(this.reportRow);
            this.reportRow = {};
          });
        }
      });
    },
  },
  computed: {
    ...mapState(["items"]),
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>