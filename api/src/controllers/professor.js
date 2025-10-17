const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Buscar todos os professores
const getProfessores = async (req, res) => {
  try {
    const professores = await prisma.professor.findMany({
      include: { turmas: true },
    });
    res.json(professores);
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    res.status(500).json({ error: "Erro ao buscar professores", detalhes: error.message });
  }
};

// Buscar professor por ID
const getProfessorById = async (req, res) => {
  const { id } = req.params;
  try {
    const professor = await prisma.professor.findUnique({
      where: { id: Number(id) },
      include: { turmas: true },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    res.json(professor);
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    res.status(500).json({ error: "Erro ao buscar professor", detalhes: error.message });
  }
};

// Criar novo professor
const createProfessor = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Campos 'nome', 'email' e 'senha' são obrigatórios" });
  }

  try {
    // Verifica se já existe um professor com o mesmo email
    const existing = await prisma.professor.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Já existe um professor com esse email" });
    }

    const newProfessor = await prisma.professor.create({
      data: { nome, email, senha },
    });

    res.status(201).json(newProfessor);
  } catch (error) {
    console.error("Erro ao criar professor:", error);
    res.status(500).json({ error: "Erro ao criar professor", detalhes: error.message });
  }
};

// Atualizar professor
const updateProfessor = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Campos 'nome', 'email' e 'senha' são obrigatórios" });
  }

  try {
    // Verifica se o professor existe
    const exists = await prisma.professor.findUnique({ where: { id: Number(id) } });
    if (!exists) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    // Verifica se outro professor já usa o email
    const emailOwner = await prisma.professor.findUnique({ where: { email } });
    if (emailOwner && emailOwner.id !== Number(id)) {
      return res.status(400).json({ error: "Email já existe" });
    }

    const updatedProfessor = await prisma.professor.update({
      where: { id: Number(id) },
      data: { nome, email, senha },
    });

    res.json(updatedProfessor);
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    res.status(500).json({ error: "Erro ao atualizar professor", detalhes: error.message });
  }
};

// Deletar professor
const deleteProfessor = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.professor.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar professor:", error);
    res.status(500).json({ error: "Erro ao deletar professor", detalhes: error.message });
  }
};

// Login do professor
const loginProfessor = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const professor = await prisma.professor.findUnique({ where: { email } });

    if (!professor || professor.senha !== senha) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      professor: {
        id: professor.id,
        nome: professor.nome,
      },
    });
  } catch (error) {
    console.error("Erro no login do professor:", error);
    return res.status(500).json({ message: "Erro interno do servidor", detalhes: error.message });
  }
};

module.exports = {
  getProfessores,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  loginProfessor,
};