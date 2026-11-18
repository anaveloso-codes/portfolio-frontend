// =========================================================
// cadastro-turma.js — cadastrar, listar, editar e excluir turmas
// =========================================================

const formTurma = document.getElementById("form-turma");
const listaTurmas = document.getElementById("lista-turmas");
const botaoSalvar = document.getElementById("btn-salvar");
let idEmEdicao = null; // quando tem um Id aqui, o formulário está editando

// Lista as turmas na tabela
async function carregarTurmas() {
    try {
        const turmas = await chamarApi("/Turma");
        listaTurmas.innerHTML = "";

        if (turmas.length === 0) {
            listaTurmas.innerHTML = '<tr><td colspan="4" class="vazio">Nenhuma turma cadastrada.</td></tr>';
            return;
        }

        turmas.forEach((turma) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${turma.nome}</td>
                <td>${turma.curso}</td>
                <td>${turma.periodo}</td>
                <td class="acoes">
                    <button class="btn btn-fantasma btn-pequeno">Editar</button>
                    <button class="btn btn-vermelho btn-pequeno">Excluir</button>
                </td>`;
            const [botaoEditar, botaoExcluir] = linha.querySelectorAll("button");
            botaoEditar.addEventListener("click", () => editarTurma(turma));
            botaoExcluir.addEventListener("click", () => excluirTurma(turma));
            listaTurmas.appendChild(linha);
        });
    } catch (erro) {
        erroDeConexao(erro);
    }
}

// Coloca os dados da turma no formulário para editar
function editarTurma(turma) {
    idEmEdicao = turma.id;
    document.getElementById("nome").value = turma.nome;
    document.getElementById("curso").value = turma.curso;
    document.getElementById("periodo").value = turma.periodo;
    botaoSalvar.textContent = "Salvar alterações";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirTurma(turma) {
    if (!confirm(`Excluir a turma ${turma.nome}?`)) return;
    try {
        const mensagem = await chamarApi(`/Turma/${turma.id}`, "DELETE");
        mostrarAviso(mensagem);
        carregarTurmas();
    } catch (erro) {
        erroDeConexao(erro);
    }
}

// Salvar: cadastra (POST) ou edita (PUT)
formTurma.addEventListener("submit", async (evento) => {
    evento.preventDefault(); // não recarrega a página

    const turma = {
        nome: document.getElementById("nome").value,
        curso: document.getElementById("curso").value,
        periodo: document.getElementById("periodo").value,
    };

    try {
        if (idEmEdicao) {
            await chamarApi(`/Turma/${idEmEdicao}`, "PUT", turma);
            mostrarAviso("Turma atualizada!");
        } else {
            await chamarApi("/Turma", "POST", turma);
            mostrarAviso("Turma cadastrada!");
        }
        limparFormulario();
        carregarTurmas();
    } catch (erro) {
        erroDeConexao(erro);
    }
});

function limparFormulario() {
    formTurma.reset();
    idEmEdicao = null;
    botaoSalvar.textContent = "Salvar turma";
}

formTurma.addEventListener("reset", () => {
    idEmEdicao = null;
    botaoSalvar.textContent = "Salvar turma";
});

carregarTurmas();
