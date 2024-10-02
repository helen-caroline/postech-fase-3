const request = require('supertest');
const express = require('express');
const routes = require('../routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  let productId;
  let orderId;

  // Teste para adicionar um novo produto
  it('deve adicionar um novo produto', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Hambúrguer',
        description: 'Delicioso hambúrguer com queijo',
        price: 20.00,
        category: 'Lanche'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Hambúrguer');
    productId = response.body.id;
  });

  // Teste para listar todos os produtos
  it('deve listar todos os produtos', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste para atualizar um produto
  it('deve atualizar um produto', async () => {
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send({
        name: 'Hambúrguer Atualizado',
        description: 'Delicioso hambúrguer com queijo e bacon',
        price: 25.00,
        category: 'Lanche'
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Hambúrguer Atualizado');
  });

  // Teste para excluir um produto
  it('deve excluir um produto', async () => {
    const response = await request(app).delete(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  // Teste para adicionar um novo pedido
  it('deve adicionar um novo pedido', async () => {
    const response = await request(app)
      .post('/api/create_preference')
      .send({
        items: [
          {
            title: 'Hambúrguer',
            quantity: 1,
            unit_price: 20.00
          }
        ],
        payer: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        }
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    orderId = response.body.id;
  });

  // Teste para listar todos os pedidos
  it('deve listar todos os pedidos', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste para atualizar o status de um pedido
  it('deve atualizar o status de um pedido', async () => {
    const response = await request(app)
      .put(`/api/order/${orderId}/status`)
      .send({ status: 'Preparando' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Preparando');
  });

  // Teste para excluir um pedido
  it('deve excluir um pedido', async () => {
    const response = await request(app).delete(`/api/order/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
  });
});