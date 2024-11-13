
//Código do servidor e APIs

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Professor } = require('./models'); // Exemplo de importação do modelo de professor

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o professor no banco de dados pelo email
    const professor = await Professor.findOne({ where: { email } });
    
    // Verifica se o professor existe e se a senha está correta
    if (!professor || !(await bcrypt.compare(senha, professor.senha))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT com expiração de 1 hora
    const token = jwt.sign({ userId: professor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token para o cliente
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});
