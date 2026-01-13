# Arquitetura de Governança - Conversational Data Chat

Documento de definição arquitetural para governança de usuários, autenticação e controle de acesso na aplicação integrada com Looker e LookerMCP.

## 📋 Índice

1. [Autenticação e Onboarding de Usuários](#1-autenticação-e-onboarding-de-usuários)
2. [Controle de Comandos via Linguagem Natural](#2-controle-de-comandos-via-linguagem-natural)
3. [Governança e Integração Looker API ↔ LookerMCP](#3-governança-e-integração-looker-api--lookermcp)
4. [Decisões Arquiteturais](#4-decisões-arquiteturais)

---

## 1. Autenticação e Onboarding de Usuários

### 1.1. Estratégia Escolhida: Opção C (Criação Prévia) com Preferência Manual no Looker

**Decisão**: Admin cria usuários diretamente no Looker (via UI ou API manual), não via integração automática da aplicação.

### 1.2. Fluxo de Autenticação

#### Cenário A: Login via SSO Corporativo (Opção A - Futuro)

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuário clica em "Login"                            │
│     → Redireciona para SSO corporativo (IdP)            │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. Usuário autentica no IdP (Google Workspace, AD, etc)│
│     → IdP retorna token SAML/OIDC                       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  3. Backend valida token SSO                            │
│     - Verifica assinatura                               │
│     - Extrai email/identificador                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  4. Backend consulta Looker User API                    │
│     GET /users?email={email}                            │
│     - Verifica se usuário existe no Looker              │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐       ┌──────▼──────┐
    │ EXISTE  │       │ NÃO EXISTE  │
    └────┬────┘       └──────┬──────┘
         │                   │
┌────────▼─────────┐  ┌──────▼──────────────────────────┐
│ 5a. Usuário OK   │  │ 5b. ERRO: Usuário não encontrado│
│ - Busca grupos   │  │ - Retorna mensagem:             │
│ - Busca permissões│ │   "Entre em contato com admin   │
│ - Cria sessão JWT│  │    para criar seu acesso"       │
│ - Retorna ao app │  │ - Bloqueia login                │
└──────────────────┘  └─────────────────────────────────┘
```

#### Cenário B: Login via OAuth do Looker (Alternativa)

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuário clica em "Login"                            │
│     → Redireciona para Looker OAuth                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. Usuário autentica no Looker                         │
│     → Looker retorna OAuth token                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  3. Backend recebe OAuth token                          │
│     - Valida token com Looker                           │
│     - Busca informações do usuário                      │
│     - Cria sessão JWT na aplicação                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  4. Retorna ao app com sessão ativa                     │
└─────────────────────────────────────────────────────────┘
```

### 1.3. Onboarding de Usuários

**Princípio Fundamental**: A aplicação NÃO cria usuários, models, explores, groups ou roles automaticamente.

#### Processo de Onboarding Manual (Admin)

```
┌─────────────────────────────────────────────────────────┐
│  FASE 1: Preparação no Looker (Admin Looker)           │
│  ─────────────────────────────────────────────────────  │
│  1. Admin acessa Looker UI                              │
│  2. Cria usuário:                                        │
│     - Email: usuario@empresa.com                        │
│     - Primeiro acesso: usuário recebe email de ativação │
│  3. Cria/mapeia para Group apropriado:                  │
│     - Ex: "Finance-Users"                               │
│  4. Associa Group a ModelSet:                           │
│     - ModelSet contém explores permitidos               │
│  5. Associa Group a PermissionSet:                      │
│     - PermissionSet: "Read-Only" (sem develop, etc)     │
│  6. Usuário ativa conta no Looker (primeiro login)      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FASE 2: Registro na Aplicação (Admin App)              │
│  ─────────────────────────────────────────────────────  │
│  1. Admin da aplicação acessa painel administrativo     │
│  2. Seleciona ambiente (Environment)                    │
│  3. Adiciona usuário:                                   │
│     - Insere email do usuário                           │
│     - Backend valida: GET /users?email={email}          │
│     - Se não existir no Looker: ERRO                    │
│     - Se existir: busca Looker User ID                  │
│  4. Backend salva mapeamento:                           │
│     - user_id (app) → looker_user_id                    │
│     - user_id → environment_id                          │
│     - Registra grupos do usuário no Looker              │
│  5. Usuário agora pode fazer login na aplicação         │
└─────────────────────────────────────────────────────────┘
```

### 1.4. Regras de Negócio

✅ **PERMITIDO**:
- Admin criar usuário no Looker manualmente
- Admin registrar usuário existente na aplicação
- Backend buscar informações do usuário no Looker (read-only)
- Backend validar existência do usuário antes de registrar

❌ **NÃO PERMITIDO**:
- Backend criar usuário no Looker via API
- Backend criar/editar groups no Looker
- Backend criar/editar models/explores no Looker
- Backend criar/editar roles/permission sets no Looker
- Qualquer ação de escrita administrativa automática

---

## 2. Controle de Comandos via Linguagem Natural

### 2.1. Estratégia de Controle por Tipo de Usuário

#### 2.1.1. Usuário Comum (Data Consumer)

**Regra**: Apenas perguntas sobre dados. Nenhuma ação de escrita ou administrativa.

**Comandos Permitidos**:
- Queries de leitura
- Visualização de dados
- Exploração de dados
- Perguntas analíticas

**Comandos Bloqueados**:
- Criar/editar/deletar views
- Criar/editar/deletar models
- Criar/editar/deletar explores
- Criar/editar/deletar projetos
- Qualquer ação administrativa

#### 2.1.2. Usuário Admin

**Regra**: Pode realizar ações administrativas através do chat, mas com validação.

**Comandos Permitidos**:
- Todas as permissões de usuário comum
- Criar/editar models, views, explores (com confirmação)
- Gerenciar grupos e permissões (com confirmação)
- Ações administrativas validadas

### 2.2. Camadas de Validação

#### Camada 1: Classificação de Intenção (NLU)

**Objetivo**: Detectar se a intenção é uma pergunta ou um comando administrativo.

```typescript
interface IntentClassification {
  type: 'question' | 'admin_command' | 'query';
  command?: 'create' | 'edit' | 'delete' | 'update';
  target?: 'view' | 'model' | 'explore' | 'project' | 'group';
  confidence: number;
}

// Exemplos de classificação:
"Quantas vendas tivemos?" 
  → { type: 'question', confidence: 0.98 }

"Criar uma view de vendas"
  → { type: 'admin_command', command: 'create', target: 'view', confidence: 0.95 }

"Editar o explore financeiro"
  → { type: 'admin_command', command: 'edit', target: 'explore', confidence: 0.92 }
```

#### Camada 2: Validação de Permissões do Usuário

```typescript
interface UserPermissions {
  role: 'user' | 'admin';
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  allowedExplores: string[];
}

// Para usuário comum:
{
  role: 'user',
  canCreate: false,
  canEdit: false,
  canDelete: false,
  allowedExplores: ['sales', 'finance']
}

// Para admin:
{
  role: 'admin',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  allowedExplores: ['*'] // todos
}
```

#### Camada 3: Whitelist/Blacklist de Comandos MCP

**Configuração do LookerMCP por tipo de usuário**:

```yaml
# Configuração para usuário comum
user_permissions:
  allowed_commands:
    - query_explore
    - get_explore_schema
    - run_query
    - get_dashboard_data
  blocked_commands:
    - create_view
    - update_view
    - delete_view
    - create_model
    - update_model
    - delete_model
    - create_explore
    - update_explore
    - delete_explore
    - create_project
    - update_project

# Configuração para admin
admin_permissions:
  allowed_commands:
    - '*' # todos os comandos
  requires_confirmation:
    - create_*
    - update_*
    - delete_*
```

### 2.3. Fluxo de Validação Completo

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuário envia mensagem via chat                     │
│     "Criar uma view de vendas mensais"                  │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. Backend recebe mensagem                             │
│     - Extrai texto                                       │
│     - Valida formato básico                             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  3. Classificação de Intenção (NLU)                     │
│     - Analisa padrões linguísticos                      │
│     - Detecta verbos: "Criar"                           │
│     - Detecta objeto: "view"                            │
│     - Classifica: admin_command (create, view)          │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  4. Validação de Permissões                             │
│     - Busca role do usuário                             │
│     - Verifica: role === 'admin'?                       │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐       ┌──────▼──────┐
    │  ADMIN  │       │   USER      │
    └────┬────┘       └──────┬──────┘
         │                   │
┌────────▼─────────┐  ┌──────▼──────────────────────────┐
│ 5a. Admin OK     │  │ 5b. BLOQUEAR                    │
│ - Solicita       │  │ - Mensagem:                     │
│   confirmação    │  │   "Você não tem permissão para  │
│ - Exibe preview  │  │    criar views. Você pode apenas│
│                  │  │    fazer perguntas sobre dados."│
└────────┬─────────┘  └─────────────────────────────────┘
         │
┌────────▼───────────────────────────────────────────────┐
│  6. Admin confirma ação                                │
│     - Backend valida novamente                         │
│     - Envia comando para LookerMCP                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  7. LookerMCP executa com credenciais admin             │
│     - Token OAuth do admin                              │
│     - Executa create_view                               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  8. Looker API valida PermissionSet                     │
│     - Admin tem permissão "develop"?                    │
│     - Sim → Cria view                                   │
│     - Não → Erro (não deveria acontecer)                │
└─────────────────────────────────────────────────────────┘
```

### 2.4. Padrões de Detecção

#### Padrões de Perguntas (Permitidas)

```regex
# Padrões de início de pergunta
^(Quanto|Quantos|Quantas|Qual|Quais|Como|Quando|Onde|Por que|Por que não|Mostre|Liste|Compare|Analise)

# Exemplos válidos:
- "Quantas vendas tivemos em janeiro?"
- "Qual o produto mais vendido?"
- "Mostre as vendas por região"
- "Compare vendas 2023 vs 2024"
```

#### Padrões de Comandos Administrativos (Bloqueados para usuários comuns)

```regex
# Verbos administrativos
(Criar|Criar um|Criar uma|Criar o|Criar a)
(Editar|Edite|Editar o|Editar a)
(Deletar|Delete|Remover|Remova)
(Atualizar|Atualize)
(Modificar|Modifique)
(Adicionar|Adicione)
(Alterar|Altere)

# Objetos administrativos
(view|views|model|modelo|models|explore|explores|projeto|projetos|dashboard|dashboards|look|looks)

# Exemplos bloqueados:
- "Criar uma view de vendas"
- "Editar o explore financeiro"
- "Deletar o modelo antigo"
- "Adicionar campo ao explore"
```

### 2.5. Regras de Negócio

✅ **Usuário Comum**:
- Pode fazer perguntas sobre dados
- Pode visualizar resultados de queries
- NÃO pode criar/editar/deletar nada
- Tentativas de comando administrativo são bloqueadas com mensagem educativa

✅ **Admin**:
- Pode fazer tudo que usuário comum pode
- Pode criar/editar/deletar via chat (com confirmação)
- Comandos administrativos requerem confirmação explícita
- Todas as ações são logadas para auditoria

❌ **Backend (Automático)**:
- NUNCA cria usuários automaticamente
- NUNCA cria/edita models/explores automaticamente
- NUNCA cria/edita groups/roles automaticamente
- APENAS lê informações do Looker (validação)

---

## 3. Governança e Integração Looker API ↔ LookerMCP

### 3.1. Fluxo de Governança (Baseado no Code Block)

```
┌─────────────────────────────────────────────────────────┐
│  Backend API                                            │
│  - Recebe pergunta do chat                              │
│  - Valida: usuário tem acesso?                          │
│  - Consulta Looker API:                                │
│    • User → Groups → ModelSets                         │
│    • Verifica explores permitidos                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Looker API (Group/ModelSet)                            │
│  - GET /groups/{id}                                     │
│  - GET /model_sets/{id}                                 │
│  - GET /users/{id}/model_sets                           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  LookerMCP                                              │
│  - Executa query apenas em                              │
│    explores permitidos                                  │
└─────────────────────────────────────────────────────────┘
```

### 3.2. Detalhamento do Fluxo

#### Passo 1: Backend Recebe Pergunta

```typescript
// Usuário envia: "Quantas vendas tivemos em janeiro?"
interface ChatRequest {
  userId: string;
  message: string;
  environmentId: string;
}
```

#### Passo 2: Backend Valida Acesso

```typescript
async function validateUserAccess(userId: string, environmentId: string) {
  // 1. Busca usuário na aplicação
  const user = await db.users.findById(userId);
  const lookerUserId = user.looker_user_id;
  
  // 2. Busca grupos do usuário no Looker
  const userGroups = await lookerApi.get(`/users/${lookerUserId}/group_ids`);
  
  // 3. Para cada grupo, busca ModelSet associado
  const modelSets = [];
  for (const groupId of userGroups) {
    const group = await lookerApi.get(`/groups/${groupId}`);
    if (group.model_set_id) {
      const modelSet = await lookerApi.get(`/model_sets/${group.model_set_id}`);
      modelSets.push(modelSet);
    }
  }
  
  // 4. Extrai explores permitidos de todos os ModelSets
  const allowedExplores = new Set();
  modelSets.forEach(ms => {
    ms.models?.forEach(model => {
      model.explores?.forEach(explore => {
        allowedExplores.add(`${model.name}.${explore.name}`);
      });
    });
  });
  
  return {
    hasAccess: true,
    allowedExplores: Array.from(allowedExplores),
    groups: userGroups,
    modelSets: modelSets.map(ms => ms.id)
  };
}
```

#### Passo 3: Backend Extrai Intenção da Pergunta

```typescript
// Analisa a pergunta para identificar:
// - Qual explore está sendo referenciado?
// - Quais filtros/dimensões?
// - É uma pergunta válida?

async function extractQueryIntent(message: string, allowedExplores: string[]) {
  // NLU: Identifica explore mencionado
  // Ex: "vendas" → "sales" explore
  
  // Valida: explore está na lista de permitidos?
  const requestedExplore = extractExploreName(message);
  if (!allowedExplores.includes(requestedExplore)) {
    throw new Error(`Explore ${requestedExplore} não permitido para este usuário`);
  }
  
  return {
    explore: requestedExplore,
    filters: extractFilters(message),
    dimensions: extractDimensions(message),
    measures: extractMeasures(message)
  };
}
```

#### Passo 4: Backend Prepara Query para LookerMCP

```typescript
async function prepareMCPQuery(queryIntent: QueryIntent) {
  return {
    command: 'query_explore',
    explore: queryIntent.explore,
    filters: queryIntent.filters,
    dimensions: queryIntent.dimensions,
    measures: queryIntent.measures,
    // Limites de segurança
    limit: 10000,
    // Usa credenciais do próprio usuário
    userToken: await getUserLookerToken(userId)
  };
}
```

#### Passo 5: LookerMCP Executa Query

```typescript
// LookerMCP recebe query já validada
// Executa apenas com explores permitidos
// Usa token do usuário (herda PermissionSet)
async function executeMCPQuery(mcpQuery: MCPQuery) {
  // LookerMCP internamente:
  // 1. Conecta ao Looker usando token do usuário
  // 2. Executa query no explore especificado
  // 3. Looker API valida PermissionSet do usuário
  // 4. Retorna resultados
}
```

### 3.3. Pontos de Validação

#### Validação 1: Looker API (Group/ModelSet)

**O que valida**:
- Usuário pertence a quais grupos?
- Grupos têm quais ModelSets?
- ModelSets contêm quais explores?
- Usuário tem PermissionSet apropriado?

**API Calls necessárias**:
```http
GET /api/4.0/users/{user_id}/group_ids
GET /api/4.0/groups/{group_id}
GET /api/4.0/model_sets/{model_set_id}
GET /api/4.0/users/{user_id}/model_sets
```

#### Validação 2: Backend (Aplicação)

**O que valida**:
- Explore solicitado está na lista permitida?
- Intenção é pergunta (não comando administrativo)?
- Usuário tem role apropriado?
- Ambiente (environment) está ativo?

#### Validação 3: LookerMCP

**O que valida**:
- Token do usuário é válido?
- Query está bem formada?
- Explore existe e está acessível?

#### Validação 4: Looker API (Execução)

**O que valida** (automático pelo Looker):
- Usuário tem PermissionSet com "access_data"?
- Usuário tem acesso ao ModelSet que contém o explore?
- Query não viola nenhuma regra de segurança?

### 3.4. Governança em Camadas

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 1: Looker (Fonte da Verdade)                   │
│  ─────────────────────────────────────────────────────  │
│  - Groups definem agrupamentos de usuários             │
│  - ModelSets definem quais explores cada grupo acessa  │
│  - PermissionSets definem ações permitidas             │
│  - Roles combinam ModelSet + PermissionSet             │
│                                                        │
│  → Esta é a ÚNICA fonte de verdade para permissões    │
└─────────────────────────────────────────────────────────┘
                   ↓ (read-only)
┌─────────────────────────────────────────────────────────┐
│  CAMADA 2: Backend (Validação e Cache)                 │
│  ─────────────────────────────────────────────────────  │
│  - Consulta Looker API para validar acesso             │
│  - Cache de permissões (TTL curto, ex: 5min)           │
│  - Valida intenção do usuário (pergunta vs comando)    │
│  - Filtra explores permitidos antes de enviar ao MCP   │
│                                                        │
│  → Valida e filtra, mas NÃO é fonte de verdade        │
└─────────────────────────────────────────────────────────┘
                   ↓ (queries validadas)
┌─────────────────────────────────────────────────────────┐
│  CAMADA 3: LookerMCP (Execução)                        │
│  ─────────────────────────────────────────────────────  │
│  - Recebe apenas queries já validadas                  │
│  - Executa com token do próprio usuário                │
│  - Usa explores já filtrados                           │
│                                                        │
│  → Executa queries, não valida permissões              │
└─────────────────────────────────────────────────────────┘
                   ↓ (resultados)
┌─────────────────────────────────────────────────────────┐
│  CAMADA 4: Looker API (Validação Final)                │
│  ─────────────────────────────────────────────────────  │
│  - Valida PermissionSet do usuário automaticamente     │
│  - Bloqueia se usuário não tem acesso                  │
│  - Retorna dados ou erro                               │
│                                                        │
│  → Última linha de defesa (não deveria ser necessário) │
└─────────────────────────────────────────────────────────┘
```

### 3.5. Aplicabilidade no Backend

**✅ SIM, é aplicável e recomendado**:

1. **Consulta Read-Only é Segura**
   - Backend apenas lê informações do Looker
   - Não modifica nada no Looker
   - Não cria nada no Looker

2. **Cache Melhora Performance**
   - Permissões podem ser cacheadas
   - Reduz chamadas à API do Looker
   - Melhora tempo de resposta

3. **Validação Prévia Melhora UX**
   - Erro é retornado antes de enviar ao MCP
   - Mensagens mais claras para o usuário
   - Evita processamento desnecessário

4. **Auditoria e Logs**
   - Backend pode registrar todas as tentativas
   - Logs de acesso e bloqueios
   - Compliance e segurança

**⚠️ Pontos de Atenção**:

1. **Cache deve ter TTL curto**
   - Permissões podem mudar no Looker
   - Cache muito longo = permissões desatualizadas
   - Recomendado: 5-10 minutos

2. **Fallback para Looker API**
   - Se cache falhar, consultar Looker diretamente
   - Não bloquear usuário se cache estiver offline

3. **Sincronização de Dados**
   - Se usuário for removido do grupo no Looker
   - Backend deve invalidar cache
   - Usuário deve perder acesso rapidamente

### 3.6. Fluxo Completo de Exemplo

```
Usuário comum (joao@empresa.com) pergunta: "Quantas vendas tivemos em janeiro?"

┌─────────────────────────────────────────────────────────┐
│  1. Backend recebe mensagem                             │
│     userId: "user123"                                   │
│     message: "Quantas vendas tivemos em janeiro?"       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. Backend valida acesso                               │
│     a. Busca user123 → looker_user_id: "567"            │
│     b. GET /users/567/group_ids → [101, 102]            │
│     c. GET /groups/101 → model_set_id: 201              │
│     d. GET /model_sets/201 → explores: ["sales"]        │
│     e. allowedExplores: ["sales"]                       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  3. Backend classifica intenção                         │
│     type: "question"                                    │
│     explore: "sales"                                    │
│     valid: true                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  4. Backend prepara query                               │
│     explore: "sales"                                    │
│     filters: { month: "janeiro" }                       │
│     measures: ["total_sales"]                           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  5. Backend envia para LookerMCP                        │
│     MCP recebe query validada                           │
│     Executa com token do usuário                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  6. Looker API executa query                            │
│     Valida: usuário tem acesso ao explore "sales"?      │
│     Sim → Executa query e retorna dados                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  7. Resultado retornado ao usuário                      │
│     "Em janeiro, tivemos 150.000 vendas"                │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Decisões Arquiteturais

### 4.1. Autenticação

**Decisão**: Opção C (Criação Prévia) com preferência por criação manual no Looker UI.

**Justificativa**:
- Admin tem controle total sobre criação de usuários
- Não há risco de criação automática incorreta
- Processo explícito e auditável
- Mantém Looker como fonte única de verdade

**Evolução Futura**: Opção A (SSO) quando disponível, mas mantendo criação prévia.

### 4.2. Controle de Comandos

**Decisão**: Validação em múltiplas camadas (NLU + Permissões + MCP + Looker).

**Justificativa**:
- Defesa em profundidade
- Melhor experiência do usuário (erro rápido)
- Segurança máxima (múltiplas validações)
- Admin pode usar comandos via chat (com confirmação)

### 4.3. Governança

**Decisão**: Backend consulta Looker API (read-only) para validação de acesso.

**Justificativa**:
- Looker permanece fonte única de verdade
- Backend apenas valida, não cria/modifica
- Permite cache para performance
- Mantém consistência de permissões

### 4.4. Princípios Fundamentais

1. **Looker é Fonte Única de Verdade**
   - Todas as permissões vêm do Looker
   - Backend apenas consulta (read-only)
   - Nada é criado/modificado automaticamente

2. **Backend NUNCA Cria Automaticamente**
   - Não cria usuários
   - Não cria groups/roles
   - Não cria models/explores
   - Apenas valida e consulta

3. **Admin Tem Controle Total**
   - Admin cria tudo no Looker manualmente
   - Admin pode usar comandos via chat (com confirmação)
   - Admin registra usuários na aplicação

4. **Usuário Comum é Read-Only**
   - Apenas perguntas sobre dados
   - Nenhuma ação administrativa
   - Acesso restrito aos explores permitidos

5. **Defesa em Profundidade**
   - Múltiplas camadas de validação
   - Looker API valida no final
   - Backend valida antes de enviar
   - MCP valida estrutura da query

---

## 📝 Resumo Executivo

### Autenticação
- Usuários criados manualmente no Looker (por admin)
- Backend apenas valida existência e busca informações
- Login via SSO (futuro) ou OAuth do Looker

### Controle de Comandos
- Usuário comum: apenas perguntas (bloqueio de comandos administrativos)
- Admin: pode usar comandos via chat (com confirmação)
- Backend NUNCA cria/modifica nada automaticamente

### Governança
- Looker API consultada para validar acesso (read-only)
- Backend filtra explores permitidos antes de enviar ao MCP
- LookerMCP executa apenas queries já validadas
- Looker API valida novamente na execução (última linha de defesa)

### Arquitetura
- Looker é fonte única de verdade para permissões
- Backend é camada de validação e cache
- LookerMCP é camada de execução
- Múltiplas validações garantem segurança máxima

---

**Documento criado em**: [Data atual]  
**Versão**: 1.0  
**Status**: Proposta Arquitetural
