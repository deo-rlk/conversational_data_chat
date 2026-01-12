# Pontos Pendentes para Produção

Este documento lista as principais alterações e implementações necessárias para migrar este protótipo para um ambiente de produção seguro.

## 🔴 Crítico - Implementar Imediatamente

### 1. Autenticação Real
**Status Atual**: Mock de autenticação no frontend usando localStorage

**Para Produção**:
- Implementar autenticação real usando NextAuth.js com provider Google OAuth real
- Validar tokens JWT no backend
- Implementar refresh tokens
- Armazenar sessões em banco de dados seguro (não localStorage)
- Implementar logout seguro com revogação de tokens

**Localização**: `lib/auth.ts`, `components/auth/LoginForm.tsx`

---

### 2. Client Secret e Credenciais Sensíveis
**Status Atual**: Client Secret armazenado no formulário do frontend

**Para Produção**:
- **NUNCA** armazenar Client Secret no frontend
- Mover todas as credenciais para variáveis de ambiente no backend
- Usar serviços de gerenciamento de segredos (AWS Secrets Manager, HashiCorp Vault, etc.)
- Criptografar credenciais em repouso
- Implementar rotação de credenciais

**Localização**: `components/admin/environments/AddEnvironmentForm.tsx`

---

### 3. Validação de Roles e RBAC no Backend
**Status Atual**: Validação de roles simulada no frontend, toggle de dev permite mudança

**Para Produção**:
- Implementar validação de roles no backend em todas as rotas protegidas
- Remover toggle de dev role (apenas para desenvolvimento)
- Validar permissões antes de cada ação administrativa
- Implementar middleware de autorização
- Registrar tentativas de acesso não autorizado (audit log)

**Localização**: `components/layout/AuthLayout.tsx`, `components/auth/DevRoleToggle.tsx`, todas as rotas `/admin/*`

---

### 4. Integração Real com Looker SDK
**Status Atual**: Mocks que simulam chamadas à API do Looker

**Para Produção**:
- Implementar integração real com Looker SDK
- Configurar autenticação OAuth2 do Looker
- Implementar tratamento de erros robusto
- Adicionar rate limiting
- Implementar cache de queries quando apropriado
- Monitorar uso da API do Looker

**Localização**: `lib/mocks.ts`, `app/api/mock/looker/*`

---

### 5. Execução de MCP no Servidor
**Status Atual**: Mock de queries MCP no frontend

**Para Produção**:
- Executar todas as queries MCP no backend (nunca no cliente)
- Implementar fila de processamento para queries longas
- Validar e sanitizar inputs antes de executar queries
- Implementar timeout para queries
- Registrar todas as queries executadas (audit log)
- Implementar controle de rate limiting por usuário

**Localização**: `lib/mocks.ts`, `app/api/mock/mcp/query/route.ts`

---

## 🟡 Importante - Implementar Antes do Deploy

### 6. Contagem de Perguntas no Backend
**Status Atual**: Contador armazenado em localStorage, sem reset diário

**Para Produção**:
- Armazenar contadores em banco de dados
- Implementar reset diário automático (cron job ou scheduler)
- Validar limites antes de permitir nova pergunta
- Implementar diferentes limites por plano/role
- Registrar histórico de uso

**Localização**: `contexts/QuestionLimitContext.tsx`, `hooks/useQuestionLimit.ts`

---

### 7. Persistência de Dados
**Status Atual**: Dados armazenados em localStorage (ambientes, usuários)

**Para Produção**:
- Migrar todos os dados para banco de dados (PostgreSQL, MongoDB, etc.)
- Implementar migrações de schema
- Implementar backup automático
- Implementar versionamento de dados
- Usar transações para operações críticas

**Localização**: Todos os componentes que usam `localStorage.setItem/getItem`

---

### 8. Audit Logs
**Status Atual**: Nenhum log de auditoria implementado

