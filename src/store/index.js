import Vue from "vue";
import Vuex from "vuex";
import { dataService } from "../shared";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    user: { id: 0, email: "", firstname: "", lastname: "", phone: "", lastlogindate:"" },
    orders: [],
    orderstatus: [],
    items: [],
    packerSchedules: [],
    purchaseOrders: [],
    bulkOrders: [],
    isPounds: false,
    isOrderLocked: false,
    isUserLoggedIn: false,
  };
};

const state = getDefaultState();

const mutations = {
  togglePounds(state, flag) {
    state.isPounds = flag;
  },
  toggleOrderLocked(state, flag) {
    state.isOrderLocked = flag;
  },
  updateUser(state, user) {
    state.user = user;
  },
  resetState(state) {
    //state.user = null;
    localStorage.removeItem("userId");
    Object.assign(state, getDefaultState());
    state.isUserLoggedIn = false;
  },
  signIn(state, signInUser) {
    if (signInUser) {
      state.user = signInUser;
      state.isUserLoggedIn = true;
    }
  },
  // Order Status
  getOrderStatus(state, orderstatus) {
    state.orderstatus = orderstatus;
  },
  // Orders
  getOrders(state, orders) {
    state.orders = orders;
  },
  addOrder(state, order) {
    state.orders.unshift(...order);
  },
  updateOrder(state, order) {
    const index = state.orders.findIndex((h) => h.id === order.id);
    state.orders.splice(index, 1, order);
    state.orders = [...state.orders];
  },
  deleteOrder(state, order) {
    state.orders = [...state.orders.filter((p) => p.id !== order.id)];
  },
  //Items
  getItems(state, items) {
    state.items = items;
  },
  addItem(state, item) {
    state.items.unshift(...item); // mutable addition
  },
  updateItem(state, item) {
    const index = state.items.findIndex((c) => c.id === item.id);
    //console.log(`item index of ${item.name} ; ${item.id} --> ${index}`);
    state.items.splice(index, 1, item);
    state.items = [...state.items];
  },
  deleteItem(state, item) {
    state.items = [...state.items.filter((p) => p.id !== item.id)];
  },
  // Packer Schedule

  getPackerSchedule(state, packerSchedule) {
    state.packerSchedules = packerSchedule;
  },
  addPackerSchedule(state, packerSchedule) {
    state.packerSchedules.unshift(...packerSchedule); // mutable addition
  },
  updatePackerSchedule(state, packerSchedule) {
    const index = state.packerSchedules.findIndex(
      (c) => c.id === packerSchedule.id
    );
    //console.log(`packerSchedule index of ${packerSchedule.name} ; ${packerSchedule.id} --> ${index}`);
    state.packerSchedules.splice(index, 1, packerSchedule);
    state.packerSchedules = [...state.packerSchedules];
  },
  deletePackerSchedule(state, packerSchedule) {
    state.packerSchedules = [
      ...state.packerSchedules.filter((p) => p.id !== packerSchedule.id),
    ];
  },
  //Purchase Order
  getPurchaseOrder(state, purchaseOrders) {
    state.purchaseOrders = purchaseOrders;
  },
  addPurchaseOrder(state, purchaseOrder) {
    state.purchaseOrders.unshift(...purchaseOrder); // mutable addition
  },
  updatePurchaseOrder(state, purchaseOrder) {
    const index = state.purchaseOrders.findIndex(
      (c) => c.id === purchaseOrder.id
    );
    //console.log(`purchaseOrder index of ${purchaseOrder.name} ; ${purchaseOrder.id} --> ${index}`);
    state.purchaseOrders.splice(index, 1, purchaseOrder);
    state.purchaseOrders = [...state.purchaseOrders];
  },
  deletePurchaseOrder(state, purchaseOrder) {
    state.purchaseOrders = [
      ...state.purchaseOrders.filter((p) => p.id !== purchaseOrder.id),
    ];
  },
  //Bulk Order
  getBulkOrder(state, bulkOrders) {
    state.bulkOrders = bulkOrders;
  },
  addBulkOrder(state, bulkOrder) {
    state.bulkOrders.unshift(...bulkOrder); // mutable addition
  },
  updateBulkOrder(state, bulkOrder) {
    const index = state.bulkOrders.findIndex((c) => c.id === bulkOrder.id);
    //console.log(`bulkOrder index of ${bulkOrder.name} ; ${bulkOrder.id} --> ${index}`);
    state.bulkOrders.splice(index, 1, bulkOrder);
    state.bulkOrders = [...state.bulkOrders];
  },
  deleteBulkOrder(state, purchaseOrder) {
    state.purchaseOrders = [
      ...state.purchaseOrders.filter((p) => p.id !== purchaseOrder.id),
    ];
  },
};

