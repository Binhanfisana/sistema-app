const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Servir arquivos est?ticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de autentica??o
app.use('/api/auth', authRoutes);

// Rota para p?gina principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
                                                                                                               