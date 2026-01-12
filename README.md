# Conversational Data Chat - Protótipo

Este é um protótipo de demonstração de um sistema de chat conversacional integrado com MCP (Model Context Protocol) e Looker. O protótipo é **frontend-first** e utiliza mocks para simular integrações com serviços externos.

## ⚠️ Importante: Protótipo de Demonstração

**Este é um protótipo corporativo de demonstração, não para produção.** Todos os endpoints e integrações são mocks. Em produção, é essencial implementar autenticação real, backend seguro e integrações reais com Looker/MCP.

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse [http://localhost:3000](http://localhost:3000) no navegador

### Build para Produção

```bash
npm run build
npm start
```

## 🎮 Como Usar

### Login

1. Na tela de login, insira qualquer email (ex: `usuario@example.com`)
2. O sistema simula autenticação OAuth do Google
3. Após login, você será redirecionado para a tela de carregamento

### Dev Toggle (Desenvolvimento)

Quando logado, você verá um botão no canto inferior esquerdo (apenas em modo desenvolvimento) que permite alternar entre roles:

- **User**: Acesso ao chat com limite de 10 perguntas/dia
- **Admin**: Acesso completo + painel administrativo com limite de 25 perguntas/dia

### Chat

- Faça perguntas no chat (máximo 300 caracteres)
- Visualize o contador de perguntas restantes (canto superior direito)
- Respostas são simuladas pelo mock do MCP
- Admin: informações de debug (explore usado) são exibidas

### Painel Administrativo (Apenas Admin)

1. **Admin Home** (`/admin`): Botões para Chat e Configure
2. **Configure Environments** (`/admin/configure/environments`):
   - Lista de ambientes configurados
   - Criar novo ambiente
   - Abrir detalhes do ambiente
   - Excluir ambiente (apenas o criador pode excluir)
3. **Novo Ambiente** (`/admin/configure/environments/new`):
   - Preencher dados: Nome, URL Looker, Client ID, Client Secret
   - Selecionar Explores (multi-select)
   - Testar conexão (mock)
   - Salvar ambiente
4. **Detalhes do Ambiente** (`/admin/configure/environments/[id]`):
   - Lista de usuários associados
   - Adicionar novo usuário
   - Remover usuário (apenas admin criador)

## 📁 Estrutura do Projeto

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rotas de autenticação
│   ├── admin/               # Rotas administrativas
│   ├── api/mock/            # API routes mock
│   ├── chat/                # Página do chat
│   ├── loading/             # Tela de carregamento
│   └── layout.tsx           # Layout raiz
├── components/              # Componentes React
│   ├── admin/               # Componentes admin
│   ├── auth/                # Componentes de autenticação
│   ├── chat/                # Componentes do chat
│   ├── layout/              # Layout components
│   ├── loading/             # Componentes de loading
│   └── ui/                  # Componentes UI base
├── contexts/                # React Contexts
├── hooks/                   # Custom hooks
├── lib/                     # Utilitários e helpers
├── types/                   # TypeScript types
└── data/                    # Dados de exemplo (seed)
```

## 🔧 Stack Tecnológica

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (animações)
- **LocalStorage** (persistência de dados - apenas para demo)

## 📋 Checklist de Aceitação (QA Demo)

- [x] Tela `/login` com OAuth Google mock e toggle role dev
- [x] `/loading` com animações e etapas simuladas
- [x] `/chat` funcional: enviar pergunta, ver resposta mock, ver contador de perguntas restante, limite de 300 chars
- [x] `/admin` com botões Chat / Configure
- [x] `/admin/configure/environments` com lista, criar novo ambiente com fields e Test Connection mock
- [x] `/admin/configure/environments/[id]` com lista de usuários e fluxo Add User com loading e confirmação
- [x] Todas as ações possuem toasts/erros amigáveis e modais de confirmação
- [x] Código limpo e organizado em componentes reutilizáveis

## 🔐 Segurança - Notas Importantes

**⚠️ Este protótipo NÃO é seguro para produção!**

Consulte `SECURITY.md` para lista completa de pontos pendentes para produção.

### Principais pontos:

1. **Autenticação**: Mockada no frontend - deve ser implementada no backend
2. **Client Secret**: Nunca deve ser armazenado no frontend - usar variáveis de ambiente no backend
3. **Validação de Roles**: Simulada no frontend - deve ser validada no backend
4. **Contagem de Perguntas**: Armazenada em localStorage - deve ser gerenciada no backend com reset diário
5. **Integrações Looker/MCP**: Mocks - devem ser implementadas no backend

## 📝 Licença

Este é um protótipo interno de demonstração.
