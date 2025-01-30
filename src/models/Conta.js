const mongoose = require('mongoose');

const gerarNumeroConta = () => {
  const numero = Math.floor(Math.random() * 9000000000) + 1000000000;
  return numero.toString();
};

const contaSchema = new mongoose.Schema({
  portadorCpf: { type: String, required: true, ref: 'Portador' },
  saldo: { type: Number, default: 0 },
  numero: { 
    type: String, 
    required: true, 
    unique: true,
    default: gerarNumeroConta
  },
  agencia: { type: String, required: true, default: '001' },
  status: { type: String, enum: ['ativa', 'bloqueada', 'fechada'], default: 'ativa' },
  limiteDiarioSaque: { type: Number, default: 2000 },
  extrato: [{
    data: { type: Date, default: Date.now },
    tipo: { type: String, enum: ['deposito', 'saque'] },
    valor: Number
  }]
});

const Conta = mongoose.model('Conta', contaSchema);

module.exports = Conta;
