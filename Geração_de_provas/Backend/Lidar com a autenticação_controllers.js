const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Professor } = require('../models'); // Exemplo: ajuste conforme o seu modelo
require('dotenv').config(); // Para carregar variáveis de ambiente (JWT_SECRET)

exports.loginProfessor = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o professor existe com base no email
    const professor = await Professor.findOne({ where: { email } });

    // Se o professor não for encontrado ou a senha estiver incorreta
    if (!professor || !(await bcrypt.compare(senha, professor.senha))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT (com uma chave secreta armazenada em variável de ambiente)
    const token = jwt.sign({ userId: professor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token ao cliente
    res.json({ token });
  } catch (error) {
    // Tratamento de erros
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
