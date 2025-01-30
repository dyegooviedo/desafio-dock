const express = require('express');
const router = express.Router();
const { criarConta, consultarConta, deposito, saque, bloquearConta, desbloquearConta, fecharConta } = require('../controllers/contaController');

router.post('/', criarConta);
router.get('/:numero', consultarConta);
router.post('/:numero/deposito', deposito);
router.post('/:numero/saque', saque);
router.put('/:numero/bloquear', bloquearConta);
router.put('/:numero/desbloquear', desbloquearConta);
router.delete('/:numero', fecharConta);

module.exports = router;
