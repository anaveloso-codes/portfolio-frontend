// =========================================================
// cadastro-aluno.js — cadastrar, listar, editar e excluir alunos
// =========================================================

const formAluno = document.getElementById("form-aluno");
const selectTurma = document.getElementById("turma");
const listaAlunos = document.getElementById("lista-alunos");
const botaoSalvar = document.getElementById("btn-salvar");
let idEmEdicao = null;
let turmas = [];

// Campos do formulário: id do campo no HTML -> nome da propriedade na API
const campos = {
    nome: "nome", email: "email", foto: "fotoUrl", sobre: "sobre", areas: "areasAtuacao",
    tecnologias: "tecnologias", habilidades: "habilidades", ferramentas: "ferramentas",
    github: "githubUrl", linkedin: "linkedinUrl",
};

// Preenche a lista de turmas do <select>
async function carregarTurmas() {
    turmas = await chamarApi("/Turma");
    selectTurma.innerHTML = '<option value="">Selecione a turma</option>';
    turmas.forEach((turma) => {
        const opcao = document.createElement("option");
        opcao.value = turma.id;
        opcao.textContent = `${turma.nome} · ${turma.periodo}`;
        selectTurma.appendChild(opcao);
    });
}

// Lista os alunos na tabela
async function carregarAlunos() {
    const alunos = await chamarApi("/Aluno");
    listaAlunos.innerHTML = "";

    if (alunos.length === 0) {
        listaAlunos.innerHTML = '<tr><td colspan="4" class="vazio">Nenhum aluno cadastrado.</td></tr>';
        return;
    }

    alunos.forEach((aluno) => {
        const turma = turmas.find((t) => t.id === aluno.turmaId);
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${turma ? turma.nome : "-"}</td>
            <td class="acoes">
                <a class="btn btn-roxo btn-pequeno" href="portfolio.html?id=${aluno.id}">Portfólio</a>
                <button class="btn btn-fantasma btn-pequeno">Editar</button>
                <button class="btn btn-vermelho btn-pequeno">Excluir</button>
            </td>`;
        const [botaoEditar, botaoExcluir] = linha.querySelectorAll("button");
        botaoEditar.addEventListener("click", () => editarAluno(aluno));
        botaoExcluir.addEventListener("click", () => excluirAluno(aluno));
        listaAlunos.appendChild(linha);
    });
}

function editarAluno(aluno) {
    idEmEdicao = aluno.id;
    for (const idCampo in campos) {
        document.getElementById(idCampo).value = aluno[campos[idCampo]] ?? "";
    }
    selectTurma.value = aluno.turmaId;
    botaoSalvar.textContent = "Salvar alterações";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirAluno(aluno) {
    if (!confirm(`Excluir ${aluno.nome}? Os projetos dele também serão excluídos.`)) return;
    try {
        mostrarAviso(await chamarApi(`/Aluno/${aluno.id}`, "DELETE"));
        carregarAlunos();
    } catch (erro) {
        erroDeConexao(erro);
    }
}

formAluno.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Monta o objeto com os valores do formulário
    const aluno = { turmaId: Number(selectTurma.value) };
    for (const idCampo in campos) {
        aluno[campos[idCampo]] = document.getElementById(idCampo).value;
    }

    try {
        if (idEmEdicao) {
            await chamarApi(`/Aluno/${idEmEdicao}`, "PUT", aluno);
            mostrarAviso("Aluno atualizado!");
        } else {
            await chamarApi("/Aluno", "POST", aluno);
            mostrarAviso("Aluno cadastrado!");
        }
        formAluno.reset();
        carregarAlunos();
    } catch (erro) {
        erroDeConexao(erro);
    }
});

formAluno.addEventListener("reset", () => {
    idEmEdicao = null;
    botaoSalvar.textContent = "Salvar aluno";
});

// Primeiro as turmas (para o select e para mostrar o nome na tabela), depois os alunos
carregarTurmas().then(carregarAlunos).catch(erroDeConexao);