const actions = {
  async resetStateAction({ commit }) {
    commit("resetState");
  },
  async signInAction({ commit }, user) {    
    const signInUser = await dataService.signIn(user);    
    //.then(() => {
    //localStorage.setItem("userId", signInUser.id);
    //});
    commit("signIn", signInUser);
  },
  async updateUserAction({ commit }, user) {
    await dataService.updateUser(user);
    commit("updateUser", user);
  },
  //OrderStatus
  async getOrderStatusAction({ commit }) {
    const orderstatus = await dataService.getOrderStatus();
    commit("getOrderStatus", orderstatus);
  },
  //Orders
  async getOrdersAction({ commit }) {
    const orders = await dataService.getOrders();
    commit("getOrders", orders);
  },
  async addOrderAction({ commit }, order) {
    const addedOrder = await dataService.addOrder(order);
    commit("addOrder", addedOrder);
  },
  async updateOrderAction({ commit }, order) {
    const updatedOrder = await dataService.updateOrder(order);
    commit("updateOrder", updatedOrder);
  },
  async deleteOrderAction({ commit }, order) {
    await dataService.deleteOrder(order);
    commit("deleteOrder", order);
  },
  // Items
  async getItemsAction({ commit }) {
    const items = await dataService.getItems();
    commit("getItems", items);
  },
  async addItemAction({ commit }, item) {
    const addedItem = await dataService.addItem(item);
    commit("addItem", addedItem);
  },
  async updateItemAction({ commit }, item) {
    const updatedItem = await dataService.updateItem(item);
    commit("updateItem", updatedItem);
  },
  async deleteItemAction({ commit }, item) {
    const status = await dataService.deleteItem(item);
    if (status) commit("deleteItem", item);
  },

  // PackerSchedule
  async getPackerScheduleAction({ commit }, filter) {
    const items = await dataService.getPackerSchedule(filter);
    commit("getPackerSchedule", items);
  },
  async addPackerScheduleAction({ commit }, item) {
    const addedPackerSchedule = await dataService.addPackerSchedule(item);
    commit("addPackerSchedule", addedPackerSchedule);
  },
  async updatePackerScheduleAction({ commit }, item) {
    console.log(item);
    const updatedPackerSchedule = await dataService.updatePackerSchedule(item);
    commit("updatePackerSchedule", updatedPackerSchedule);
  },
  async deletePackerScheduleAction({ commit }, item) {
    const status = await dataService.deletePackerSchedule(item);
    if (status) commit("deletePackerSchedule", item);
  },

  //PurchaseOrder
  async getPurchaseOrderAction({ commit }) {
    const purchaseOrder = await dataService.getPurchaseOrder();
    commit("getPurchaseOrder", purchaseOrder);
  },
  async getPurchaseOrderByOrderIdAction({ commit }, orderId) {
    const purchaseOrder = await dataService.getPurchaseOrderByOrderId(orderId);
    commit("getPurchaseOrder", purchaseOrder);
  },
  async addPurchaseOrderAction({ commit }, purchaseOrder) {
    const addedPurchaseOrder = await dataService.addPurchaseOrder(
      purchaseOrder
    );
    commit("addPurchaseOrder", addedPurchaseOrder);
  },
  async updatePurchaseOrderAction({ commit }, purchaseOrder) {
    const updatedPurchaseOrder = await dataService.updatePurchaseOrder(
      purchaseOrder
    );
    commit("updatePurchaseOrder", updatedPurchaseOrder);
  },
  async deletePurchaseOrderAction({ commit }, purchaseOrder) {
    const status = await dataService.deletePurchaseOrder(purchaseOrder);
    if (status) commit("deletePurchaseOrder", purchaseOrder);
  },

  //BulkOrder
  async getBulkOrderAction({ commit }) {
    const bulkOrder = await dataService.getBulkOrder();
    commit("getBulkOrder", bulkOrder);
  },
  async getBulkOrderByOrderIdAction({ commit }, orderId) {
    const bulkOrder = await dataService.getBulkOrderByOrderId(orderId);
    commit("getBulkOrder", bulkOrder);
  },
  async addBulkOrderAction({ commit }, bulkOrder) {
    const addedBulkOrder = await dataService.addBulkOrder(bulkOrder);
    commit("addBulkOrder", addedBulkOrder);
  },
  async updateBulkOrderAction({ commit }, bulkOrder) {
    const updatedBulkOrder = await dataService.updateBulkOrder(bulkOrder);
    commit("updateBulkOrder", updatedBulkOrder);
  },
  async deleteBulkOrderAction({ commit }, bulkOrder) {
    const status = await dataService.deleteBulkOrder(bulkOrder);
    if (status) commit("deleteBulkOrder", bulkOrder);
  },
};

const getters = {
  getUserName: (state) => {
    if (state.user) {
      return state.user.firstname === undefined || state.user.firstname === ""
        ? "Guest"
        : state.user.firstname + " " + state.user.lastname;
    }
    return "Guest";
  },
  isUserAuthenticated: () => {
    let userId = parseInt(localStorage.getItem("userId"));
    if (userId > 0) return true;
  },
  isAdminUser: (state) => {
    if (state.user) {
      return parseInt(state.user.isAdmin) === 1;
    }
    return false;
  },
  getItemById: (state) => (id) =>
    state.items.find((v) => parseInt(v.id) === parseInt(id)),
  getActiveOrderStatus: function(state) {
    if (state.orderstatus) {
      return state.orderstatus.find((os) => os.status === "Active");
    }
    return 0;
  },
  getCurrentOrder: function(state, getters) {
    var actStatus = getters.getActiveOrderStatus;
    var curOrder = state.orders.find((ord) => ord.orderStatus === actStatus.id);
    return curOrder;
  },
  getActiveItems: function(state) {
    let activeItems = state.items.filter((i) => parseInt(i.isActive) === 1);
    return activeItems;
  },
  getActiveBulkOrders: function(state, getters) {
    let activeBulkOrders = [];
    getters.getActiveItems.forEach((item) => {
      let bo = state.bulkOrders.find(
        (bu) =>
          parseInt(bu.itemId) === parseInt(item.id) &&
          parseInt(bu.orderId) === parseInt(getters.getCurrentOrder.id)
      );
      activeBulkOrders.push(bo);
    });
    return activeBulkOrders;
  },
  getActualPrice: function(state) {
    let actualPricePerItem = [];
    state.bulkOrders.forEach((bo) => {
      if (parseFloat(bo.actPriceFinal) > 0) {
        actualPricePerItem.push({ itemId: bo.itemId, price: bo.actPriceFinal });
      }
    });
    return actualPricePerItem;
  },
  noActiveOrder: function(getters) {
    return !getters.getCurrentOrder;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState()],
});