**Para Produção**:
- Registrar todas as ações administrativas (criar/editar/excluir ambientes, adicionar/remover usuários)
- Registrar todas as queries executadas
- Registrar tentativas de acesso não autorizado
- Armazenar logs em sistema centralizado (ELK, Splunk, CloudWatch, etc.)
- Implementar retenção de logs conforme políticas de compliance

**Localização**: Todas as rotas administrativas, endpoints de API

---

### 9. Validação de Inputs e Sanitização
**Status Atual**: Validação básica no frontend

**Para Produção**:
- Validar e sanitizar todos os inputs no backend
- Implementar schema validation (Zod, Yup, etc.)
- Proteger contra SQL injection (usar ORM/query builders)
- Proteger contra XSS (sanitizar HTML)
- Implementar rate limiting por IP/usuário
- Validar URLs e formatos de dados antes de processar

**Localização**: Todos os formulários, endpoints de API

---

### 10. Tratamento de Erros
**Status Atual**: Tratamento básico de erros, mensagens genéricas

**Para Produção**:
- Implementar logging estruturado de erros
- Não expor detalhes internos de erros ao cliente
- Implementar códigos de erro padronizados
- Monitorar erros com ferramentas (Sentry, Datadog, etc.)
- Implementar retry logic para operações idempotentes
- Implementar circuit breakers para serviços externos

**Localização**: Todos os componentes, endpoints de API

---

### 11. CORS e Segurança HTTP
**Status Atual**: Configuração padrão do Next.js

**Para Produção**:
- Configurar CORS adequadamente
- Implementar HTTPS obrigatório
- Configurar headers de segurança (CSP, HSTS, X-Frame-Options, etc.)
- Implementar CSRF protection
- Validar origem das requisições

**Localização**: `next.config.js`, middleware

---

### 12. Testes
**Status Atual**: Nenhum teste implementado

**Para Produção**:
- Implementar testes unitários para lógica de negócio
- Implementar testes de integração para APIs
- Implementar testes end-to-end para fluxos críticos
- Implementar testes de segurança (OWASP Top 10)
- Configurar CI/CD com testes automatizados

---

## 🟢 Melhorias Recomendadas

### 13. Performance
- Implementar cache de queries frequentes
- Otimizar bundle size (code splitting)
- Implementar lazy loading de componentes
- Otimizar imagens e assets
- Implementar CDN para assets estáticos

### 14. Monitoramento e Observabilidade
- Implementar métricas (Prometheus, CloudWatch)
- Implementar alertas para erros críticos
- Monitorar performance (APM)
- Implementar health checks
- Dashboard de métricas de uso

### 15. Documentação de API
- Documentar todos os endpoints (OpenAPI/Swagger)
- Documentar fluxos de autenticação
- Documentar limites e rate limits
- Documentar códigos de erro

### 16. Internacionalização (i18n)
- Se aplicável, implementar suporte a múltiplos idiomas
- Externalizar strings de texto

---

## 📝 Checklist de Migração

Antes de colocar em produção, verificar:

- [ ] Autenticação real implementada e testada
- [ ] Todas as credenciais em variáveis de ambiente
- [ ] Validação de roles no backend em todas as rotas
- [ ] Integração real com Looker implementada e testada
- [ ] Queries MCP executadas no backend
- [ ] Contadores de perguntas em banco de dados com reset diário
- [ ] Todos os dados migrados de localStorage para banco de dados
- [ ] Audit logs implementados e funcionando
- [ ] Validação e sanitização de inputs no backend
- [ ] Tratamento de erros robusto implementado
- [ ] CORS e headers de segurança configurados
- [ ] Testes automatizados implementados
- [ ] Documentação de API completa
- [ ] Monitoramento e alertas configurados
- [ ] Backup e disaster recovery plan definido

---

**Última atualização**: Versão do protótipo
**Responsável**: Equipe de Desenvolvimento
