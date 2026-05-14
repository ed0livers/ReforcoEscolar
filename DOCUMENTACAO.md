# 📚 Documentação do Projeto: Reforço Escolar 

Bem-vindo(a) ao projeto **Reforço Escolar**! Se você está começando agora ou quer entender como as coisas funcionam por debaixo dos panos, este documento é para você. Vamos explicar a estrutura de uma forma simples e fácil de entender.

---

## 🌟 1. Visão Geral: O que é este projeto?

Este é um sistema completo para gerenciamento de escolas ou unidades de reforço escolar. Ele permite cadastrar alunos, professores, turmas, materiais, controlar as mensalidades (financeiro) e fazer chamada (frequência).


---

## 🛠️ 2. Tecnologias Utilizadas

Pense no projeto como um restaurante:

*   ** React & Tailwind CSS (Frontend):** É o "salão" do restaurante. É o que o usuário vê (telas, botões, cores). Foi construído com React (para criar os componentes da tela) e Tailwind (para pintar e estilizar tudo rapidamente).
*   ** Node.js & Express (Backend):** É a "cozinha" do restaurante. É onde as regras acontecem, as contas são feitas e a segurança é garantida.
*   ** MySQL (Banco de Dados):** É a "despensa" do restaurante. Onde todos os dados (alunos, turmas, finanças) ficam guardados com segurança de forma permanente.
*   ** Vite:** É o "gerente" que constrói e roda o salão de forma super rápida durante o desenvolvimento.

---

## 📂 3. Como o projeto está dividido?

As pastas principais que você precisa conhecer:

```text
ReforcoEscolar-main/
 ├── server/       👉 O Backend (a "Cozinha")
 ├── src/          👉 O Frontend (o "Salão")
 │    ├── api/          👉 O "Garçom" (faz a ponte entre o salão e a cozinha)
 │    ├── components/   👉 Peças de Lego visuais (botões, modais, menu lateral)
 │    ├── pages/        👉 As telas completas (Login, Alunos, Financeiro)
 │    └── hooks/        👉 Funções reutilizáveis no frontend (ex: controle de login)
 ├── init.sql      👉 O manual de construção da "Despensa" (Cria as tabelas no MySQL)
 └── package.json  👉 Lista de ingredientes do projeto e comandos úteis
```

---

## 🧠 4. Arquivos e "Classes" Principais

Aqui estão os arquivos mais importantes e o que eles fazem:

### No Backend (A Cozinha - `server/`)

1.  **`server/index.ts` (O Chefe de Cozinha):**
    É o arquivo que liga o servidor. Ele abre a porta (3001) para o Frontend fazer pedidos e delega os pedidos para as rotas corretas (ex: "Se pedirem `/api/alunos`, mande para a rota de alunos").
2.  **`server/db.ts` (O Estoquista):**
    É o arquivo que sabe como se conectar ao MySQL usando a senha e o usuário que estão no arquivo `.env`.
3.  **`server/auth.ts` (O Segurança):**
    Cuida do registro de usuários (quem cria a conta), do login e verifica as senhas. Ele cria o **Token JWT** (uma "pulseirinha VIP") que prova que o usuário está logado.
4.  **`server/routes/...` (Os Cozinheiros Especializados):**
    Cada arquivo (como `alunos.ts`, `turmas.ts`) sabe como ler, criar, editar e deletar (CRUD) uma informação específica no banco de dados.

### No Frontend (O Salão - `src/`)

1.  **`src/api/ConectorAPI.ts` (O Garçom Interativo):**
    **Esta é uma das partes mais importantes.** O Frontend não fala diretamente com o Banco de Dados. O `ConectorAPI` sabe exatamente como empacotar os dados digitados pelo usuário, colar a "pulseirinha VIP" (Token JWT) e enviar para o Backend através de requisições `fetch`.
2.  **`src/api/SincronizadorDeDados.tsx` (O Administrador do Salão):**
    Ele usa um *Hook* chamado `useSincronizador`. O papel dele é:
    *   Pegar todas as informações do Backend logo que a página carrega e distribuir para as telas (Dashboard, Alunos, Financeiro).
    *   Ficar de tempos em tempos perguntando ao servidor se tem atualizações (para a tela não ficar velha).
    *   Ele expõe funções práticas como `addAluno` e `deleteAluno` para que as telas só precisem chamar isso sem se preocupar com a conexão com o servidor.
3.  **`src/hooks/useAuth.ts` (O Porteiro da Tela):**
    Verifica se o usuário tem a "pulseirinha VIP" no `localStorage` (memória do navegador). Se não tiver, expulsa o usuário de volta para a tela de Login.
4.  **`src/App.tsx` (A Planta do Restaurante):**
    Define que tela deve aparecer em qual endereço (Rotas). Se digitar `/alunos`, ele desenha a tela de Alunos na página.

---

## 🔄 5. Fluxo na Prática: A Magia Acontecendo!

Vamos imaginar que você clicou no botão **"Salvar Aluno"** na tela de Cadastro. Como a informação viaja pelo sistema?

1.  **A Ação:** O arquivo `src/pages/Alunos.tsx` pega o nome e a turma que você digitou e diz: *"Sincronizador, adiciona esse aluno para mim!"* (Chamando a função `addAluno`).
2.  **O Pedido:** O `SincronizadorDeDados.tsx` pega esses dados e chama o garçom: *"ConectorAPI, insere isso lá na rota de alunos!"* (Fazendo `ConectorAPI.from('alunos').insert(...)`).
3.  **A Viagem:** O `ConectorAPI.ts` cria uma chamada HTTP (POST para `/api/alunos`), grampeia seu **Token JWT** no cabeçalho e envia pela internet (mesmo que localmente).
4.  **A Recepção Segura:** O `server/index.ts` recebe o pedido, o segurança (`auth` em `alunos.ts`) olha o JWT e diz: *"Ele tem a pulseira, pode passar."*
5.  **A Gravação:** O `server/routes/alunos.ts` converte esse pedido numa linguagem SQL (`INSERT INTO alunos...`) e o `db.ts` joga isso no **MySQL**.
6.  **A Resposta:** O MySQL diz *"Salvo com sucesso"*. O Backend devolve o novo aluno para o Garçom (`ConectorAPI`).
7.  **A Atualização:** O `SincronizadorDeDados` recebe a confirmação e atualiza toda a tela com o novo aluno mágico e instantaneamente.

---

## 🚀 6. Como Rodar o Projeto?

Basta um único comando no terminal dentro da pasta principal:

```bash
npm run dev:full
```

O que isso faz?
*   O comando `npm run server` roda o Backend em plano de fundo (Cozinha funcionando).
*   O comando `npm run dev` roda o Frontend (Salão aberto para os clientes).

Se algo der errado, verifique sempre se o servidor **MySQL** está rodando e se o arquivo `.env` está preenchido com a senha correta (Senha padrão: `123456`).

---
✨ *Documentação criada para facilitar a jornada de desenvolvimento no projeto.*
