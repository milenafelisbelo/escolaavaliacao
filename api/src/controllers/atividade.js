const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Buscar todas as atividades
const getAtividades = async (req, res) => {
  try {
    const atividades = await prisma.atividade.findMany({
      include: { turma: true },
    });
    res.json(atividades);
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    res.status(500).json({ error: "Erro ao buscar atividades", detalhes: error.message });
  }
};

// Buscar atividades de uma turma específica
const getAtividadesByTurma = async (req, res) => {
  const { id } = req.params;
  try {
    const atividades = await prisma.atividade.findMany({
      where: { turmaId: Number(id) },
      include: { turma: true },
    });
    res.json(atividades);
  } catch (error) {
    console.error("Erro ao buscar atividades por turma:", error);
    res.status(500).json({ error: "Erro ao buscar atividades por turma", detalhes: error.message });
  }
};

// Criar nova atividade
const createAtividade = async (req, res) => {
  const { titulo, turmaId } = req.body;

  // Validação de campos obrigatórios
  if (!titulo || !turmaId) {
    return res.status(400).json({ error: "Campos 'titulo' e 'turmaId' são obrigatórios" });
  }

  try {
    // Verifica se a turma existe
    const turma = await prisma.turma.findUnique({ where: { id: Number(turmaId) } });
    if (!turma) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    const novaAtividade = await prisma.atividade.create({
      data: {
        titulo,
        turma: { connect: { id: Number(turmaId) } },
      },
    });

    res.status(201).json(novaAtividade);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ error: "Erro ao criar atividade", detalhes: error.message });
  }
};

// Atualizar atividade
const updateAtividade = async (req, res) => {
  const { id } = req.params;
  const { titulo, turmaId } = req.body;

  // Validação de campos obrigatórios
  if (!titulo || !turmaId) {
    return res.status(400).json({ error: "Campos 'titulo' e 'turmaId' são obrigatórios" });
  }

  try {
    // Verifica se a atividade existe
    const atividadeExistente = await prisma.atividade.findUnique({ where: { id: Number(id) } });
    if (!atividadeExistente) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    // Verifica se a turma existe
    const turma = await prisma.turma.findUnique({ where: { id: Number(turmaId) } });
    if (!turma) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id: Number(id) },
      data: {
        titulo,
        turma: { connect: { id: Number(turmaId) } },
      },
    });

    res.json(atividadeAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    res.status(500).json({ error: "Erro ao atualizar atividade", detalhes: error.message });
  }
};

// Deletar atividade
const deleteAtividade = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.atividade.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    res.status(500).json({ error: "Erro ao deletar atividade", detalhes: error.message });
  }
};

module.exports = {
  getAtividades,
  getAtividadesByTurma,
  createAtividade,
  updateAtividade,
  deleteAtividade,
};