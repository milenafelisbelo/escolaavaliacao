document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeTurma = document.getElementById("turma").value.trim();
    const idProfessor = localStorage.getItem("professorId");

    if (!idProfessor) {
      alert("Erro: ID do professor não encontrado. Faça login novamente.");
      return;
    }

    if (!nomeTurma) {
      alert("Por favor, insira o nome da turma.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeTurma,
          professorId: Number(idProfessor),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a turma");
      }

      const turmaCriada = await response.json();
      console.log("Turma criada:", turmaCriada);

      alert("Turma cadastrada com sucesso!");
      form.reset();

      window.location.href = "../../dashboard/dashboard.html";
    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
      alert("Falha ao cadastrar turma. Tente novamente mais tarde.");
    }
  });
});
