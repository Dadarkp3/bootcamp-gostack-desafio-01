const express = require("express");
const server = express();

server.use(express.json());

const projects = [];

/*
	Global Middleware 
*/

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

/*
	Local Middleware
*/

/*
  Checa se o id enviado como parametro existe no array, se existir
  adiciona o projeto a requisição. Se não, envia mensagem de erro
  pro usuário.
  Router Params: id;
*/

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);
  if (!project) {
    return res.status(400).json({
      error: "Project not found."
    });
  }
  req.project = project;
  return next();
}

function checkNewTask(req, res, next) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      error: "Requisition expected a new task."
    });
  }
  req.title = title;
  return next();
}

//Rotas

/*
	Cria um novo projeto e adiciona ao array projects.
	Body Params Exemplo:
	{ 
		"id": 2, 
		"title": "Novo projeto" 
	}
*/

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    task: []
  });
  res.json(projects);
});

/* 
	Retornar todos os objetos no array projects 
*/

server.get("/projects", (req, res) => {
  return res.json(projects);
});

/*
  Edita o projeto com o id passado por parâmetro.
  Router Params: id
  Body Params: 
  {
    "title": "Novo nome"
  }
*/

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;
  req.project.title = title;
  return res.send();
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const index = projects.indexOf(req.project);
  projects.splice(index, 1);
  return res.json(projects);
});

server.post(
  "/projects/:id/tasks",
  checkProjectInArray,
  checkNewTask,
  (req, res) => {
    const { project, title } = req;
    project.tass.push(title);
    return res.json(project);
  }
);

server.listen(4000);
