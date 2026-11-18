// =========================================================
// cadastro-projeto.js — cadastrar, listar, editar e excluir projetos
// =========================================================

const formProjeto = document.getElementById("form-projeto");
const selectAluno = document.getElementById("aluno");
const listaProjetos = document.getElementById("lista-projetos");
const contador = document.getElementById("contador");
const botaoSalvar = document.getElementById("btn-salvar");
let idEmEdicao = null;

const campos = { titulo: "titulo", descricao: "descricao", tecnologias: "tecnologias", link: "linkAcesso", imagem: "imagemUrl" };

// Preenche o <select> com os alunos
async function carregarAlunos() {
    const alunos = await chamarApi("/Aluno");
    selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
    alunos.forEach((aluno) => {
        const opcao = document.createElement("option");
        opcao.value = aluno.id;
        opcao.textContent = aluno.nome;
        selectAluno.appendChild(opcao);
    });

    // Se a página foi aberta com ?aluno=1, já deixa o aluno escolhido
    const alunoDaUrl = new URLSearchParams(location.search).get("aluno");
    if (alunoDaUrl) {
        selectAluno.value = alunoDaUrl;
    }
    carregarProjetos();
}

// Lista os projetos do aluno escolhido
async function carregarProjetos() {
    listaProjetos.innerHTML = "";
    if (!selectAluno.value) {
        contador.textContent = "";
        listaProjetos.innerHTML = '<tr><td colspan="3" class="vazio">Escolha um aluno para ver os projetos.</td></tr>';
        return;
    }

    try {
        const projetos = await chamarApi(`/Projeto?alunoId=${selectAluno.value}`);
        contador.textContent = `${projetos.length} de 10 projetos`;

        if (projetos.length === 0) {
            listaProjetos.innerHTML = '<tr><td colspan="3" class="vazio">Esse aluno ainda não tem projetos.</td></tr>';
            return;
        }

        projetos.forEach((projeto) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${projeto.titulo}</td>
                <td>${projeto.tecnologias ?? ""}</td>
                <td class="acoes">
                    <button class="btn btn-fantasma btn-pequeno">Editar</button>
                    <button class="btn btn-vermelho btn-pequeno">Excluir</button>
                </td>`;
            const [botaoEditar, botaoExcluir] = linha.querySelectorAll("button");
            botaoEditar.addEventListener("click", () => editarProjeto(projeto));
            botaoExcluir.addEventListener("click", () => excluirProjeto(projeto));
            listaProjetos.appendChild(linha);
        });
    } catch (erro) {
        erroDeConexao(erro);
    }
}

function editarProjeto(projeto) {
    idEmEdicao = projeto.id;
    for (const idCampo in campos) {
        document.getElementById(idCampo).value = projeto[campos[idCampo]] ?? "";
    }
    botaoSalvar.textContent = "Salvar alterações";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirProjeto(projeto) {
    if (!confirm(`Excluir o projeto ${projeto.titulo}?`)) return;
    try {
        mostrarAviso(await chamarApi(`/Projeto/${projeto.id}`, "DELETE"));
        carregarProjetos();
    } catch (erro) {
        erroDeConexao(erro);
    }
}

formProjeto.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const projeto = { alunoId: Number(selectAluno.value) };
    for (const idCampo in campos) {
        projeto[campos[idCampo]] = document.getElementById(idCampo).value;
    }

    try {
        if (idEmEdicao) {
            await chamarApi(`/Projeto/${idEmEdicao}`, "PUT", projeto);
            mostrarAviso("Projeto atualizado!");
        } else {
            await chamarApi("/Projeto", "POST", projeto);
            mostrarAviso("Projeto cadastrado!");
        }
        // limpa só os campos do projeto, o aluno continua escolhido
        const aluno = selectAluno.value;
        formProjeto.reset();
        selectAluno.value = aluno;
        carregarProjetos();
    } catch (erro) {
        erroDeConexao(erro); // ex.: "Esse aluno já tem 10 projetos..."
    }
});

formProjeto.addEventListener("reset", () => {
    idEmEdicao = null;
    botaoSalvar.textContent = "Salvar projeto";
});

selectAluno.addEventListener("change", carregarProjetos);

carregarAlunos().catch(erroDeConexao);
