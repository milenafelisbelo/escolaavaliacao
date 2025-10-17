const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Buscar todas as turmas
const getTurmas = async (req, res) => {
  try {
    const turmas = await prisma.turma.findMany({
      include: { professor: true, atividades: true },
    });
    res.json(turmas);
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    res.status(500).json({ error: "Erro ao buscar turmas", detalhes: error.message });
  }
};

// Buscar turma por ID
const getTurmaById = async (req, res) => {
  const { id } = req.params;
  try {
    const turma = await prisma.turma.findUnique({
      where: { id: Number(id) },
      include: { professor: true, atividades: true },
    });

    if (!turma) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    res.json(turma);
  } catch (error) {
    console.error("Erro ao buscar a turma:", error);
    res.status(500).json({ error: "Erro ao buscar a turma", detalhes: error.message });
  }
};

// Criar nova turma
const createTurma = async (req, res) => {
  const { nome, professorId } = req.body;

  try {
    // Verifica se o professor existe
    const professor = await prisma.professor.findUnique({ where: { id: Number(professorId) } });
    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    const novaTurma = await prisma.turma.create({
      data: {
        nome,
        professor: { connect: { id: Number(professorId) } },
      },
    });

    res.status(201).json(novaTurma);
  } catch (error) {
    console.error("Erro ao criar a turma:", error);
    res.status(500).json({ error: "Erro ao criar a turma", detalhes: error.message });
  }
};

// Atualizar turma
const updateTurma = async (req, res) => {
  const { id } = req.params;
  const { nome, professorId } = req.body;

  try {
    // Verifica se a turma existe
    const turmaExistente = await prisma.turma.findUnique({ where: { id: Number(id) } });
    if (!turmaExistente) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    // Verifica se o professor existe
    const professor = await prisma.professor.findUnique({ where: { id: Number(professorId) } });
    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    const updatedTurma = await prisma.turma.update({
      where: { id: Number(id) },
      data: {
        nome,
        professor: { connect: { id: Number(professorId) } },
      },
    });

    res.json(updatedTurma);
  } catch (error) {
    console.error("Erro ao atualizar a turma:", error);
    res.status(500).json({ error: "Erro ao atualizar a turma", detalhes: error.message });
  }
};

// Deletar turma
const deleteTurma = async (req, res) => {
  const { id } = req.params;
  try {
    // Deletar atividades da turma
    await prisma.atividade.deleteMany({
      where: { turmaId: parseInt(id) }
    });

    // Agora deletar a turma
    await prisma.turma.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Turma deletada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar a turma", detalhes: error.message });
  }
};

// Buscar turmas de um professor específico
const getTurmaByProfessor = async (req, res) => {
  const { id } = req.params;

  try {
    const turmas = await prisma.turma.findMany({
      where: { professorId: Number(id) },
      include: { atividades: true },
    });

    res.json(turmas);
  } catch (error) {
    console.error("Erro ao buscar turmas do professor:", error);
    res.status(500).json({ error: "Erro ao buscar turmas do professor", detalhes: error.message });
  }
};

module.exports = {
  getTurmas,
  getTurmaById,
  createTurma,
  updateTurma,
  deleteTurma,
  getTurmaByProfessor,
};