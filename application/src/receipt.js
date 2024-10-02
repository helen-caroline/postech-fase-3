const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReceipt = (order) => {
  const doc = new PDFDocument();
  const filePath = `./receipts/receipt_${order.id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text('Comprovante de Pedido', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`Pedido ID: ${order.id}`);
  doc.text(`Cliente: ${order.payer.email}`);
  doc.moveDown();

  order.items.forEach(item => {
    doc.fontSize(14).text(`${item.title} - ${item.quantity} x R$${item.unit_price.toFixed(2)}`);
  });

  doc.moveDown();
  doc.fontSize(18).text(`Total: R$${order.items.reduce((total, item) => total + item.unit_price * item.quantity, 0).toFixed(2)}`);

  doc.end();

  return filePath;
};

module.exports = generateReceipt;