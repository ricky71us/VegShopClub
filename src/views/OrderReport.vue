<template>
  <div>
    <v-card
      class="mx-auto mt-5"
      max-width="1100"
      color="orange"
      rounded
      v-if="getCurrentOrder"
    >
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pb-0">
          <v-container class="ma-0 pa-0">
            <v-row>
              <v-col cols="7" class="hidden-md-and-up pt-2 ma-0"
                >Order Summary</v-col
              >
              <v-col
                cols="5"
                class="hidden-md-and-up pt-1 ma-0"
                v-if="getCurrentOrder"
              >
                <v-btn
                  v-if="isOrderLocked"
                  @click="toggleOrderLock"
                  class="hidden-md-and-up mr-1 pa-0"
                  style="font-size: 12px"
                  text
                  min-width="1"
                  max-height="3"
                >
                  <!-- <v-icon left>mdi-lock-open</v-icon> -->
                  closed
                </v-btn>
                <v-btn
                  v-if="!isOrderLocked"
                  @click="toggleOrderLock"
                  class="hidden-md-and-up mr-1 pa-0"
                  style="font-size: 12px"
                  text
                  min-width="1"
                  max-height="3"
                >
                  <!-- <v-icon small left>mdi-lock</v-icon> -->
                  open
                </v-btn>
                <v-btn
                  @click="generatePdf"
                  class="ma-0 pa-0 hidden-md-and-up"
                  style="font-size: 12px"
                  text
                  min-width="4"
                  max-height="3"
                >
                  <!-- <v-icon small left>mdi-file-pdf</v-icon> -->
                  | PDF
                </v-btn>
              </v-col>
              <v-col cols="9" class="text-md-center hidden-sm-and-down"
                >Order Summary</v-col
              >
              <v-col
                cols="3"
                class="text-md-center hidden-sm-and-down ma-0 pa-0"
                style="display: inline"
              >
                <span>
                  <v-btn
                    v-if="isOrderLocked"
                    @click="toggleOrderLock"
                    class="hidden-sm-and-down"
                    text
                    style="font-size: 11px"
                  >
                    <!-- <v-icon left>mdi-lock-open</v-icon> -->
                    closed
                  </v-btn>
                  <v-btn
                    v-if="!isOrderLocked"
                    @click="toggleOrderLock"
                    class="hidden-sm-and-down"
                    text
                    style="font-size: 11px"
                  >
                    <!-- <v-icon left>mdi-lock</v-icon> -->
                    open </v-btn
                  >|
                  <v-btn
                    @click="generatePdf"
                    class="ma-0 pa-0 hidden-sm-and-down"
                    style="font-size: 11px"
                    text
                    >PDF</v-btn
                  >
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card class="mx-auto pa-0 mt-3" max-width="1100" v-if="getCurrentOrder">
      <v-row>
        <v-col cols="10">
          <v-sheet rounded class="ml-2" style="color: #006064"
            >Total No of Orders: {{ userCount }}</v-sheet
          >
          <v-sheet
            rounded
            class="ml-2"
            style="
              color: #006064;
              font-style: italic;
              color: green;
              font-size: 14px;
            "
            >Packer(s): {{ getPacker() }}</v-sheet
          >
        </v-col>
        <v-col cols="2">
          <!-- <v-btn color="primary" dark @click.stop="dialog = true">Adjust Quantities</v-btn> -->
          <v-icon color="black" dark @click.stop="dialog = true"
            >mdi-pencil</v-icon
          >
          <v-dialog v-model="dialog" max-width="500">
            <v-card class="mx-auto ma-3" max-width="500">
              <!-- <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header color="grey lighten-1">Manage Existing Orders</v-expansion-panel-header>
              <v-expansion-panel-content>-->
              <!-- <v-card class="mx-auto" max-width="400" tile dense shaped> -->
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
              <!-- </v-card> -->
              <v-card class="mx-auto" max-width="400" tile dense shaped>
                <v-list-item v-for="user in localUsers" :key="user.id" dense>
                  <v-list-item-content dense class="ma-0 pa-0">
                    <v-container class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="6" class="mb-0 pb-0 text-md-left">
                          <v-checkbox
                            v-model="selected"
                            :label="user.firstname"
                            :value="user.id"
                            class="ma-0 pa-0"
                            @change="validateForm"
                            dense
                            style="font-size: 10px"
                          ></v-checkbox>
                        </v-col>

                        <v-col cols="6" class="text-md-end mb-0 pb-0">
                          <v-flex shrink class="text-xl-left">
                            <v-text-field
                              v-model="user.qty"
                              :label="user.defaultUnits"
                              hide-details="auto"
                              class="ma-0 pa-0 text-md-right"
                              color="success"
                              dense
                              @change="validateForm"
                              outlined
                              type="decimal"
                              onclick="this.select();"
                              :rules="qtyRules(user)"
                            ></v-text-field>
                          </v-flex>
                        </v-col>
                        <!--  <v-col cols="3" class="mb-0 pt-6 text-sm-right hidden-md-and-up">{{item.totalPrice}}</v-col>
                <v-col
                  cols="3"
                  class="mb-0 pb-0 text-md-right hidden-sm-and-down"
                        >$ {{item.totalPrice}}</v-col>-->
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
                        <v-col cols="12" class="mb-0 pb-3">
                          <v-btn
                            color="success"
                            @click="saveItemPO()"
                            class="float-right"
                            :disabled="!valid"
                            >Save</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <!-- </v-expansion-panel-content>
            </v-expansion-panel>
              </v-expansion-panels>-->
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto pl-3 mt-3" max-width="1100" v-if="getCurrentOrder">
      <v-simple-table v-if="isMobile" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" style="background-color: #e0e0e0">
                Users who have placed Order
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in chartUserItem.labels" :key="item">
              <td style="background-color: #ffffff">{{ item }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-layout
      v-resize="onResize"
      class="mt-2"
      column
      style="padding-top: 7px"
      v-if="getCurrentOrder"
    >
      <v-data-table
        :headers="reportHeader"
        :items="reportData"
        hide-default-footer
        :items-per-page="100"
        class="elevation-1 mt-8; text-align:right; pa-0"
        :class="{ mobile: isMobile }"
        :mobile="isMobile"
        :disable-sort="isMobile"
        :disable-filtering="isMobile"
        :disable-pagination="isMobile"
        :hide-default-header="false"
      >
        <template v-slot:[`item.userName`]="{ item }">
          <v-chip label ripple>{{ item.userName }}</v-chip>
        </template>
        <template slot="body.append">
          <tr class="hidden-sm-and-down">
            <td
              style="background-color: grey"
              v-for="(item, index) in reportTotalRow"
              :key="index"
            >
              {{ item }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-layout>

    <BaseNoActiveOrderMessage v-if="!getCurrentOrder" />
    <template v-if="childDataLoaded">
      <v-divider class="mx-4"></v-divider>
      <!-- <v-simple-table v-if="childDataLoaded">
      <tbody>
        <tr>
          <td cols="6"> -->
      <v-lazy
        :options="{
          threshold: 0.5,
        }"
        min-height="200"
        transition="fab-transition"
      >
        <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
          <BaseBarChart
            v-bind:c-labels="[...chartData.labels]"
            v-bind:c-values="[...chartData.value]"
            v-bind:c-header="chartHeader[0]"
          />
        </v-card>
      </v-lazy>
      <v-divider class="mx-4"></v-divider>
      <v-lazy
        :options="{
          threshold: 0.5,
        }"
        min-height="200"
        transition="fab-transition"
      >
        <v-card class="mx-auto ma-3" max-width="1000" elevation shaped>
          <BaseBarChart
            v-bind:c-labels="[...chartUserOrderItems.labels]"
            v-bind:c-values="[...chartUserOrderItems.value]"
            v-bind:c-header="chartHeader[1]"
          />
        </v-card>
      </v-lazy>
      <v-divider class="mx-4" inset></v-divider>
      <v-lazy
        :options="{
          threshold: 0.5,
        }"
        min-height="200"
        transition="slide-x-transition"
      >
        <v-card class="mx-auto ma-3" max-width="600" elevation shaped>
          <BaseBarChart
            v-bind:c-labels="[...chartUserItem.labels]"
            v-bind:c-values="[...chartUserItem.value]"
            v-bind:c-header="chartHeader[2]"
          />
        </v-card>
      </v-lazy>
    </template>

    <v-snackbar id="header-snackbar" v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { dataService } from "../shared";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
