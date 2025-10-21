# Looker Conversational Interface

Interface de produto que permite conversar com dados presentes no Looker através de MCP e do Gemini.

## 🚀 Funcionalidades

- **Autenticação Google OAuth 2.0**: Login seguro com conta Google
- **Configuração MCP Looker**: Interface para inserir credenciais do Looker
- **Interface Conversacional**: Chat interativo para consultar dados
- **Design Responsivo**: Interface moderna e adaptável
- **TypeScript**: Tipagem forte e desenvolvimento seguro

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e escalável:

```
src/
├── auth/           # Sistema de autenticação
├── config/         # Configuração MCP Looker
├── pages/          # Páginas principais
├── components/     # Componentes reutilizáveis
├── hooks/          # Hooks customizados
├── services/       # Serviços e integrações
├── types/          # Definições TypeScript
├── utils/          # Utilitários
└── styles/         # Estilos globais
```

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Google para OAuth
- Credenciais do Looker (URL, Client ID, Client Secret)

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd conversational_data_chat
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais:
   ```env
   VITE_GOOGLE_CLIENT_ID=seu_google_client_id
   VITE_LOOKER_URL=https://seu-looker.exemplo.com
   VITE_LOOKER_CLIENT_ID=seu_looker_client_id
   VITE_LOOKER_CLIENT_SECRET=seu_looker_client_secret
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔄 Fluxo de Uso

1. **Login**: Faça login com sua conta Google
2. **Configuração**: Insira as credenciais do Looker
3. **Conexão**: Aguarde a conexão com o MCP
4. **Chat**: Comece a conversar com seus dados

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **Google OAuth** - Autenticação

## 📝 Notas Importantes

- A conexão SSL é automaticamente definida como `false` nas configurações MCP
- As credenciais são armazenadas localmente no navegador
- A interface de chat é simulada - a integração real com MCP será implementada posteriormente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
