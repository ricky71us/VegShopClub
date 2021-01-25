<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["cLabels", "cValues", "cHeader"],
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
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
      },
    };
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
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
};
</script>

<style>
</style>