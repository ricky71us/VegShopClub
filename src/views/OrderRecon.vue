<template>
  <div v-if="pageLoaded">
    <v-card class="mx-auto mt-5" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="12" class="text-md-center">
                Reconcile Order
                <v-btn @click="generatePdf" text>
                  <v-icon left>mdi-file-pdf</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto mt-3" max-width="1100" color="#B0BEC5">
      <v-list-item>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0 hidden-md-and-up">
            <v-row>
              <v-col
                style="background:#8D6E63;color:white"
                class="text-md-center pl-5"
                cols="6"
              >Bulkorder Invoice</v-col>
              <v-col
                style="background:#4DB6AC;color:white"
                class="text-md-center"
                cols="6"
              >Packed Order</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col
                class="text-md-center pl-4"
                style="background:#BCAAA4;color:white; font-size:12px"
                cols="2"
              >Qty</v-col>
              <v-col
                style="background:#BCAAA4;color:white; font-size:12px"
                cols="1"
                class="hidden-sm-and-down"
              >Unit Price</v-col>
              <v-col style="background:#BCAAA4;color:white; font-size:12px" cols="2">Unit ($)</v-col>

              <v-col style="background:#BCAAA4;color:white ; font-size:12px" cols="2">Total ($)</v-col>
              <v-col
                class="text-md-center"
                style="background:#B2DFDB;color:white ; font-size:12px"
                cols="2"
              >Qty</v-col>
              <v-col
                style="background:#B2DFDB;color:white ; font-size:12px"
                cols="1"
                class="hidden-sm-and-down"
              >Unit Price</v-col>
              <v-col style="background:#B2DFDB;color:white ; font-size:12px" cols="2">Unit ($)</v-col>
              <v-col
                style="background:#B2DFDB;color:white ; font-size:12px"
                cols="1"
                class="hidden-sm-and-down"
              >Total</v-col>
              <v-col style="background:#B2DFDB;color:white ; font-size:12px" cols="2">Total ($)</v-col>
            </v-row>
          </v-container>
          <v-container class="ma-0 pa-0 hidden-sm-and-down">
            <v-row>
              <v-col style="background:#78909C;color:white" cols="4"></v-col>
              <v-col
                style="background:#8D6E63;color:white"
                class="text-md-center"
                cols="4"
              >Bulkorder Invoice</v-col>
              <v-col
                style="background:#4DB6AC;color:white"
                class="text-md-center"
                cols="4"
              >Packed Order</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col class="text-md-center" style="background:#B0BEC5;color:white" cols="4">Items</v-col>
              <v-col class="text-md-center" style="background:#BCAAA4;color:white" cols="2">Qty</v-col>
              <v-col
                style="background:#BCAAA4;color:white"
                cols="1"
                class="hidden-sm-and-down"
              >Unit Price ($)</v-col>
              <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-md-and-up">$</v-col>
              <v-col
                style="background:#BCAAA4;color:white"
                cols="1"
                class="hidden-sm-and-down"
              >Total ($)</v-col>
              <v-col style="background:#BCAAA4;color:white" cols="1" class="hidden-md-and-up">$</v-col>
              <v-col class="text-md-center" style="background:#B2DFDB;color:white" cols="2">Qty</v-col>
              <v-col
                style="background:#B2DFDB;color:white"
                cols="1"
                class="hidden-sm-and-down"
              >Unit Price ($)</v-col>
              <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-md-and-up">$</v-col>
              <v-col
                style="background:#B2DFDB;color:white"
                cols="1"
                class="hidden-sm-and-down"
              >Total ($)</v-col>
              <v-col style="background:#B2DFDB;color:white" cols="1" class="hidden-md-and-up">$</v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto mt-1 hidden-md-and-up" max-width="1100" id="pdfDoc">
      <v-list-item v-for="item in reportData" :key="item.itemId" dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row class="ma-0 pa-0">
              <v-col cols="12" class="ma-0 pt-4" style="font-size:15px; text-align:left">
                <!-- <div
                  v-if="item.starColor === 'red'"
                  style="color:red; "
                >{{item.itemName}} ({{item.defaultUnits}})</div>
                <div
                  v-if="item.starColor === 'green'"
                  style="color:green"
                >{{item.itemName}} ({{item.defaultUnits}})</div>
                <div
                  v-if="item.starColor === 'white'"
                  style="color:black"
                >{{item.itemName}} ({{item.defaultUnits}})</div>-->
                {{item.itemName}} ({{item.defaultUnits}}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="text-md-right" style="font-size:12px">{{item.boQty}}</v-col>
              <v-col
                cols="2"
                class="mb-0 pb-0 text-md-right"
                style="font-size:12px"
              >{{parseFloat(item.unitPrice).toFixed(2)}}</v-col>
              <v-col
                cols="2"
                class="mb-0 pb-0 text-md-right"
                style="font-size:12px"
              >{{item.boTotal}}</v-col>
              <v-col cols="2" class="mb-0 pb-0 text-md-right" style="font-size:12px">
                <div v-if="item.pQtyColor==='green'" style="color:green">{{item.pQty}}</div>
                <div v-if="item.pQtyColor==='black'" style="color:black">{{item.pQty}}</div>
                <div v-if="item.pQtyColor==='red'" style="color:red">{{item.pQty}}</div>
              </v-col>
              <v-col
                cols="2"
                class="mb-0 pb-0 text-md-right"
                style="font-size:12px"
              >{{parseFloat(item.unitPriceFinal).toFixed(2)}}</v-col>
              <v-col cols="2" class="mb-0 pb-0 text-md-right" style="font-size:12px">
                <div v-if="item.starColor === 'red'" style="color:red">{{item.pTotal}}</div>
                <div v-if="item.starColor === 'green'" style="color:green">{{item.pTotal}}</div>
                <div v-if="item.starColor === 'white'" style="color:black">{{item.pTotal}}</div>
                <!-- {{item.pTotal}} -->
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="hidden-md-and-up">
        <v-list-item-content class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row>
              <v-col cols="4" class="mb-0 pb-0" style="font-weight:bold;font-size:12px">Total</v-col>
              <v-col
                cols="2"
                class="mb-0 pb-0 float-right"
                style="font-weight:bold;font-size:11px"
              >{{parseFloat(boGrTotal).toFixed(2)}}</v-col>
              <v-col cols="4" class="mb-0 pb-0"></v-col>
              <v-col
                v-if="parseFloat(boGrTotal) < parseFloat(pGrTotal)"
                cols="2"
                class="mb-0 pb-3"
                style="font-weight:bold;font-size:11px;color:green "
              >{{parseFloat(pGrTotal).toFixed(2)}}</v-col>
              <v-col
                v-if="parseFloat(boGrTotal) === parseFloat(pGrTotal)"
                cols="2"
                class="mb-0 pb-3"
                style="font-weight:bold;font-size:11px;color:black "
              >{{parseFloat(pGrTotal).toFixed(2)}}</v-col>
              <v-col
                v-if="parseFloat(boGrTotal) > parseFloat(pGrTotal)"
                cols="2"
                class="mb-0 pb-3"
                style="font-weight:bold;font-size:11px;color:red "
              >{{parseFloat(pGrTotal).toFixed(2)}}</v-col>
            </v-row>
            <v-divider></v-divider>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto mt-1 hidden-sm-and-down" max-width="1100">
      <v-list-item v-for="item in reportData" :key="item.itemId" dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row class="ma-0 pa-0">
              <v-col cols="4" class="mt-3">
                <!-- <div v-if="item.starColor === 'red'" style="color:red">{{item.itemName}}</div>
                <div v-if="item.starColor === 'green'" style="color:green">{{item.itemName}}</div>
                <div v-if="item.starColor === 'white'" style="color:black">{{item.itemName}}</div>-->
                {{item.itemName}}
              </v-col>
              <v-col cols="2" class="text-md-right">{{item.boQty}} {{item.defaultUnits}}</v-col>
              <v-col
                cols="1"
                class="mb-0 pb-0 text-md-right"
              >{{parseFloat(item.unitPrice).toFixed(2)}}</v-col>
              <v-col cols="1" class="mb-0 pb-0 text-md-right">{{item.boTotal}}</v-col>
              <v-col cols="2" class="mb-0 pb-0 text-md-right">
                <div
                  v-if="item.pQtyColor==='green'"
                  style="color:green"
                >{{item.pQty}} {{item.defaultUnits}}</div>
                <div
                  v-if="item.pQtyColor==='black'"
                  style="color:black"
                >{{item.pQty}} {{item.defaultUnits}}</div>
                <div
                  v-if="item.pQtyColor==='red'"
                  style="color:red"
                >{{item.pQty}} {{item.defaultUnits}}</div>
              </v-col>
              <v-col
                cols="1"
                class="mb-0 pb-0 text-md-right"
              >{{parseFloat(item.unitPriceFinal).toFixed(2)}}</v-col>
              <v-col cols="1" class="mb-0 pb-0 text-md-right">
                <div v-if="item.starColor === 'red'" style="color:red">{{item.pTotal}}</div>
                <div v-if="item.starColor === 'green'" style="color:green">{{item.pTotal}}</div>
                <div v-if="item.starColor === 'white'" style="color:black">{{item.pTotal}}</div>
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
              <v-col cols="7" class="mb-0 pb-0"></v-col>
              <v-col
                cols="2"
                class="mb-0 pb-0 float-right"
                style="font-weight:bold"
              >$ {{parseFloat(boGrTotal).toFixed(2)}}</v-col>
              <v-col cols="2" class="mb-0 pb-0 float-right"></v-col>
              <v-col
                v-if="parseFloat(boGrTotal) < parseFloat(pGrTotal)"
                cols="1"
                class="mb-0 pb-3"
                style="font-weight:bold; color:green"
              >${{parseFloat(pGrTotal).toFixed(2)}}</v-col>
              <v-col
                v-if="parseFloat(boGrTotal) > parseFloat(pGrTotal)"
                cols="1"
                class="mb-0 pb-3"
                style="font-weight:bold;color:red"
              >${{parseFloat(pGrTotal).toFixed(2)}}</v-col>
              <v-col
                v-if="parseFloat(boGrTotal) === parseFloat(pGrTotal)"
                cols="1"
                class="mb-0 pb-3"
                style="font-weight:bold;color:black"
              >${{parseFloat(pGrTotal).toFixed(2)}}</v-col>
              <v-col cols="2" class="mb-0 pb-0"></v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
    </v-card>

    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import * as jsPDF from "jspdf";
export default {
  name: "OrderRecon",
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
        isCancelled: 0,
      },
      reportRow: {
        id: 0,
        boQty: 0,
        boTotal: 0,
        pQty: 0,
        pTotal: 0,
        unitPrice: 0,
      },
      reportData: [],
      pGrTotal: 0,
      boGrTotal: 0,
      pageLoaded: false,
      pdfColumns: [],
      pdfRows: [],
    };
  },
  created() {
    this.getQtyByItem();
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions([
      "getItemsAction",
      "getOrdersAction",
      "getOrderStatusAction",
      "getPurchaseOrderByOrderIdAction",
      "getBulkOrderByOrderIdAction",
    ]),
    generatePdf() {
      var doc = new jsPDF("p", "pt", "4A0");
      doc.setProperties({
        title: `Vegetable Buying Club Recon - Order No: ${this.getCurrentOrder.id}`,
        subject: "Order Reconciliation",
        author: "Vegetable Buying Club",
        keywords: "generated, javascript, web 2.0, ajax",
        creator: "MEEE",
      });
      doc.setFont("PTSans"); // set font
      doc.setFontSize(10);
      doc.setFontStyle("italic");
      doc.text(
        `Vegetable Buying Club Reconciliation - Order No: ${this.getCurrentOrder.id}`,
        200,
        15
      );
      doc.autoTable({
        headStyles: {
          valign: "middle",
          halign: "center",
        },
        columnStyles: {
          boTotal: { halign: "right" },
          unitPrice: { halign: "right" },
          pTotal: { halign: "right" },
          unitPriceFinal: { halign: "right" },
          boQty: { halign: "center" },
          pQty: { halign: "center" },
        },
        styles: { fontSize: 8, cellWidth: "auto", font: "helvetica" },
        theme: "striped",
        body: this.pdfRows,
        columns: this.pdfColumns,
      });
      doc.save(`OrderSummary_${this.getCurrentOrder.id}.pdf`);
    },
    getQtyByItem() {
      this.itemQty = [];
      this.purchaseOrders.forEach((i) => {
        if (parseFloat(i.isCancelled) === 0) {
          if (
            this.itemQty.length === 0 ||
            !this.itemQty.find((iq) => iq.itemId === i.itemId)
          ) {
            this.itemQty.push({
              itemId: i.itemId,
              qty: parseFloat(i.qty),
            });
          } else {
            let item = this.itemQty.find((iq) => iq.itemId === i.itemId);
            item.qty = parseFloat(item.qty) + parseFloat(i.qty);
          }
        }
      });
    },
    async getData() {
      await this.getOrderStatusAction();
      await this.getOrdersAction();
      await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      await this.getBulkOrderByOrderIdAction(this.getCurrentOrder.id);

      this.bulkOrders.forEach((bo) => {
        let itemqty = this.itemQty.find((iq) => iq.itemId === bo.itemId);
        if (itemqty) {
          if (bo.actQty > 0) {
            let po = this.purchaseOrders.filter(
              (po) => po.itemId === bo.itemId && parseInt(po.isCancelled) === 0
            );
            let pTotal = 0;
            let pQty = 0;

            po.forEach((p) => {
              pTotal += bo.actPriceFinal * p.actQty;
              pQty += p.actQty ? parseFloat(p.actQty) : 0;
            });

            this.pGrTotal += pTotal;
            this.boGrTotal += bo.totalPrice ? parseFloat(bo.totalPrice) : 0;

            let item = this.items.find((i) => i.id === bo.itemId);
            this.reportData.push({
              itemName: item.name,
              itemId: bo.itemId,
              defaultUnits: item.defaultUnits,
              boQty: bo.actQty,
              boTotal: bo.totalPrice,
              pQty: pQty.toFixed(2),
              pQtyColor:
                pQty > bo.actQty
                  ? "green"
                  : parseInt(pQty) === parseInt(bo.actQty)
                  ? "black"
                  : "red",
              pTotal: pTotal.toFixed(2),
              unitPrice: bo.actPrice ? bo.actPrice.toString() : 0,
              unitPriceFinal: bo.actPriceFinal
                ? bo.actPriceFinal.toString()
                : 0,
              starColor:
                parseFloat(bo.totalPrice).toFixed(2) ===
                parseFloat(pTotal).toFixed(2)
                  ? "white"
                  : parseFloat(pTotal) - parseFloat(bo.totalPrice) > 0
                  ? "green"
                  : "red",
            });
          }
        }
      });

      this.pdfColumns.push(
        {
          title: `Item`,
          dataKey: "itemName",
        },
        {
          title: `Bulk Order Qty`,
          dataKey: "boQty",
        },
        {
          title: "Bulk Unit Price",
          dataKey: "unitPrice",
        },
        {
          title: `Bulk Total`,
          dataKey: "boTotal",
        },
        {
          title: `Packed Order Qty`,
          dataKey: "pQty",
        },
        {
          title: "Packed Unit Price",
          dataKey: "unitPriceFinal",
        },
        {
          title: `Packed Total`,
          dataKey: "pTotal",
        }
      );

      this.reportData.sort(function (a, b) {
        if (a.itemName < b.itemName) {
          return -1;
        }
        if (a.itemName > b.itemName) {
          return 1;
        }
        return 0;
      });
      this.pageLoaded = "true";
      //this.pdfRows = this.reportData;
      this.reportData.forEach((rd) => {
        this.pdfRows.push({
          itemName: rd.itemName,
          boQty: `${rd.boQty} ${rd.defaultUnits}`,
          pQty: `${rd.pQty} ${rd.defaultUnits}`,
          unitPrice: `$ ${parseFloat(rd.unitPrice).toFixed(2)}`,
          unitPriceFinal: `$ ${parseFloat(rd.unitPriceFinal).toFixed(2)}`,
          boTotal: `$ ${parseFloat(rd.boTotal).toFixed(2)}`,
          pTotal: `$ ${parseFloat(rd.pTotal).toFixed(2)}`,
        });
      });
      let totalRowPdf = {
        itemName: "Total",
        boQty: "",
        pQty: "",
        unitPrice: "",
        unitPriceFinal: "",
        boTotal: `$ ${parseFloat(this.boGrTotal).toFixed(2)}`,
        pTotal: `$ ${parseFloat(this.pGrTotal).toFixed(2)}`,
      };

      this.pdfRows.push(totalRowPdf);

      return this.reportData;
    },
  },
  computed: {
    ...mapState(["bulkOrders", "purchaseOrders", "items"]),
    ...mapGetters(["getCurrentOrder"]),
    grandTotal: function () {
      return 0;
    },
  },
};
</script>

<style lang="scss" >
</style>