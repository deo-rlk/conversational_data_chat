# 🔧 Solução de Problemas - Looker Conversational Interface

## 🚨 Problemas Comuns e Soluções

### 1. **Erro: "Erro desconhecido" ao conectar**
**Causa**: Backend não está rodando ou WebSocket não consegue conectar

**Soluções**:
```bash
# Opção 1: Usar modo demo (recomendado para testes)
# - Acesse http://localhost:3000
# - Escolha "Modo Demo"
# - Funciona sem backend!

# Opção 2: Iniciar backend manualmente
cd backend
python simple_ws_backend.py

# Opção 3: Usar backend minimal
cd backend
python minimal_backend.py
```

### 2. **Erro: "WebSocket connection failed"**
**Causa**: WebSocket não consegue conectar ao backend

**Soluções**:
1. **Verificar se backend está rodando**:
   ```bash
   # Teste se backend responde
   curl http://localhost:8000
   # Deve retornar JSON com status
   ```

2. **Verificar porta 8000**:
   ```bash
   # Windows
   netstat -an | findstr :8000
   
   # Se porta estiver ocupada, mate o processo
   taskkill /f /im python.exe
   ```

3. **Usar modo demo** (sempre funciona):
   - Escolha "Modo Demo" na configuração
   - Não precisa de backend

### 3. **Erro: "Backend não está rodando"**
**Causa**: Servidor Python não iniciou corretamente

**Soluções**:
```bash
# 1. Verificar Python
python --version
# Deve mostrar Python 3.8+

# 2. Instalar websockets
pip install websockets

# 3. Iniciar backend
cd backend
python simple_ws_backend.py

# 4. Verificar se subiu
# Abra http://localhost:8000 no navegador
# Deve mostrar JSON com status
```

### 4. **URL do Looker sem https://**
**Solução**: ✅ **JÁ CORRIGIDO** - A aplicação agora adiciona automaticamente `https://`

### 5. **PowerShell não reconhece comandos**
**Problema**: `start-backend.bat` não funciona no PowerShell

**Soluções**:
```powershell
# Use .\ para executar no diretório atual
.\start-backend.bat

# Ou execute diretamente
cd backend
python simple_ws_backend.py
```

## 🎯 **Solução Mais Simples: Usar Modo Demo**

Para testar a aplicação sem problemas:

1. **Inicie apenas o frontend**:
   ```bash
   npm run dev
   ```

2. **Acesse**: http://localhost:3000

3. **Escolha "Modo Demo"** na configuração

4. **Teste todas as funcionalidades** sem precisar de backend!

## 🔍 **Verificação de Status**

### Frontend funcionando?
- ✅ Acesse: http://localhost:3000
- ✅ Deve mostrar página de boas-vindas

### Backend funcionando?
- ✅ Acesse: http://localhost:8000
- ✅ Deve mostrar JSON com status

### WebSocket funcionando?
- ✅ Abra DevTools (F12) → Console
- ✅ Deve mostrar "WebSocket connected" ou "WebSocket connection failed"
- ✅ Se falhar, use modo demo

## 📋 **Checklist de Diagnóstico**

- [ ] Node.js instalado? (`node --version`)
- [ ] Python instalado? (`python --version`)
- [ ] Frontend rodando? (http://localhost:3000)
- [ ] Backend rodando? (http://localhost:8000)
- [ ] Porta 8000 livre? (`netstat -an | findstr :8000`)
- [ ] Modo demo funciona? (sempre deve funcionar)

## 🆘 **Se Nada Funcionar**

1. **Use apenas o modo demo** - sempre funciona
2. **Reinicie tudo**:
   ```bash
   # Pare todos os processos
   taskkill /f /im node.exe
   taskkill /f /im python.exe
   
   # Reinicie
   npm run dev
   ```

3. **Verifique logs**:
   - Abra DevTools (F12) → Console
   - Procure por erros em vermelho
   - Copie e cole os erros para análise

## 💡 **Dicas Importantes**

- **Modo Demo sempre funciona** - use para testes
- **Backend é opcional** para modo demo
- **WebSocket falha?** - aplicação usa fallback automático
- **URL sem https://?** - aplicação corrige automaticamente
- **PowerShell problemas?** - use CMD ou Git Bash
