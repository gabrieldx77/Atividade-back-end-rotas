
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());


let alunos = [
    { id: 1, nome: 'Ana', curso: 'Computação' },
    { id: 2, nome: 'Pedro', curso: 'Sistemas de Informação' }
];


let proximoId = 3;


function validarAluno(req, res, next) {
    const { nome, curso } = req.body;

    if (
        typeof nome !== 'string' ||
        nome.trim() === '' ||
        typeof curso !== 'string' ||
        curso.trim() === ''
    ) {
        return res.status(400).json({
            erro: 'Nome e curso são obrigatórios e devem ser textos não vazios.'
        });
    }

    next();
}


app.get('/alunos', (req, res) => {
    res.status(200).json(alunos);
});


app.get('/alunos/:id', (req, res) => {
    const id = Number(req.params.id);

    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        return res.status(404).json({
            erro: 'Aluno não encontrado.'
        });
    }

    res.status(200).json(aluno);
});


app.post('/alunos', validarAluno, (req, res) => {
    const { nome, curso } = req.body;

    const novoAluno = {
        id: proximoId++,
        nome: nome.trim(),
        curso: curso.trim()
    };

    alunos.push(novoAluno);

    res.status(201).json(novoAluno);
});


app.put('/alunos/:id', validarAluno, (req, res) => {
    const id = Number(req.params.id);

    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        return res.status(404).json({
            erro: 'Aluno não encontrado.'
        });
    }

    aluno.nome = req.body.nome.trim();
    aluno.curso = req.body.curso.trim();

    res.status(200).json(aluno);
});

app.delete('/alunos/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = alunos.findIndex(aluno => aluno.id === id);

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Aluno não encontrado.'
        });
    }

    alunos.splice(indice, 1);

    res.status(204).send();
});


app.use((err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        erro: 'Ocorreu um erro interno no servidor.'
    });
});


app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
