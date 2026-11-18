# Sistema de Portfólio — Front-end

Telas do Sistema de Portfólio (SENAI · Análise e Desenvolvimento de Sistemas).

## Tecnologias

- HTML, CSS e JavaScript
- Protótipo no Figma

## Telas

| Arquivo | Tela |
|---|---|
| `index.html` | Início: turmas e alunos |
| `cadastro-turma.html` | Cadastro e lista de turmas |
| `cadastro-aluno.html` | Cadastro do aluno (dados do portfólio) |
| `cadastro-projeto.html` | Cadastro de projetos (6 a 10 por aluno) |
| `portfolio.html` | Portfólio do aluno |
| `style.css` | Estilos (mobile, tablet e desktop) |

A pasta `js` tem um script para cada tela e o `api.js`, com as funções que conversam com a API.

## Como abrir

As telas buscam os dados na API, então ela precisa estar ligada antes.

1. **Ligar a API:** siga o passo a passo do repositório [portfolio-backend](https://github.com/anaveloso-codes/portfolio-backend) (abrir no Visual Studio, `Update-Database` e F5). Ela roda em http://localhost:5117
2. **Baixar este repositório:** botão verde **Code → Download ZIP** (ou `git clone`) e descompactar.
3. **Abrir:** dois cliques no `index.html`, ou no VS Code com a extensão **Live Server** (botão direito → *Open with Live Server*).

Se a API estiver em outra porta, troque o endereço no começo do `js/api.js`:

```js
const API_URL = "http://localhost:5117/api";
```

- Sem a API ligada, o início e o portfólio mostram o conteúdo de exemplo do protótipo, e as telas de cadastro mostram o aviso "Não foi possível conectar à API".
- O portfólio de um aluno abre pelo endereço `portfolio.html?id=NÚMERO_DO_ALUNO` (os botões "Ver portfólio" já montam esse endereço).
