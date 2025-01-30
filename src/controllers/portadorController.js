const { Portador, validatePortador } = require('../models/Portador');

const criarPortador = async (req, res) => {
  const { error } = validatePortador(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cpfLimpo = req.body.cpf.toString().replace(/\D/g, "");

  const portadorExistente = await Portador.findOne({ cpf: cpfLimpo });
  if (portadorExistente) return res.status(400).send('CPF já cadastrado.');

  let portador = new Portador({
    nome: req.body.nome,
    cpf: cpfLimpo
  });
  portador = await portador.save();

  res.send(portador);
};


const removerPortador = async (req, res) => {
  const cpfLimpo = req.params.cpf.replace(/\D/g, ""); // Remove pontos e hífen
  const portador = await Portador.findOneAndDelete({ cpf: cpfLimpo });
  if (!portador) return res.status(404).send('Portador não encontrado');
  res.send('Portador removido');
};


module.exports = { criarPortador, removerPortador };
