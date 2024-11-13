const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos e habilitar CORS
app.use(cors());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'busca-questoes.html'));
});

// Rota para cadastrar uma nova questão
app.post('/api/cadastrar-questao', (req, res) => {
    const { assunto, dificuldade, tipo, enunciado } = req.body;

    if (!assunto || !dificuldade || !tipo || !enunciado) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const novaQuestao = { assunto, dificuldade, tipo, enunciado };
    const questoesPath = path.join(__dirname, 'data', 'questoes.json');

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

// Rota para busca de questões
app.get('/api/questoes', (req, res) => {
    const assunto = req.query.assunto || '';
    const dificuldade = req.query.dificuldade || '';
    const tipo = req.query.tipo || '';

    const questoesPath = path.join(__dirname, 'data', 'questoes.json');

    fs.readFile(questoesPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao acessar o banco de dados.' });
        }

        let questoes = JSON.parse(data);

        const questoesFiltradas = questoes.filter(questao => {
            return (
                (!assunto || questao.assunto.includes(assunto)) &&
                (!dificuldade || questao.dificuldade === dificuldade) &&
                (!tipo || questao.tipo === tipo)
            );
        });

        // Retornar 200 e um array vazio se não houver questões filtradas
        res.json(questoesFiltradas);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
