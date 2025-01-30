const express = require('express');
const router = express.Router();
const { criarPortador, removerPortador } = require('../controllers/portadorController');

router.post('/', criarPortador);
router.delete('/:cpf', removerPortador);

module.exports = router;
