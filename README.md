# Reforço Escolar - Sistema de Gestão

## Sobre o Projeto

O **Reforço Escolar** é uma plataforma web desenvolvida para auxiliar na gestão administrativa e financeira de centros de reforço escolar. Criado especificamente para atender o estabelecimento **Thaís e Talita Educacional** ([@thaisetalitaeducacional](https://www.instagram.com/thaisetalitaeducacional)), o sistema centraliza todas as operações essenciais de uma instituição educacional moderna.

## Funcionalidades Principais

O sistema oferece funcionalidades completas para gerenciamento educacional:

- **Gestão de Alunos**: Cadastro, edição e acompanhamento de alunos com dados pessoais e histórico acadêmico
- **Gestão de Turmas**: Criação e organização de turmas por disciplina, nível e horário
- **Gestão de Professores**: Cadastro de docentes e atribuição a disciplinas
- **Controle Financeiro**: Gerenciamento de mensalidades, recibos e histórico de pagamentos
- **Frequência**: Registro e controle de presença em aulas
- **Materiais Didáticos**: Catalogação e distribuição de materiais utilizados
- **Autenticação Segura**: Sistema de login com recuperação de senha

## Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: MySQL
- **Autenticação**: JWT, bcryptjs
- **Email**: Nodemailer
- **Gráficos**: Recharts
- **UI Components**: Lucide React

## Pré-requisitos

Para executar a aplicação localmente, você precisará de:

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes)
- MySQL Server
- Uma chave de API do Google Gemini (opcional, para funcionalidades de IA)

## Como Executar Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/ReforcoEscolar.git
cd ReforcoEscolar
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
GEMINI_API_KEY=sua_chave_api_aqui
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=reforco_escolar
```

### 4. Configurar banco de dados

Execute o script de inicialização do banco de dados:

```bash
mysql -u root -p < init.sql
```

Opcionalmente, carregue dados de teste:

```bash
npm run insert:dummy
```

### 5. Executar a aplicação

Para execução com servidor backend e frontend simultaneamente:

```bash
npm run dev:full
```

Ou, para executar separadamente:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor frontend em desenvolvimento
- `npm run server` - Inicia o servidor backend
- `npm run dev:full` - Executa frontend e backend simultaneamente
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Verifica erros de TypeScript
- `npm run clean` - Remove diretório de distribuição

## Estrutura do Projeto

```
ReforcoEscolar/
├── server/                    # Backend (Node.js + Express)
│   ├── routes/               # Rotas da API
│   ├── index.ts              # Arquivo principal do servidor
│   ├── db.ts                 # Configuração do banco de dados
│   ├── auth.ts               # Autenticação e autorização
│   └── emailService.ts       # Serviço de envio de emails
├── src/                      # Frontend (React + TypeScript)
│   ├── pages/               # Páginas principais
│   ├── components/          # Componentes reutilizáveis
│   ├── hooks/               # Hooks customizados
│   ├── api/                 # Conectores da API
│   └── main.tsx             # Entrada da aplicação
├── init.sql                 # Script de inicialização do banco
├── package.json             # Dependências e scripts
└── README.md               # Este arquivo
```

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato com **Thaís e Talita Educacional**:

- Instagram: [@thaisetalitaeducacional](https://www.instagram.com/thaisetalitaeducacional)
