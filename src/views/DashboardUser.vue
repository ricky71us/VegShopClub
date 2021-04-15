<template >
  <v-card class="mt-12">   
    <v-card class="mx-auto" max-width="544">
      <v-card-text class="mt-12 mx-auto">
        <p class="display-1 text--primary">
          {{ this.user.firstname }}
        </p>
        <v-row dense>
          <v-col :key="4" :cols="6">
            <p>
              No of Orders Placed ({{ curYear }}):
              <b>{{ totalNumberOfOrdersPlacedc }}</b>
            </p>
            <div class="text--primary">
              <p>
                Total Amount:
                <b>$ {{ parseFloat(totalAmountSpentTillDatec).toFixed(2) }}</b>
              </p>
            </div>
          </v-col>
          <v-col :key="5" :cols="6">
            <p>
              No of Orders Placed ({{ prevYear }}):
              <b>{{ totalNumberOfOrdersPlacedp }}</b>
            </p>
            <div class="text--primary">
              <p>
                Total Amount:
                <b>$ {{ parseFloat(totalAmountSpentTillDatep).toFixed(2) }}</b>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-container fluid>
      <v-row dense>
        <v-col :key="0" :cols="6">
          <v-lazy
            :options="{
              threshold: 0.1,
            }"
            min-height="200"
            transition="fab-transition"
          >
            <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
              <BasePieChart
                v-if="chartLoaded"
                v-bind:c-labels="[...chartDatac.labels]"
                v-bind:c-values="[...chartDatac.value]"
                v-bind:c-header="chartHeaderc[0]"
              />
            </v-card>
          </v-lazy>
        </v-col>
        <v-col :key="1" :cols="6">
          <v-lazy
            :options="{
              threshold: 0.1,
            }"
            min-height="200"
            transition="fab-transition"
          >
            <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
              <BaseBarChart
                v-if="chartLoaded"
                v-bind:c-labels="[...chartDatap.labels]"
                v-bind:c-values="[...chartDatap.value]"
                v-bind:c-header="chartHeaderp[0]"
              />
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
      <v-row>
        <v-col :key="2" :cols="6">
          <v-lazy
            :options="{
              threshold: 0.5,
            }"
            min-height="200"
            transition="fab-transition"
          >
            <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
              <BaseDoughnutChart
                v-if="chartLoaded"
                v-bind:c-labels="[...chartData1c.labels]"
                v-bind:c-values="[...chartData1c.value]"
                v-bind:c-header="chartHeaderc[1]"
              />
            </v-card>
          </v-lazy>
        </v-col>
        <v-col :key="3" :cols="6">
          <v-lazy
            :options="{
              threshold: 0.5,
            }"
            min-height="200"
            transition="fab-transition"
          >
            <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
              <BaseLineChart
                v-if="chartLoaded"
                v-bind:c-labels="[...chartData1p.labels]"
                v-bind:c-values="[...chartData1p.value]"
                v-bind:c-header="chartHeaderp[1]"
              />
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </v-container>
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
      chartDatac: { labels: [], value: [] },
      chartDatap: { labels: [], value: [] },
      chartData1c: { labels: [], value: [] },
      chartData1p: { labels: [], value: [] },
      chartHeaderc: [],
      chartHeaderp: [],
      chartLoaded: false,
      totalAmountSpentTillDatec: 0,
      totalAmountSpentTillDatep: 0,
      totalNumberOfOrdersPlacedc: 0,
      totalNumberOfOrdersPlacedp: 0,
      curYear: 0,
      preYear: 0,
    };
  },
  async created() {
    console.log(this.chartLoaded);
    await this.getUserOrder();
    console.log(this.chartDatac.labels);
    console.log(this.chartLoaded);
    this.chartHeaderc.push([`${this.curYear} Amount by Order`, "#B2DFDB"]);
    this.chartHeaderp.push([`${this.prevYear} Amount by Order`, "#B2DFDB"]);
    this.chartHeaderc.push([`${this.curYear} Quantity by Order`, "#B2DFDB"]);
    this.chartHeaderp.push([`${this.prevYear} Quantity by Order`, "#B2DFDB"]);
  },
  mounted() {
    console.log(this.user);
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
    async getUserOrder() {
      this.curYear = new Date().getFullYear();
      this.prevYear = this.curYear - 1;

      dataService.getUserOrder(this.user.id).then((response) => {
        console.log(response);
        response.forEach((uo) => {
          var date = new Date(uo.orderDt);
          if (date.getFullYear() === this.curYear) {
            this.chartDatac.value.push(
              `${parseFloat(uo.totalAmount).toFixed(2)}`
            );
            this.chartDatac.labels.push(uo.orderDt);

            this.chartData1c.value.push(`${uo.totalItems}`);
            this.chartData1c.labels.push(uo.orderDt);

            this.totalAmountSpentTillDatec =
              parseFloat(this.totalAmountSpentTillDatec) +
              parseFloat(uo.totalAmount);
            this.totalNumberOfOrdersPlacedc =
              this.totalNumberOfOrdersPlacedc + 1;
          } else if (date.getFullYear() === this.prevYear) {
            this.chartDatap.value.push(
              `${parseFloat(uo.totalAmount).toFixed(2)}`
            );
            this.chartDatap.labels.push(uo.orderDt);

            this.chartData1p.value.push(`${uo.totalItems}`);
            this.chartData1p.labels.push(uo.orderDt);

            this.totalAmountSpentTillDatep =
              parseFloat(this.totalAmountSpentTillDatep) +
              parseFloat(uo.totalAmount);
            this.totalNumberOfOrdersPlacedp =
              this.totalNumberOfOrdersPlacedp + 1;
          }
        });
        this.chartLoaded = true;
      });
    },
  },
  computed: {
    ...mapState(["items", "user"]),
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>