// =========================================================
// api.js — funções usadas por todas as telas
// =========================================================

// Endereço da API (o mesmo que aparece quando rodamos o projeto PortfolioApi)
const API_URL = "http://localhost:5117/api";

// Faz uma chamada à API e devolve a resposta.
// metodo: "GET", "POST", "PUT" ou "DELETE" | dados: objeto enviado no corpo (POST e PUT)
async function chamarApi(rota, metodo = "GET", dados = null) {
    const opcoes = { method: metodo, headers: { "Content-Type": "application/json" } };
    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(API_URL + rota, opcoes);
    const texto = await resposta.text();

    // A API devolve JSON (objetos) ou texto simples (mensagens como "Turma excluída com sucesso!")
    let conteudo = texto;
    try {
        conteudo = JSON.parse(texto);
    } catch {
        // não era JSON, fica como texto
    }

    if (!resposta.ok) {
        // Erros de validação do ASP.NET vêm como objeto; as nossas regras vêm como texto
        const mensagem = typeof conteudo === "string" ? conteudo : "Confira os campos obrigatórios.";
        throw new Error(mensagem);
    }
    return conteudo;
}

// Mostra um aviso no canto da tela (verde = sucesso, vermelho = erro)
function mostrarAviso(mensagem, tipo = "sucesso") {
    const aviso = document.createElement("div");
    aviso.className = "aviso " + tipo;
    aviso.textContent = mensagem;
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 3500);
}

// Mensagem padrão quando a API está desligada
function erroDeConexao(erro) {
    if (erro instanceof TypeError) {
        mostrarAviso("Não foi possível conectar à API. Ela está rodando?", "erro");
    } else {
        mostrarAviso(erro.message, "erro");
    }
}

// Transforma "C#, HTML, CSS" em etiquetas <span class="etiqueta">
function criarEtiquetas(texto, classeExtra = "") {
    const div = document.createElement("div");
    div.className = "etiquetas";
    if (!texto) return div;

    texto.split(",").forEach((item) => {
        const nome = item.trim();
        if (nome === "") return;
        const span = document.createElement("span");
        span.className = ("etiqueta " + classeExtra).trim();
        span.textContent = nome;
        div.appendChild(span);
    });
    return div;
}

// Iniciais do nome para o avatar: "Ana Luiza" -> "AL"
function iniciais(nome) {
    return nome.split(" ").filter((p) => p).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}
