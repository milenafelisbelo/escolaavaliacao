document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const senha = document.querySelector("#senha").value.trim();

  if (!email || !senha) {
    alert("Por favor, preencha email e senha.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/professores/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const result = await response.json();
    console.log("Resposta do servidor:", result);

    if (response.ok && result.professor) {
      localStorage.setItem("professorNome", result.professor.nome);
      localStorage.setItem("professorId", result.professor.id);

      window.location.href = "../dashboard/dashboard.html";
    } else {
      alert(result.message || "Email ou senha incorretos");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Ocorreu um erro no login. Tente novamente.");
  }
});
