const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

// Caminho para a página de login e de outras páginas
const loginPagePath = path.join(__dirname, 'pages', 'Login1.html');
const questoesPath = path.join(__dirname, 'data', 'questoes.json');

// Middleware para servir arquivos estáticos e habilitar CORS
app.use(cors());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para redirecionar para a página de login
app.get('/', (req, res) => {
    res.redirect('/Login1.html');  // Redireciona diretamente para a página de login
});

// Rota para a página de login
app.get('/Login1', (req, res) => {
    res.sendFile(loginPagePath); // Serve a página de login
});

// Rota para a página de busca de questões
app.get('/busca-questoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'busca-questoes.html'));
});

// Rota para a página de cadastro de questões
app.get('/cadastro-questoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cadastro-questoes.html'));
});

// Rota para a página de visualização de questões
app.get('/visualizar-questoes', (req, res) => {
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
app.post('/api/cadastrar-questao', (req, res) => {
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
app.delete('/api/questoes/:id', (req, res) => {
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
