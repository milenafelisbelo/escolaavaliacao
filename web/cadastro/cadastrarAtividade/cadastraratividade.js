document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const turmaId = localStorage.getItem("turmaId");

    if (!turmaId) {
      alert("Erro: ID da turma não encontrado. Selecione uma turma primeiro.");
      return;
    }

    if (!titulo) {
      alert("Por favor, insira o título da atividade.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: titulo,
          turmaId: Number(turmaId),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a atividade");
      }

      const atividadeCriada = await response.json();
      console.log("Atividade criada:", atividadeCriada);

      alert("Atividade cadastrada com sucesso!");
      form.reset();

      window.location.href = "../../dashboard/dashboard.html";
    } catch (error) {
      console.error("Erro ao cadastrar atividade:", error);
      alert("Falha ao cadastrar atividade. Tente novamente mais tarde.");
    }
  });
});
