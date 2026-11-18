// =========================================================
// portfolio.js — preenche o portfólio com os dados da API
// Uso: portfolio.html?id=1  (sem id, mostra o exemplo do protótipo)
// =========================================================

const idAluno = new URLSearchParams(location.search).get("id");

async function carregarPortfolio() {
    if (!idAluno) return; // sem id: fica o conteúdo de exemplo

    try {
        // A rota devolve { aluno: {...}, projetos: [...] }
        const { aluno, projetos } = await chamarApi(`/Aluno/${idAluno}/portfolio`);

        document.title = `Portfólio | ${aluno.nome}`;
        document.getElementById("nome").textContent = `Oi, meu nome é ${aluno.nome.split(" ").slice(0, 2).join(" ")}`;
        document.getElementById("sobre").textContent = aluno.sobre || "Estudante de Análise e Desenvolvimento de Sistemas.";
        document.getElementById("areas").textContent = aluno.areasAtuacao || "Ainda não informado.";
        document.getElementById("rodape").textContent = `${aluno.nome} · SENAI · Análise e Desenvolvimento de Sistemas`;

        // Foto
        const foto = document.getElementById("foto");
        if (aluno.fotoUrl) {
            foto.src = aluno.fotoUrl;
            foto.alt = `Foto de ${aluno.nome}`;
        } else {
            foto.parentElement.remove();
        }

        // Links do GitHub e do LinkedIn (some o botão se não tiver link)
        configurarLink("link-github", aluno.githubUrl);
        configurarLink("link-linkedin", aluno.linkedinUrl);

        // Etiquetas: o texto "C#, HTML, CSS" vira uma etiqueta para cada item
        document.getElementById("tecnologias").replaceWith(comId(criarEtiquetas(aluno.tecnologias), "tecnologias"));
        document.getElementById("habilidades").replaceWith(comId(criarEtiquetas(aluno.habilidades, "roxa"), "habilidades"));
        document.getElementById("ferramentas").replaceWith(comId(criarEtiquetas(aluno.ferramentas, "roxa"), "ferramentas"));

        mostrarProjetos(projetos);
    } catch (erro) {
        erroDeConexao(erro);
    }
}

function configurarLink(id, url) {
    const link = document.getElementById(id);
    if (url) {
        link.href = url;
    } else {
        link.remove();
    }
}

function comId(elemento, id) {
    elemento.id = id;
    return elemento;
}

// Cria um <article> para cada projeto (o CSS alterna imagem e texto)
function mostrarProjetos(projetos) {
    const lista = document.getElementById("lista-projetos");
    lista.innerHTML = "";

    if (projetos.length === 0) {
        lista.innerHTML = '<p class="vazio">Nenhum projeto cadastrado ainda.</p>';
        return;
    }

    projetos.forEach((projeto) => {
        const artigo = document.createElement("article");
        artigo.className = "projeto";

        // Imagem do projeto ou, se não tiver, o título sobre o fundo colorido
        const imagem = document.createElement("div");
        imagem.className = "projeto-imagem";
        if (projeto.imagemUrl) {
            imagem.style.background = `url('${projeto.imagemUrl}') center / cover`;
        } else {
            imagem.textContent = projeto.titulo;
        }

        const info = document.createElement("div");
        info.className = "projeto-info";
        info.innerHTML = `<h3></h3><p></p>`;
        info.querySelector("h3").textContent = projeto.titulo;
        info.querySelector("p").textContent = projeto.descricao;
        info.appendChild(criarEtiquetas(projeto.tecnologias));

        if (projeto.linkAcesso) {
            const link = document.createElement("a");
            link.className = "btn btn-fantasma";
            link.href = projeto.linkAcesso;
            link.target = "_blank";
            link.textContent = "Veja mais";
            info.appendChild(link);
        }

        artigo.append(imagem, info);
        lista.appendChild(artigo);
    });
}

carregarPortfolio();
