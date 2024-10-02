const express = require('express');
const router = express.Router();
const mercadopago = require('./mercadopago');
const { addOrder, getOrder, getAllOrders, updateOrderStatus, removeOrder } = require('./orders');
const { addProduct, getProducts, getProductById, removeProduct, updateProduct } = require('./products');
const { v4: uuidv4 } = require('uuid');
const generateReceipt = require('./receipt');
const printReceipt = require('./printer');

// Middleware de validação para produtos
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  next();
};

// Middleware de validação para pedidos
const validateOrder = (req, res, next) => {
  const { items, payer } = req.body;
  if (!items || !payer) {
    return res.status(400).json({ error: 'Itens e pagador são obrigatórios' });
  }
  next();
};

router.post('/create_preference', validateOrder, async (req, res) => {
  const { items, payer } = req.body;

  let preference = {
    items: items,
    payer: payer,
    back_urls: {
      success: 'https://www.your-site.com/success',
      failure: 'https://www.your-site.com/failure',
      pending: 'https://www.your-site.com/pending'
    },
    auto_return: 'approved',
    notification_url: 'https://www.your-site.com/api/notifications'
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    const order = {
      id: uuidv4(),
      items: items,
      payer: payer,
      status: 'Recebido',
      preferenceId: response.body.id
    };
    addOrder(order);

    // Gerar e imprimir o comprovante
    const filePath = generateReceipt(order);
    printReceipt(filePath);

    res.json({ id: order.id, preferenceId: response.body.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/notifications', (req, res) => {
  const payment = req.query;

  // Verifique o status do pagamento
  mercadopago.payment.findById(payment['data.id'])
    .then(response => {
      const paymentStatus = response.body.status;
      const orderId = response.body.external_reference;

      // Atualize o status do pedido com base no status do pagamento
      if (paymentStatus === 'approved') {
        updateOrderStatus(orderId, 'Pago');
      } else if (paymentStatus === 'pending') {
        updateOrderStatus(orderId, 'Pendente');
      } else if (paymentStatus === 'rejected') {
        updateOrderStatus(orderId, 'Rejeitado');
      }

      res.sendStatus(200);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.get('/order/:id', (req, res) => {
  const order = getOrder(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Pedido não encontrado');
  }
});

router.put('/order/:id/status', (req, res) => {
  const { status } = req.body;
  const order = updateOrderStatus(req.params.id, status);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Pedido não encontrado');
  }
});

// Rota para listar todos os pedidos
router.get('/orders', (req, res) => {
  const orders = getAllOrders();
  res.json(orders);
});

// Rota para excluir um pedido
router.delete('/order/:id', (req, res) => {
  const order = removeOrder(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Pedido não encontrado');
  }
});

// Rotas para gerenciar produtos
router.post('/products', validateProduct, (req, res) => {
  const { name, description, price, category } = req.body;
  const product = {
    id: uuidv4(),
    name,
    description,
    price,
    category
  };
  addProduct(product);
  res.status(201).json(product);
});

router.get('/products', (req, res) => {
  const products = getProducts();
  res.json(products);
});

router.get('/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Produto não encontrado');
  }
});

router.delete('/products/:id', (req, res) => {
  const product = removeProduct(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Produto não encontrado');
  }
});

router.put('/products/:id', validateProduct, (req, res) => {
  const updatedProduct = req.body;
  const product = updateProduct(req.params.id, updatedProduct);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Produto não encontrado');
  }
});

module.exports = router;