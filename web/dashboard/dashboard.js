const nomeprofessor = localStorage.getItem("professorNome");
const professornome = document.getElementById("professor-nome");

if (nomeprofessor) {
  professornome.textContent = "Bem-vindo, " + nomeprofessor;
} else {
  professornome.textContent = "Erro ao carregar professor";
}

const idProfessor = localStorage.getItem("professorId");

async function carregarTurmas() {
  try {
    const response = await fetch(
      `http://localhost:3001/turmas/professor/${idProfessor}`
    );
    if (!response.ok) throw new Error("Falha ao carregar turmas");

    const turmas = await response.json();
    console.log(turmas);

    const tabelaBody = document.querySelector("#tabela-turmas tbody");
    tabelaBody.innerHTML = "";

    turmas.forEach((turma) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${turma.id}</td>
        <td>${turma.nome}</td>
        <td><button class="ver-detalhes" data-id="${turma.id}">Ver detalhes</button></td>
        <td><button class="deletar-turma" data-id="${turma.id}">Deletar Turma</button></td>
      `;
      tabelaBody.appendChild(tr);
    });

    tabelaBody.addEventListener("click", async (e) => {
      const botaoDetalhes = e.target.closest(".ver-detalhes");
      if (botaoDetalhes) {
        const idTurma = botaoDetalhes.dataset.id;
        if (!idTurma) {
          console.error("ID da turma não encontrado!");
          return;
        }
        localStorage.setItem("turmaId", idTurma);
        window.location.href = "../atividades/atividades.html";
        return;
      }

      const botaoDeletar = e.target.closest(".deletar-turma");
      if (botaoDeletar) {
        const idTurma = botaoDeletar.dataset.id;
        if (!idTurma) {
          console.error("ID da turma não encontrado para exclusão!");
          return;
        }

        const confirmarDelecao = confirm(
          "Você tem certeza que deseja deletar esta turma?"
        );
        if (!confirmarDelecao) return;

        try {
          const responseDelete = await fetch(
            `http://localhost:3001/turmas/${idTurma}`,
            { method: "DELETE" }
          );

          if (!responseDelete.ok) {
            throw new Error("Falha ao deletar a turma.");
          }

          alert("Turma deletada com sucesso!");
          carregarTurmas();
        } catch (error) {
          console.error("Erro ao deletar turma:", error);
          alert("Erro ao deletar a turma. Tente novamente.");
        }
      }
    });
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
}

carregarTurmas();
