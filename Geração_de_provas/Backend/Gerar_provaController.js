const Prova = require('../models/Prova');

exports.gerarProva = async (req, res) => {
  const { titulo, instrucoes, questoesSelecionadas } = req.body;

  // Verificação básica dos dados
  if (!titulo || !instrucoes || !questoesSelecionadas || questoesSelecionadas.length === 0) {
    return res.status(400).json({ message: 'Título, instruções e questões são obrigatórios.' });
  }

  try {
    // Criação da nova prova
    const prova = new Prova({ titulo, instrucoes, questoes: questoesSelecionadas });
    
    // Salvar a prova no banco de dados
    await prova.save();

    // Responder com sucesso
    res.status(201).json({ message: 'Prova criada com sucesso', prova });
  } catch (error) {
    // Tratamento de erro
    console.error('Erro ao criar prova:', error);
    res.status(500).json({ message: 'Erro ao criar a prova', error: error.message });
  }
};
