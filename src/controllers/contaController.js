const Conta = require('../models/Conta');
const { Portador } = require('../models/Portador');

const limparCPF = (cpf) => {
  if (!cpf) {
    throw new Error('CPF não fornecido');
  }
  return cpf.replace(/\D/g, '');
};

// Criar conta
const criarConta = async (req, res) => {
  const { cpf, numero, agencia } = req.body;
  const cpfLimpo = limparCPF(cpf);

  const portador = await Portador.findOne({ cpf: cpfLimpo });
  if (!portador) return res.status(404).send('Portador não encontrado.');

  let conta = new Conta({
    portadorCpf: cpfLimpo,
    numero,
    agencia
  });

  conta = await conta.save();
  res.send(conta);
};

// Consultar detalhes da conta
const consultarConta = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  res.send(conta);
};

const deposito = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  if (conta.status === 'bloqueada' || conta.status === 'fechada') return res.status(400).send('Conta bloqueada ou fechada.');

  // Garantir que o valor seja numérico
  const valorDepositado = Number(req.body.valor);
  if (isNaN(valorDepositado)) return res.status(400).send('Valor inválido para depósito.');

  conta.saldo += valorDepositado;
  conta.extrato.push({ tipo: 'deposito', valor: valorDepositado });
  await conta.save();
  res.send(conta);
};


// Realizar saque
const saque = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  if (conta.status === 'bloqueada' || conta.status === 'fechada') return res.status(400).send('Conta bloqueada ou fechada.');

  // Garantir que o valor do saque seja numérico
  const valorSaque = Number(req.body.valor);
  if (isNaN(valorSaque)) return res.status(400).send('Valor inválido para saque.');

  if (conta.saldo < valorSaque) return res.status(400).send('Saldo insuficiente.');
  if (valorSaque > conta.limiteDiarioSaque) return res.status(400).send('Limite de saque diário excedido.');

  conta.saldo -= valorSaque;
  conta.extrato.push({ tipo: 'saque', valor: valorSaque });
  await conta.save();
  res.send(conta);
};


// Bloquear conta
const bloquearConta = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  conta.status = 'bloqueada';
  await conta.save();
  res.send(conta);
};

// Desbloquear conta
const desbloquearConta = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  conta.status = 'ativa';
  await conta.save();
  res.send(conta);
};

// Fechar conta
const fecharConta = async (req, res) => {
  const conta = await Conta.findOne({ numero: req.params.numero });
  if (!conta) return res.status(404).send('Conta não encontrada.');
  conta.status = 'fechada';
  await conta.save();
  res.send(conta);
};

module.exports = { criarConta, consultarConta, deposito, saque, bloquearConta, desbloquearConta, fecharConta };
