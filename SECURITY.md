# 🔐 Segurança do Projeto

## ⚠️ IMPORTANTE: Nunca commitar chaves de API

Este projeto contém chaves sensíveis do Supabase que **NUNCA** devem ser commitadas no repositório Git.

## 📋 Arquivos Sensíveis

Os seguintes arquivos estão no `.gitignore` e não serão commitados:
- `.env.local` - Contém chaves do Supabase
- `.env` - Variáveis de ambiente
- `.env.*.local` - Qualquer arquivo de ambiente local

## 🔑 Chaves do Supabase

### NEXT_PUBLIC_SUPABASE_URL
- URL do seu projeto Supabase
- Pública, mas deve ser mantida em variáveis de ambiente

### NEXT_PUBLIC_SUPABASE_ANON_KEY  
- Chave anônima do Supabase
- Pública, mas deve ser mantida em variáveis de ambiente

### SUPABASE_SERVICE_ROLE_KEY
- 🔒 **ALTAMENTE SENSÍVEL** - Chave de serviço com privilégios administrativos
- **NUNCA** expor no frontend
- **NUNCA** commitar no repositório
- Usar apenas no backend/server-side

## 🚀 Deploy no Netlify

1. **Configure as variáveis no painel do Netlify:**
   - Vá para: Site settings → Build & deploy → Environment
   - Adicione as 3 variáveis de ambiente
   - **NUNCA** coloque as chaves diretamente no código

2. **Variáveis necessárias no Netlify:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico
   ```

## 🛡️ Boas Práticas de Segurança

### ✅ Faça:
- Manter chaves no `.env.local`
- Usar `.gitignore` completo
- Configurar variáveis no painel do Netlify
- Rotacionar chaves se houver suspeita de vazamento

### ❌ NÃO Faça:
- Commitar `.env.local`
- Expor `SUPABASE_SERVICE_ROLE_KEY` no frontend
- Compartilhar chaves em repositórios públicos
- Usar chaves hardcoded no código

## 🔍 Verificação de Segurança

Antes de fazer commit, verifique se:
```bash
# Verificar se .env.local está no gitignore
git status --ignored | grep ".env.local"

# Verificar se não há chaves no código
grep -r "SUPABASE_SERVICE_ROLE_KEY" --exclude-dir=node_modules --exclude-dir=.git .
```

## 📞 Em Caso de Vazamento

Se suspeitar que suas chaves foram expostas:
1. Imediatemente vá ao painel do Supabase
2. Gere novas chaves (Settings → API)
3. Atualize as variáveis de ambiente
4. Revogue as chaves antigas

## 🔄 Rotação de Chaves

Recomendado rotacionar chaves:
- A cada 3-6 meses
- Após qualquer suspeita de comprometimento
- Quando membros da equipe saem

---

**Lembre-se**: Segurança é responsabilidade de todos! Mantenha suas chaves seguras. 🔐
