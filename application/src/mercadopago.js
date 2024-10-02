// mercadopago.js
const mercadopago = require('mercadopago');

// Adicione suas credenciais
mercadopago.configurations.setAccessToken('YOUR_ACCESS_TOKEN');

module.exports = mercadopago;