//import autoTable from "jspdf-autotable";

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
      pdfRow: [],
      pdfRows: [],
      pdfColumns: [],
      pdfTotalsRow: [],
      itemQty: [],
      valid: false,
      snackbar: false,
      message: null,
      multiLine: true,
      isOrderLocked: 0,
      userCount: 0,
      userItemCount: 0,
      isMobile: false,
      selected: [],
      selectedItem: null,
      localItems: [],
      dialog: false,
      sortedItems: [],
      chartData: { labels: [], value: [] },
      chartUserItem: { labels: [], value: [] },
      childDataLoaded: false,
      chartHeader: [],
      chartUserOrderItems: { labels: [], value: [] },
      isActive: false,
    };
  },
  async created() {
    this.chartHeader.push(["Item Qty", "#B2DFDB"]);
    this.chartHeader.push(["Item's in Order Qty", "#7CB342"]);
    this.chartHeader.push(["User Qty", "#EF5350"]);

    await this.setOrderLock();
    await this.getQtyByItem();
    if (this.getCurrentOrder !== undefined) await this.getData();
    await this.getSortedItems();
  },
  mounted() {},
  methods: {
    ...mapActions([
      "getPurchaseOrderByOrderIdAction",
      "updateOrderAction",
      "addPurchaseOrderAction",
      "updatePurchaseOrderAction",
      "addBulkOrderAction",
    ]),
    onResize() {
      if (parseInt(window.innerWidth) < 769) this.isMobile = true;
      else this.isMobile = false;
    },
    getQtyByItem() {
      this.itemQty = [];
      this.purchaseOrders.forEach((i) => {
        if (parseInt(i.isCancelled) === 0) {
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
    OnItemChange() {
      this.getSortedItems();
      this.selected = [];
      this.localItems = [];
      let currItem = this.items.find((i) => i.id === this.selectedItem);
      let poByItem = this.purchaseOrders.filter(
        (po) =>
          po.itemId === this.selectedItem && parseInt(po.isCancelled) === 0
      );

      this.localUsers.forEach((lo) => {
        let po = poByItem.find((pi) => pi.userId === lo.id);
        if (po) {
          this.localItems.push({
            id: po.id,
            orderId: this.getCurrentOrder.id,
            itemId: this.selectedItem,
            userId: lo.id,
            qty: po.qty,
            actQty: po.actQty,
            suggestedQty: po.suggestedQty,
            actPrice: 0,
            isCancelled: 0,
            userName: `${lo.firstname} ${lo.lastname}`,
            defaultUnits: currItem.defaultUnits,
          });
          lo.qty = po.qty;
          lo.poId = po.id;
          this.selected.push(lo.id);
        } else {
          this.localItems.push({
            id: 0,
            orderId: this.getCurrentOrder.id,
            itemId: this.selectedItem,
            userId: lo.id,
            qty: 0,
            actQty: 0,
            suggestedQty: 0,
            actPrice: 0,
            isCancelled: 0,
            userName: `${lo.firstname} ${lo.lastname}`,
            defaultUnits: currItem.defaultUnits,
          });
          lo.qty = 0;

          lo.poId = 0;
        }
        lo.minQty = parseFloat(currItem.minQty).toFixed(2);
        lo.maxQty = parseFloat(currItem.maxQty).toFixed(2);
        lo.defaultUnits = currItem.defaultUnits;
      });

      this.validateForm();
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
    qtyRules(item) {
      if (this.selected.find((u) => u === item.id)) {
        let minQty = item.minQty;
        let maxQty = item.maxQty;
        let rules = [
          (v) => !isNaN(v) || `Please enter a number`,
          (v) =>
            !(parseFloat(v) < parseFloat(minQty)) ||
            `Min Qty ${item.minQty} ${item.defaultUnits}`,
          (v) =>
            maxQty !== 0
              ? !(v > maxQty) || `Max Qty ${item.maxQty} ${item.defaultUnits}`
              : true,
        ];
        return rules;
      }
      return [];
    },
    setSelectedItems() {
      this.getPurchaseOrderByItem.forEach((po) => {
        if (parseInt(po.isCancelled) === 0) {
          this.selected.push(po.itemId);
        }
      });
    },
    validateForm() {
      //console.log(this.selected);
      //if (this.selected.length > 0) this.valid = true;
      //else this.valid = false;

      this.selected.forEach((s) => {
        //console.log(this.valid);
        var tmp = this.localUsers.find((lu) => lu.id === s);
        //console.log(tmp);
        if (
          parseFloat(tmp.qty) < parseFloat(tmp.minQty) ||
          parseFloat(tmp.qty) > parseFloat(tmp.maxQty)
        ) {
          this.valid = false;
        } else this.valid = true;
      });
    },
    setOrderLock: function () {
      if (this.getCurrentOrder)
        this.isOrderLocked =
          parseInt(this.getCurrentOrder.isLocked) === 1 ? true : false;
    },
    snackMessage: function (message) {
      this.message = message;
      this.snackbar = true;
    },
    async toggleOrderLock() {
      this.isOrderLocked =
        parseInt(this.getCurrentOrder.isLocked) === 1 ? 0 : 1;
      await this.updateOrderAction({
        id: this.getCurrentOrder.id,
        orderDt: this.getCurrentOrder.orderDt,
        cutOffDt: null,
        orderStatus: this.getCurrentOrder.orderStatus,
        isLocked: this.isOrderLocked,
      });
      if (parseInt(this.isOrderLocked) === 1) {
        this.snackMessage("This order is now closed for changes!");
        this.sendEmail();
      } else if (parseInt(this.isOrderLocked) === 0) {
        this.snackMessage("This order is Unlocked!");
      }
    },
    async sendEmail() {
      await dataService
        .sendEmailConsolidatedOrder(this.getCurrentOrder.id, this.user.id)
        .catch((error) => {
          console.log(error);
          this.snackMessage("Failed to send Email.");
        });
    },
    generatePdf() {
      var doc = new jsPDF("l", "pt", "4A0");
      doc.setProperties({
        title: `Vegetable Buying Club Summary - Order No: ${this.getCurrentOrder.id}`,
        subject: "Order Summary",
        author: "Vegetable Buying Club",
        keywords: "generated, javascript, web 2.0, ajax",
        creator: "MEEE",
      });
      doc.setFont("PTSans"); // set font
      doc.setFontSize(10);
      doc.setFontStyle("italic");
      doc.text(
        `Vegetable Buying Club Summary - Order No: ${this.getCurrentOrder.id}`,
        300,
        15
      );
      doc.text(`Packer(s) : ${this.getPacker()}`, 50, 25);
      doc.autoTable({
        columnStyles: { userName: { halign: "center" } }, // European countries centered

        styles: { fontSize: 5, cellWidth: "auto", font: "helvetica" },
        theme: "striped",
        body: this.pdfRows,
        columns: this.pdfColumns,
      });
      doc.save(`OrderSummary_${this.getCurrentOrder.id}.pdf`);
    },

    async saveItemPO() {
      this.validateForm();
      if (!this.selectedItem) {
        this.snackMessage("Please select an Item ");
      } else {
        if (this.valid) {
          var selList = [];
          if (this.selected.length > 0) {
            this.selected.forEach((a) => {
              if (
                selList.length === 0 ||
                selList.find((sl) => parseInt(sl.userId) !== parseInt(a))
              )
                var userData = this.localUsers.find((lu) => lu.id === a);
              var item = this.localItems.find(
                (li) => parseInt(li.userId) === parseInt(a)
              );
              item.qty = userData.qty;
              selList.push(item);
            });
          }
          if ((await selList.length) > 0) {
            await selList.forEach((item) => {
              var pod = this.getPurchaseOrderByItem.find(
                (po) =>
                  po.orderId === this.getCurrentOrder.id &&
                  //po.itemId === item.id &&
                  po.userId === item.userId
              );
              if (pod) {
                if (pod.id)
                  this.tempPO = {
                    id: pod.id,
                    orderId: this.getCurrentOrder.id,
                    itemId: this.selectedItem,
                    userId: item.userId,
                    qty: item.qty,
                    actQty: pod.actQty,
                    suggestedQty: pod.suggestedQty,
                    actPrice: 0,
                    isCancelled: 0,
                    isPacked: pod.isPacked,
                  };
                this.updatePurchaseOrderAction(this.tempPO);
              } else {
                this.addPurchaseOrderAction({
                  orderId: this.getCurrentOrder.id,
                  itemId: this.selectedItem,
                  qty: item.qty,
                  actQty: 0,
                  suggestedQty: 0,
                  actPrice: 0,
                  userId: item.userId,
                  isCancelled: 0,
                });
                if (
                  this.bulkOrders.length === 0 ||
                  !this.bulkOrders.find(
                    (bo) => parseInt(bo.itemId) === parseInt(this.selectedItem)
                  )
                ) {
                  console.log(this.selectedItem);
                  this.addBulkOrderAction({
                    orderId: this.getCurrentOrder.id,
                    itemId: this.selectedItem,
                    actQty: 0,
                    actPrice: 0,
                    isCancelled: 0,
                    totalPrice: 0,
                  });
                }
              }
            });
          }

          await this.getPurchaseOrderByItem.forEach((po) => {
            if (!selList.find((item) => item.userId === po.userId)) {
              if (po.id)
                this.tempPO = {
                  id: po.id,
                  orderId: this.getCurrentOrder.id,
                  itemId: this.selectedItem,
                  userId: po.userId,
                  qty: po.qty,
                  actQty: po.actQty,
                  actPrice: 0,
                  isCancelled: 1,
                };
              this.updatePurchaseOrderAction(this.tempPO).then();
            }
          });

          this.snackMessage(`Data Updated.`);
          this.dialog = false;
        }
      }
    },

    async getData() {
      //if (!this.getCurrentOrder) return;
      let itemCount = 0;
      this.reportData = [];
      this.reportHeader = [];
      this.reportTotalRow = [];
      await this.getUsers();
      if (this.getCurrentOrder !== undefined)
        await this.getPurchaseOrderByOrderIdAction(this.getCurrentOrder.id);
      this.bulkOrders.forEach((bo) => {
        //if (bo.qty > 0) {
        let item = this.items.find(
          (i) => i.id === bo.itemId && parseInt(i.isActive) === 1
        );
        if (item) {
          this.allItems.push({ id: bo.itemId, name: item.name });
        }
        //}
      });

      this.allItems.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      this.allItems.forEach((ai) => {
        let item = this.items.find(
          (i) => i.id === ai.id && parseInt(i.isActive) === 1
        );
        if (item) {
          this.reportHeader.push({
            text: `${item.name} (${item.defaultUnits})`,
            value: "i_" + item.id,
            class: "grey",
          });
          this.pdfColumns.push({
            title: `${item.name} (${item.defaultUnits})`,
            dataKey: "i_" + item.id,
          });
        }
        if (!this.chartUserOrderItems.labels.find((l) => l === ai.name)) {
          this.chartUserOrderItems.labels.push(ai.name);
          itemCount = this.purchaseOrders.filter((po) => po.itemId === ai.id)
            .length;
          this.chartUserOrderItems.value.push(itemCount);
        }
      });

      this.reportHeader.unshift({
        text: "Buyer",
        value: "userName",
        sortable: true,
        align: "start",
        class: "grey",
        style: "background-color: grey",
      });

      this.pdfColumns.unshift({
        title: "Buyer",
        dataKey: "userName",
      });

      this.localUsers
        .sort(function (a, b) {
          if (a.firstname < b.firstname) {
            return -1;
          }
          if (a.firstname > b.firstname) {
            return 1;
          }
          return 0;
        })
        .forEach((u) => {
          this.userItemCount = 0;
          // clear report Row
          this.reportRow = {};
          this.reportTotalRow = [];
          this.reportRow = {
            userName: `${u.firstname} ${u.lastname} - ${this.userItemCount} `,
          };

          this.purchaseOrders.forEach((po) => {
            if (po.userId === u.id && parseInt(po.isCancelled) === 0) {
              this.reportRow["i_" + po.itemId] = po.qty
                .toString()
                .replace(/\.00$/, "");
              this.userItemCount++;
            }
          });
          //console.log(this.pdfRows);
          if (this.userItemCount > 0) {
            this.chartUserItem.labels.push(`${u.firstname} ${u.lastname}`);
            this.chartUserItem.value.push(this.userItemCount);
          }

          this.reportRow[
            "userName"
          ] = `${u.firstname} ${u.lastname} - (${this.userItemCount}) `;

          let user = this.purchaseOrders.find(
            (po) =>
              po.userId === u.id &&
              po.orderId === this.getCurrentOrder.id &&
              parseInt(po.isCancelled) === 0
          );
          if (user) {
            this.reportData.push(this.reportRow);
            this.userCount++;
          }
        });

      this.pdfTotalsRow = { userName: `Total` };
      this.allItems.forEach((i) => {
        let tot = this.itemQty.find((iq) => iq.itemId === i.id);
        if (tot) {
          this.reportTotalRow.push(tot.qty);
          if (tot.qty > 1) {
            this.chartData.value.push(tot.qty);
            this.chartData.labels.push(i.name);
          }

          this.pdfTotalsRow["i_" + i.id] = tot.qty;
        } else {
          this.reportTotalRow.push("");
          this.pdfTotalsRow["i_" + i.id] = "";
        }
      });

      this.reportTotalRow.unshift("Total");

      this.reportData.forEach((rd) => {
        this.pdfRow = {};
        Object.keys(this.pdfTotalsRow).forEach((key) => {
          if (rd[key]) this.pdfRow[key] = rd[key];
          else this.pdfRow[key] = "";
        });
        this.pdfRows.push(this.pdfRow);
      });
      this.pdfRows.push(this.pdfTotalsRow);

      this.childDataLoaded = true;
    },
    async getUsers() {
      await dataService.getAllUsers().then((response) => {
        this.localUsers = response;
        // TODO: to ignore test user accounts for now
        this.localUsers = this.localUsers.filter((r) => parseInt(r.id) > 3);
      });
    },
    getPacker() {
      let packers = "";
      this.localUsers.forEach((lu) => {
        if (parseInt(lu.isPacker) === 1) {
          if (packers) packers += ", ";
          packers += `${lu.firstname} ${lu.lastname}`;
        }
      });
      return packers;
    },
  },
  computed: {
    ...mapState(["purchaseOrders", "bulkOrders", "items", "user"]),
    ...mapGetters(["getCurrentOrder", "noActiveOrder"]),
    getPurchaseOrderByItem() {
      return this.purchaseOrders.filter(
        (po) => po.itemId === this.selectedItem
      );
    },
  },
};
</script>

<style lang="css" >
.v-sheet--offset {
  top: -24px;
  position: relative;
}

.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>