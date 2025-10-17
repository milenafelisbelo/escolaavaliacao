const express = require("express");
const routes = express.Router();

const professorController = require("./controllers/professor");
const turmaController = require("./controllers/turma");
const atividadeController = require("./controllers/atividade");

routes.get("/", (req, res) => {
  res.send("Feito por Milena");
});

routes.get("/professores", professorController.getProfessores);
routes.get("/professores/:id", professorController.getProfessorById);
routes.post("/professores", professorController.createProfessor);
routes.patch("/professores/:id", professorController.updateProfessor);
routes.delete("/professores/:id", professorController.deleteProfessor);
routes.post("/professores/login", professorController.loginProfessor);

routes.get("/turmas", turmaController.getTurmas);
routes.get("/turmas/:id", turmaController.getTurmaById);
routes.post("/turmas", turmaController.createTurma);
routes.patch("/turmas/:id", turmaController.updateTurma);
routes.delete("/turmas/:id", turmaController.deleteTurma);
routes.get("/turmas/professor/:id", turmaController.getTurmaByProfessor);

routes.get("/atividades", atividadeController.getAtividades);
routes.get("/atividades/turma/:id", atividadeController.getAtividadesByTurma);
routes.post("/atividades", atividadeController.createAtividade);
routes.patch("/atividades/:id", atividadeController.updateAtividade);
routes.delete("/atividades/:id", atividadeController.deleteAtividade);

module.exports = routes;