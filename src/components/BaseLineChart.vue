<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["cLabels", "cValues", "cHeader", "cLabels1", "cValues1", "cHeader1"],
  data() {
    return {
      chartdata: {
        labels: this.cLabels,
        datasets: [
          {
            label: this.cHeader[0],
            //backgroundColor: "rgb(255, 99, 132)",
            backgroundColor: this.cHeader[1],
            //borderColor: "rgb(255, 99, 132)",
            data: this.cValues,
          },
          {
            label: this.cHeader1 ? this.cHeader1[0] : "",
            //backgroundColor: "rgb(255, 99, 132)",
            backgroundColor: this.cHeader1 ? this.cHeader1[1] : "white",
            //borderColor: "rgb(255, 99, 132)",
            data: this.cValues1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      loaded: false,
    };
  },
  mounted() {
    console.log(this.cValues);

    this.renderChart(
      this.cHeader1 ? this.chartdata.datasets.pop() : this.chartdata,
      this.options
    );
  },
  computed: {
    chartLabels: {
      get: function () {
        return [this.cLabels];
      },
    },
    chartValues: {
      get: function () {
        return [this.cValues];
      },
    },
  },
  // watch: {
  //   loaded: function (chartDataloaded) {
  //     if (chartDataloaded) {
  //       //this.renderChart(this.chartdata, this.options);
  //     }
  //   },
  // },
};
</script>

<style>
</style>