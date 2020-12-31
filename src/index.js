const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(cors()); // para desenvolvimento

// para o express utilizar json no corpo das requisições
app.use(express.json());

// banco de dados
const projects = [];

// Middleware que intercepta requisições
function logRequests(request, response, next) {
    const { method, url } = request;
    // as acentos graves são para adicionar variáveis
    const logLable = `[${method.toUpperCase()}] ${url}`;

    console.log(logLable);
    // O next é a próxima função/rota a ser chamada
    // (a original, que o middleware interceptou)
    return next(); // próximo middelware
}

app.use(logRequests);

app.get('/', (request, response) => {
    return response.send('Hello World')
});

app.get('/projects', (request, response) => {
    const { title } = request.query; // filter

    // includes() verificar se o texto title está contido
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
   
    const project = { id: uuid(), title, owner }

    projects.push(project);
    
    return response.json(project); // projeto que acabamos de criar
});

// parâmetro de rota
app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);
    if (projectIndex < 0) { // não encontrou
        // seta o código http para 400
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);
    if (projectIndex < 0) { // não encontrou
        // seta o código http para 400
        return response.status(400).json({ error: 'Project not found.' })
    }

    // splice: retirar informação do array (índice, quantas posições quer remover a partir do índice)
    projects.splice(projectIndex, 1);
    // respostas vazias devem retornar status 204
    return response.status(204).send();
});

app.listen(3333);