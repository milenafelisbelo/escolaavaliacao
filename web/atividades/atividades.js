const nomeprofessor = localStorage.getItem("professorNome");
const professornome = document.getElementById("professor-nome");

if (nomeprofessor) {
  professornome.textContent = "Bem vindo, " + nomeprofessor;
} else {
  professornome.textContent = "Erro";
}

const idTurma = localStorage.getItem("turmaId");

async function carregarAtividades() {
  try {
    const response = await fetch(
      `http://localhost:3001/atividades/turma/${idTurma}`
    );
    const atividades = await response.json();

    const tabelaBody = document.querySelector("#tabela-atividades tbody");
    tabelaBody.innerHTML = "";

    atividades.forEach((atividade) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${atividade.id}</td>
            <td>${atividade.titulo}</td>
            `;
      tabelaBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar atividade", error);
  }
}

carregarAtividades();
