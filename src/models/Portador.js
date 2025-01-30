const mongoose = require('mongoose');
const Joi = require('joi');

const portadorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true }
});

// Hook para limpar a formatação do CPF antes de salvar
portadorSchema.pre('save', function (next) {
  this.cpf = this.cpf.replace(/\D/g, '');
  next();
});

const Portador = mongoose.model('Portador', portadorSchema);

// validação do Portador
const validatePortador = (portador) => {
  const schema = Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string()
      .pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/) // o regex aceita CPF formatado ou só números
      .required()
  });

  return schema.validate(portador);
};

module.exports = { Portador, validatePortador };
