# 🚀 Guia de Configuração - Looker Conversational Interface

## ⚡ Início Rápido (Modo Demo)

### 1. Frontend (React)
```bash
# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

### 2. Acessar Aplicação
- Abra: http://localhost:3000
- Clique em "Iniciar Demonstração"
- Escolha "Modo Demo"
- Teste todas as funcionalidades!

## 🔧 Configuração Completa (Com Backend)

### 1. Frontend
```bash
npm install
npm run dev
```

### 2. Backend (Python) - Versão Simplificada
```bash
# Instalar Python 3.8+ se não tiver
# Download: https://python.org

# Iniciar servidor simplificado (sem dependências complexas)
cd backend
python simple_backend.py
```

### 3. Scripts Automáticos
```bash
# Windows
start-backend.bat

# Linux/Mac
./start-backend.sh
```

## 🐛 Solução de Problemas

### Erro: "Erro desconhecido" ao conectar
**Causa**: Backend não está rodando

**Solução**:
1. Abra terminal na pasta do projeto
2. Execute: `cd backend && python run.py`
3. Verifique se aparece: "Server will be available at: http://localhost:8000"

### Erro: "WebSocket connection failed"
**Causa**: Backend não está acessível

**Solução**:
1. Verifique se o backend está rodando na porta 8000
2. Teste: http://localhost:8000 (deve mostrar JSON)
3. Reinicie o backend se necessário

### Erro: "Missing dependency"
**Causa**: Dependências Python não instaladas

**Solução**:
```bash
cd backend
pip install -r requirements.txt
```

### URL do Looker sem https://
**Solução**: A aplicação agora adiciona automaticamente `https://` quando você cola uma URL sem protocolo.

## 📋 Checklist de Verificação

- [ ] Node.js instalado (versão 18+)
- [ ] Python instalado (versão 3.8+)
- [ ] Frontend rodando em http://localhost:3000
- [ ] Backend rodando em http://localhost:8000
- [ ] WebSocket funcionando (ws://localhost:8000/ws)

## 🎯 Modos de Uso

### Modo Demo (Recomendado para Testes)
- ✅ Não precisa de backend
- ✅ Não precisa de credenciais reais
- ✅ Funciona offline
- ✅ Testa todas as funcionalidades

### Modo Produção
- ⚠️ Precisa de backend rodando
- ⚠️ Precisa de credenciais reais do Looker
- ⚠️ Precisa de Node.js para Gemini CLI
- ✅ Configuração automática completa

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todos os pré-requisitos estão instalados
2. Confirme se as portas 3000 e 8000 estão livres
3. Verifique os logs do console para erros específicos
4. Teste primeiro no modo demo antes de usar credenciais reais
