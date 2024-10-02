let orders = [];

const addOrder = (order) => {
  orders.push(order);
  return order;
};

const getOrder = (id) => {
  return orders.find(order => order.id === id);
};

const getAllOrders = () => {
  return orders;
};

const updateOrderStatus = (id, status) => {
  const order = getOrder(id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
};

const removeOrder = (id) => {
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    return orders.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  addOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  removeOrder
};