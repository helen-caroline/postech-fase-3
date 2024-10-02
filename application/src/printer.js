const printer = require('node-printer');

const printReceipt = (filePath) => {
  const printJob = printer.printFile({
    filename: filePath,
    success: (jobID) => {
      console.log(`Impressão iniciada com ID: ${jobID}`);
    },
    error: (err) => {
      console.error(`Erro ao imprimir: ${err}`);
    }
  });

  printJob.on('end', () => {
    console.log('Impressão concluída');
  });
};

module.exports = printReceipt;