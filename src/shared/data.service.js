import * as axios from "axios";

import { API } from "./config";

const signIn = async function(user) {
  try {
    const response = await axios.post(`${API}/authentication/login`, user);
    const userInfo = parseItem(response, 200);
    //console.log(userInfo.data);
    return userInfo.data;
  } catch (error) {
    console.error(error);
    console.error(error.message);
    return null;
  }
};

const register = async function(user) {
  try {
    const response = await axios.post(
      `${API}/authentication/registration`,
      user
    );

    const userInfo = parseItem(response, 200);

    return userInfo;
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
};

const updateUser = async function(user) {
  try {
    const response = await axios.put(
      `${API}/authentication/user?id=${user.id}`,
      user
    );

    const userInfo = parseItem(response, 200);

    return userInfo;
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
};

const getUserData = async function(id) {
  try {
    const response = await axios.get(`${API}/authentication/user/${id}`);
    console.log(response);
    const userInfo = parseItem(response, 200);
    return userInfo;
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
};

const getAllUsers = async function() {
  try {
    const response = await axios.get(`${API}/authentication/users`);

    const userInfo = parseItem(response, 200);
    return userInfo;
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
};
//Order Status
const getOrderStatus = async function() {
  try {
    const response = await axios.get(`${API}/orderstatus`);
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

// Order
const getOrders = async function() {
  try {
    const response = await axios.get(`${API}/orders`);
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const addOrder = async function(order) {
  var response = null;
  try {
    response = await axios.post(`${API}/orders`, order);
    console.log(response);
    const addedOrder = parseItem(response, 201);
    return addedOrder;
  } catch (error) {
    console.log(order);
    console.log(error);
    return error.message;
  }
};

const updateOrder = async function(order) {
  try {
    //console.log(order);
    const response = await axios.put(`${API}/orders?id=${order.id}`, order);
    parseItem(response, 200);
    return order;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const deleteOrder = async function(order) {
  try {
    const response = await axios.delete(`${API}/orders?id=${order.id}`, order);
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getItems = async function() {
  try {
    const response = await axios.get(`${API}/items`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const addItem = async function(item) {
  try {
    const response = await axios.post(`${API}/items`, item);
    const addedItem = parseItem(response, 201);
    return addedItem;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateItem = async function(item) {
  try {
    const response = await axios.put(`${API}/items?id=${item.id}`, item);
    parseItem(response, 200);
    return item;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteItem = async function(item) {
  try {
    const response = await axios.delete(`${API}/items?id=${item.id}`, item);
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getPackerSchedule = async function(filter) {
  try {
    const response = await axios.get(`${API}/packerschedule?filter=${filter}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const addPackerSchedule = async function(packerSchedule) {
  try {
    const response = await axios.post(`${API}/packerschedule`, packerSchedule);
    const addedItem = parseItem(response, 201);
    return addedItem;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updatePackerSchedule = async function(packerSchedule) {
  try {
    const response = await axios.put(`${API}/packerschedule?id=${packerSchedule.id}`, packerSchedule);
    parseItem(response, 200);
    return packerSchedule;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deletePackerSchedule = async function(packerSchedule) {
  try {
    const response = await axios.delete(`${API}/packerschedule?id=${packerSchedule.id}`, packerSchedule);
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Purchase Order
const getPurchaseOrder = async function() {
  try {
    const response = await axios.get(`${API}/purchaseorder`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getPurchaseOrderByOrderId = async function(orderId) {
  try {
    const response = await axios.get(
      `${API}/purchaseorderbyorderid/${orderId}`
    );
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const addPurchaseOrder = async function(purchaseOrder) {
  try {
    //console.log(purchaseOrder);
    const response = await axios.post(`${API}/purchaseorder`, purchaseOrder);
    const addedPurchaseOrder = parseItem(response, 201);
    // console.log(addedPurchaseOrder);
    return addedPurchaseOrder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updatePurchaseOrder = async function(purchaseOrder) {
  try {
    const response = await axios.put(
      `${API}/purchaseorder?id=${purchaseOrder.id}`,
      purchaseOrder
    );    
    parseItem(response, 200);
    return purchaseOrder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateActQty = async function(orderId) {
  try {    
    const response = await axios.post(
      `${API}/purchaseorder/calcQty?orderId=${orderId}`
    );
    parseItem(response, 200);    
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deletePurchaseOrder = async function(purchaseOrder) {
  try {
    const response = await axios.delete(
      `${API}/purchaseorder?id=${purchaseOrder.id}`,
      purchaseOrder
    );
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sendEmailOrderPlaced = async function(orderId, userId) {
  try {    
    const response = await axios.post(
      `${API}/purchaseorder/sendemailOrderPlaced?orderId=${orderId}&userId=${userId}`,
    );
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sendEmailConsolidatedOrder = async function(orderId, userId) {
  try {    
    const response = await axios.post(
      `${API}/purchaseorder/sendemailConsolidatedOrder?orderId=${orderId}&userId=${userId}`,
    );    
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sendEmailPurchaseOrder = async function(purchaseOrder, fromUserId) {
  try {
    const response = await axios.post(
      `${API}/purchaseorder/sendemail?toUserId=${purchaseOrder.userId}&orderId=${purchaseOrder.orderId}&fromUserId=${fromUserId}`
    );
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Bulk Order
const getBulkOrder = async function() {
  try {
    const response = await axios.get(`${API}/bulkorder`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getBulkOrderByOrderId = async function(orderId) {
  try {
    const response = await axios.get(`${API}/bulkorderbyorderid/${orderId}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getItemPrice = async function(itemId) {
  try {
    const response = await axios.get(`${API}/itempricebyorder/${itemId}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getPriceByOrder = async function(orderId) {
  try {
    const response = await axios.get(`${API}/getPriceByOrder/${orderId}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getItemPriceHistory = async function(itemId) {
  try {
    const response = await axios.get(`${API}/getItemPriceHistory/${itemId}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};

const getUserOrder = async function(userId) {
  try {
    const response = await axios.get(`${API}/getUserOrder/${userId}`);
    let data = parseList(response);
    return data;
  } catch (error) {
    return [];
  }
};


const addBulkOrder = async function(bulkOrder) {
  try {
    console.log(bulkOrder);
    const response = await axios.post(`${API}/bulkorder`, bulkOrder);
    const addedBulkOrder = parseItem(response, 201);
    console.log(addedBulkOrder);
    return addedBulkOrder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateBulkOrder = async function(bulkOrder) {
  try {
    //console.log(bulkOrder);
    const response = await axios.put(
      `${API}/bulkorder?id=${bulkOrder.id}`,
      bulkOrder
    );
    parseItem(response, 200);
    return bulkOrder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteBulkOrder = async function(bulkOrder) {
  try {
    const response = await axios.delete(
      `${API}/bulkorder?id=${bulkOrder.id}`,
      bulkOrder
    );
    let data = parseList(response);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const parseList = (response) => {
  if (response.status !== 200) throw Error(response.data);
  if (!response) return [];
  let list = response.data;

  if (typeof list !== "object") {
    list = [];
  }
  return list;
};

export const parseItem = (response, code) => {
  //console.log(response);
  if (response.status !== code) throw Error(response);
  let item = response;
  if (typeof item !== "object") {
    item = undefined;
  }
  return item.data;
};

export const dataService = {
  signIn,
  register,
  updateUser,
  getUserData,
  getAllUsers,
  getOrderStatus,
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getPackerSchedule,
  addPackerSchedule,
  updatePackerSchedule,
  deletePackerSchedule,
  getPurchaseOrder,
  getPurchaseOrderByOrderId,
  addPurchaseOrder,
  updatePurchaseOrder,
  updateActQty,
  deletePurchaseOrder,
  sendEmailConsolidatedOrder,
  sendEmailOrderPlaced,
  sendEmailPurchaseOrder,
  getBulkOrder,
  getBulkOrderByOrderId,
  addBulkOrder,
  updateBulkOrder,
  deleteBulkOrder,
  getItemPrice,
  getPriceByOrder,
  getUserOrder,
  getItemPriceHistory
};
