# 🧪 Guia de Teste Completo - Frontend + Backend

## 🎯 **Objetivo**
Testar a comunicação completa entre frontend e backend, simulando o processo real de configuração que demora alguns minutos.

## 📋 **Pré-requisitos**
- ✅ Node.js instalado
- ✅ Python 3.8+ instalado
- ✅ Portas 3000 e 8000 livres

## 🚀 **Passo a Passo do Teste**

### **1. Preparar o Backend (Terminal 1)**

```bash
# Instalar websockets se necessário
pip install websockets

# Iniciar backend completo
cd backend
python test_backend_complete.py
```

**Você deve ver:**
```
🚀 Looker Conversational Interface - Backend Completo
============================================================
🌐 HTTP Server: http://localhost:8000
📡 WebSocket: ws://localhost:8001/ws
⏱️  Tempo estimado de configuração: 5-8 minutos
============================================================
🌐 Servidor HTTP: http://localhost:8000
📡 Servidor WebSocket: ws://localhost:8001/ws
✅ WebSocket ativo e aguardando conexões...
```

### **2. Preparar o Frontend (Terminal 2)**

```bash
# Em outro terminal
npm run dev
```

**Você deve ver:**
```
  VITE v4.5.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### **3. Testar Comunicação**

#### **3.1. Verificar Backend**
- Abra: http://localhost:8000
- Deve mostrar JSON com status "running"

#### **3.2. Verificar Frontend**
- Abra: http://localhost:3000
- Deve mostrar página de boas-vindas

### **4. Teste com Credenciais Reais**

#### **4.1. Configuração**
1. Clique em "Iniciar Demonstração"
2. Escolha "Credenciais Reais" (não demo)
3. Preencha:
   - **URL**: `https://demo.looker.com` (ou sua URL real)
   - **Client ID**: `demo_client_id` (ou seu ID real)
   - **Client Secret**: `demo_secret` (ou seu secret real)

#### **4.2. Processo de Configuração**
1. Clique em "Conectar ao MCP"
2. **Aguarde o processo** (5-8 minutos):
   - ✅ Instalação Gemini CLI (2-3 min)
   - ✅ Configuração Looker MCP (1-2 min)
   - ✅ Teste de conexão (1-2 min)
   - ✅ Preparação interface (1 min)

#### **4.3. Verificar Logs**
**No Terminal do Backend, você deve ver:**
```
✅ WebSocket conectado: 1 conexões ativas
📨 Recebido: {'type': 'start_config', 'config': {...}}
🔧 Iniciando configuração para: https://demo.looker.com
📤 Enviado: Iniciando instalação do Gemini CLI... (5%)
📤 Enviado: Baixando dependências do Gemini CLI... (15%)
📤 Enviado: Configurando ambiente Python... (25%)
📤 Enviado: Gemini CLI instalado com sucesso! (35%)
📤 Enviado: Configurando credenciais do Looker MCP... (45%)
📤 Enviado: Validando credenciais do Looker... (55%)
📤 Enviado: Testando conexão com Looker... (65%)
📤 Enviado: Conexão estabelecida com sucesso! (75%)
📤 Enviado: Configurando Model Context Protocol... (80%)
📤 Enviado: Inicializando servidor MCP... (85%)
📤 Enviado: Preparando interface conversacional... (90%)
📤 Enviado: Configurando modelos de IA... (95%)
📤 Enviado: 🎉 Configuração concluída com sucesso! (100%)
✅ Configuração finalizada com sucesso!
```

**No Frontend, você deve ver:**
- Barra de progresso animada
- Mensagens de status em tempo real
- Redirecionamento automático para o chat

### **5. Teste com Modo Demo**

#### **5.1. Configuração Demo**
1. Volte para a configuração
2. Escolha "Modo Demo"
3. Clique em "Conectar ao MCP"

#### **5.2. Processo Demo**
- Deve ser mais rápido (2-3 minutos)
- Mesmo processo, mas com dados simulados
- Sem necessidade de credenciais reais

## 🔍 **Verificações de Sucesso**

### **✅ Backend Funcionando**
- [ ] http://localhost:8000 retorna JSON
- [ ] WebSocket aceita conexões
- [ ] Logs aparecem no terminal

### **✅ Frontend Funcionando**
- [ ] http://localhost:3000 carrega
- [ ] WebSocket conecta (DevTools → Console)
- [ ] Progresso é atualizado em tempo real

### **✅ Comunicação Funcionando**
- [ ] Mensagens WebSocket são trocadas
- [ ] Progresso chega ao frontend
- [ ] Redirecionamento para chat funciona

## 🐛 **Solução de Problemas**

### **Problema: WebSocket não conecta**
```bash
# Verificar se backend está rodando
curl http://localhost:8000

# Verificar porta 8001
netstat -an | findstr :8001
```

### **Problema: Frontend não atualiza**
- Abra DevTools (F12) → Console
- Procure por erros WebSocket
- Verifique se mensagens estão chegando

### **Problema: Processo trava**
- Verifique logs do backend
- Reinicie backend se necessário
- Use modo demo como fallback

## 📊 **Tempos Esperados**

| Etapa | Tempo | Descrição |
|-------|-------|-----------|
| Gemini CLI | 2-3 min | Instalação e configuração |
| Looker MCP | 1-2 min | Configuração de credenciais |
| Teste Conexão | 1-2 min | Validação com Looker |
| Interface | 1 min | Preparação final |
| **Total** | **5-8 min** | **Processo completo** |

## 🎉 **Resultado Esperado**

Ao final do teste, você deve ter:
- ✅ Backend rodando com WebSocket ativo
- ✅ Frontend conectado e recebendo updates
- ✅ Processo de configuração simulado
- ✅ Redirecionamento para chat funcionando
- ✅ Logs detalhados em ambos os lados

## 💡 **Dicas Importantes**

1. **Não feche o terminal do backend** durante o teste
2. **Aguarde o processo completo** - não interrompa
3. **Verifique os logs** para acompanhar o progresso
4. **Use credenciais demo** se não tiver credenciais reais
5. **Teste primeiro o modo demo** antes das credenciais reais
