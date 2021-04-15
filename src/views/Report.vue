<template>
  <v-card class="mt-12 mx-auto" max-width="1600">
    <v-autocomplete
      v-model="selectedItem"
      item-value="id"
      class="ma-3 pt-6"
      item-text="name"
      :items="sortedItems"
      label="Items"
      @change="OnItemChange"
      required
    ></v-autocomplete>
    <v-lazy
      :options="{
        threshold: 0.5,
      }"
      min-height="200"
      transition="fab-transition"
    >
      <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
        <BaseLineChart
          :key="componentKey"
          v-if="chartLoaded"
          v-bind:c-labels="[...chartData.labels]"
          v-bind:c-values="[...chartData.value]"
          v-bind:c-header="chartData.chartHeader[0]"
          v-bind:c-labels1="[...chartData2.labels]"
          v-bind:c-values1="[...chartData2.value]"
          v-bind:c-header1="chartData2.chartHeader[0]"
        />
      </v-card>
    </v-lazy>

    <v-divider inset></v-divider>
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
          text: "Id",
          align: "start",
          //sortable: false,
          value: "OrderId",
        },
        {
          text: "Packer",
          align: "start",
          //sortable: false,
          value: "Packer",
        },
        {
          text: "Date",
          align: "start",
          //sortable: false,
          value: "OrderDate",
        },
      ],
      itemPrice: [],
      reportRow: [],
      isMobile: false,
      sortedItems: [],
      selectedItem: null,
      chartData: { labels: [], value: [], chartHeader: [] },
      chartData1: { labels: [], value: [], chartHeader: [] },
      chartData2: { labels: [], value: [], chartHeader: [] },
      chartLoaded: false,
      componentKey: 0,
    };
  },
  async created() {
    await this.getSortedItems();
    await this.getItemPrice();
  },
  mounted() {},
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

      this.sortedItems.forEach((i) => {
        if (i.isActive === "1") {
          this.headers.push({
            text: i.name + " (" + i.defaultUnits + ")",
            value: i.id,
            align: "center",
          });
        }
      });

      await dataService.getOrders().then((response) => {
        response.forEach((o) => {
          dataService.getPriceByOrder(o.id).then((response) => {
            //onsole.log(o)
            this.reportRow["OrderId"] = o.id; //`${response[0].username} (${o.orderDt})`;
            this.reportRow["OrderDate"] = o.orderDt;
            if (response && response.length > 0)
              response.forEach((u) => {
                this.reportRow["Packer"] = u.username;
                this.reportRow[u.id] = `$${parseFloat(u.actPriceFinal).toFixed(
                  2
                )}`;
              });
            this.itemPrice.push(this.reportRow);
            this.reportRow = {};
          });
        });
      });
    },
    getSortedItems() {
      this.sortedItems = this.items
        .filter((i) => parseInt(i.isActive) === 1)
        .sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
    },
    OnItemChange() {
      this.getSortedItems();
      this.chartData = { labels: [], value: [], chartHeader: [] };

      let currItem = this.items.find((i) => i.id === this.selectedItem);

      dataService.getItemPriceHistory(currItem.id).then((response) => {
        response.forEach((uo) => {
          this.chartData.value.push(
            `${parseFloat(uo.actPriceFinal).toFixed(2)}`
          );
          this.chartData.labels.push(uo.orderdt);
          this.chartData.chartHeader.push([
           // `${currItem.name} Price `,
           "Price",
            "#B2DFDB",
          ]);

          this.chartData1.value.push(`${parseFloat(uo.actQty).toFixed(2)}`);
          this.chartData1.labels.push(uo.orderdt);
          this.chartData1.chartHeader.push([
            //`${currItem.name} Qty `,
            "Quantity",
            "#546E7A",
          ]);
        });
        this.chartLoaded = true;
        this.componentKey += 1;
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