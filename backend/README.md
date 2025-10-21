# Looker Conversational Interface Backend

Backend Python para configuração automática do Gemini CLI e integração com Looker MCP.

## 🚀 Funcionalidades

- **Configuração Automática**: Instala e configura automaticamente o Gemini CLI
- **WebSocket em Tempo Real**: Status de configuração em tempo real
- **Criptografia de Credenciais**: Armazenamento seguro das credenciais do Looker
- **Integração MCP**: Configuração automática do Model Context Protocol
- **Modo Demo**: Suporte para teste sem credenciais reais

## 📋 Pré-requisitos

- Python 3.8+
- Node.js (para instalação do Gemini CLI)
- Credenciais do Looker (opcional - modo demo disponível)

## 🛠️ Instalação

1. **Instale as dependências Python**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   export ENCRYPTION_KEY="your-secret-encryption-key-here"
   ```

3. **Execute o servidor**
   ```bash
   python run.py
   ```

## 🔧 Configuração

### Variáveis de Ambiente

- `ENCRYPTION_KEY`: Chave para criptografar credenciais (obrigatório)
- `PORT`: Porta do servidor (padrão: 8000)
- `HOST`: Host do servidor (padrão: 0.0.0.0)

### Endpoints

- `GET /`: Status do servidor
- `GET /health`: Health check
- `WebSocket /ws`: Conexão WebSocket para status em tempo real

## 🔒 Segurança

- Credenciais são criptografadas usando Fernet (AES 128)
- Nunca expor credenciais em logs ou respostas
- Conexões WebSocket seguras
- Validação de entrada em todas as APIs

## 📡 WebSocket API

### Mensagens de Status

```json
{
  "status": "loading|installing|done|error",
  "message": "Descrição da operação",
  "progress": 0-100,
  "step": "identificador_da_etapa"
}
```

### Iniciar Configuração

```json
{
  "type": "start_config",
  "config": {
    "url": "https://seu-looker.exemplo.com",
    "client_id": "seu_client_id",
    "client_secret": "seu_client_secret",
    "use_demo": false
  }
}
```

## 🏗️ Arquitetura

```
backend/
├── main.py              # Servidor FastAPI principal
├── run.py               # Script de execução
├── requirements.txt     # Dependências Python
└── README.md           # Documentação
```

## 🔄 Processo de Configuração

1. **Instalação Gemini CLI**
   - Executa `npx https://github.com/google-gemini/gemini-cli`
   - Confirma instalação automaticamente

2. **Configuração Looker MCP**
   - Define variáveis de ambiente
   - Criptografa e armazena credenciais
   - Testa conexão com Looker

3. **Preparação Interface**
   - Configura interface conversacional
   - Finaliza setup

## 🐛 Troubleshooting

### Erro de Conexão WebSocket
- Verifique se o servidor está rodando na porta 8000
- Confirme se o CORS está configurado corretamente

### Erro de Instalação Gemini CLI
- Verifique se Node.js está instalado
- Confirme acesso à internet
- Verifique permissões de execução

### Erro de Criptografia
- Verifique se ENCRYPTION_KEY está definida
- Confirme se a chave é válida (32 bytes)

## 📝 Logs

O servidor gera logs detalhados para debugging:
- Status de conexões WebSocket
- Progresso de instalação
- Erros de configuração
- Status de criptografia

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
