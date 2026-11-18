// =========================================================
// index.js — mostra as turmas e os alunos de cada turma
// (se a API estiver desligada, a página continua com o conteúdo de exemplo)
// =========================================================

const filtroTurmas = document.getElementById("filtro-turmas");
const gradeAlunos = document.getElementById("grade-alunos");

async function carregarTurmas() {
    try {
        const turmas = await chamarApi("/Turma");
        if (turmas.length === 0) return;

        filtroTurmas.innerHTML = "";
        turmas.forEach((turma, posicao) => {
            const chip = document.createElement("button");
            chip.className = "chip";
            chip.textContent = turma.nome;
            chip.addEventListener("click", () => selecionarTurma(chip, turma.id));
            filtroTurmas.appendChild(chip);

            if (posicao === 0) selecionarTurma(chip, turma.id); // já abre a primeira turma
        });
    } catch {
        // API desligada: mantém o exemplo que já está no HTML
    }
}

function selecionarTurma(chip, turmaId) {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("ativo"));
    chip.classList.add("ativo");
    carregarAlunos(turmaId);
}

async function carregarAlunos(turmaId) {
    const alunos = await chamarApi(`/Aluno?turmaId=${turmaId}`);
    gradeAlunos.innerHTML = "";

    if (alunos.length === 0) {
        gradeAlunos.innerHTML = '<p class="vazio">Essa turma ainda não tem alunos.</p>';
        return;
    }

    alunos.forEach((aluno, posicao) => {
        const card = document.createElement("a");
        card.className = "cartao card-aluno";
        card.href = `portfolio.html?id=${aluno.id}`;

        // Foto do aluno ou, se não tiver, um círculo com as iniciais
        const avatar = aluno.fotoUrl
            ? `<img class="avatar" src="${aluno.fotoUrl}" alt="Foto de ${aluno.nome}">`
            : `<div class="avatar ${posicao % 2 ? "roxo" : ""}">${iniciais(aluno.nome)}</div>`;

        // Primeira tecnologia da lista como "subtítulo" do card
        const destaque = aluno.tecnologias ? aluno.tecnologias.split(",")[0].trim() : "Estudante de ADS";

        card.innerHTML = `
            ${avatar}
            <h3>${aluno.nome}</h3>
            <p>${destaque}</p>
            <span class="btn btn-fantasma btn-pequeno">Ver portfólio</span>`;
        gradeAlunos.appendChild(card);
    });
}

carregarTurmas();
