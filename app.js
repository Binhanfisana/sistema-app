const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
<<<<<<< HEAD
const { v4: uuidv4 } = require('uuid');
=======
const { v4: uuidv4 } = require('uuid'); // Biblioteca para gerar IDs únicos
const session = require('express-session');
const bcrypt = require('bcryptjs'); // Para criptografar senhas

>>>>>>> c1a3c052b30cf6e7b0a6ae45add3269e7f5b94d5
const app = express();
const PORT = 3000;

// Caminho para a página de login e de outras páginas
const loginPagePath = path.join(__dirname, 'pages', 'Login1.html');
const questoesPath = path.join(__dirname, 'data', 'questoes.json');

// Mock de dados de usuário para autenticação (normalmente viria de um banco de dados)
const users = [
    {
        username: 'professor123',
        password: bcrypt.hashSync('senha123', 10) // Senha criptografada
    }
];

// Middleware para servir arquivos estáticos e habilitar CORS
app.use(cors());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// Rota para redirecionar para a página de login
=======
// Configuração de sessões
app.use(session({
    secret: 'chave_secreta_para_sessao',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Altere para 'true' se estiver usando HTTPS
}));

// Função de middleware para autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Rota para a página inicial (index.html)
>>>>>>> c1a3c052b30cf6e7b0a6ae45add3269e7f5b94d5
app.get('/', (req, res) => {
    res.redirect('/Login1.html');  // Redireciona diretamente para a página de login
});

// Rota para a página de login
app.get('/Login1', (req, res) => {
    res.sendFile(loginPagePath); // Serve a página de login
});

// Rota para a página de login
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Rota para fazer login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username; // Cria a sessão
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Credenciais inválidas.' });
    }
});

// Rota para a página de busca de questões (protegida)
app.get('/busca-questoes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'busca-questoes.html'));
});

// Rota para a página de cadastro de questões (protegida)
app.get('/cadastro-questoes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cadastro-questoes.html'));
});

// Rota para a página de visualização de questões (protegida)
app.get('/visualizar-questoes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'visualizar-questoes.html'));
});

// Middleware de verificação de autenticação (exemplo com sessões)
// Aqui você pode colocar a lógica de autenticação já integrada
app.use((req, res, next) => {
    // Caso queira manter a autenticação, você pode integrar aqui
    // if (!req.session || !req.session.user) {
    //     return res.status(401).json({ message: 'Não autorizado' });
    // }
    next(); // Continuar se o usuário estiver autenticado
});

// Rota para cadastrar uma nova questão
app.post('/api/cadastrar-questao', isAuthenticated, (req, res) => {
    const { assunto, dificuldade, tipo, enunciado } = req.body;

    if (!assunto || !dificuldade || !tipo || !enunciado) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const novaQuestao = { 
        id: uuidv4(), 
        assunto, 
        dificuldade, 
        tipo, 
        enunciado 
    };

    fs.readFile(questoesPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao acessar o banco de dados.' });
        }

        let questoes = JSON.parse(data);
        questoes.push(novaQuestao);

        fs.writeFile(questoesPath, JSON.stringify(questoes, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao salvar a questão.' });
            }

            res.json({ message: 'Questão cadastrada com sucesso!' });
        });
    });
});

// Rota para buscar questões
app.get('/api/questoes', (req, res) => {
    const assunto = req.query.assunto || '';
    const dificuldade = req.query.dificuldade || '';
    const tipo = req.query.tipo || '';

    fs.readFile(questoesPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao acessar o banco de dados.' });
        }

        let questoes = JSON.parse(data);
        const questoesFiltradas = questoes.filter(questao => {
            return (
                (!assunto || questao.assunto.toLowerCase().includes(assunto.toLowerCase())) &&
                (!dificuldade || questao.dificuldade === dificuldade) &&
                (!tipo || questao.tipo === tipo)
            );
        });

        res.json(questoesFiltradas);
    });
});

// Rota para remover uma questão
app.delete('/api/questoes/:id', isAuthenticated, (req, res) => {
    const questaoId = req.params.id;

    fs.readFile(questoesPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao acessar o banco de dados.' });
        }

        let questoes = JSON.parse(data);
        const questaoIndex = questoes.findIndex(questao => questao.id === questaoId);

        if (questaoIndex === -1) {
            return res.status(404).json({ message: 'Questão não encontrada.' });
        }

        // Remover a questão
        questoes.splice(questaoIndex, 1);

        // Escrever no arquivo atualizado
        fs.writeFile(questoesPath, JSON.stringify(questoes, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao remover a questão.' });
            }

            res.json({ message: 'Questão removida com sucesso!' });
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
