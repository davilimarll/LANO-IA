# 🤖 Lano IA - Assistente Conversacional com Corpo Visual

Uma aplicação de IA conversacional com um corpo visual animado (bolinha que se move pela tela), construída com Next.js 16 e integrada com z-ai-web-dev-sdk.

## 🎨 Recursos

- 💬 **Chat Interativo**: Converse com a IA em português
- 🎱 **Corpo Visual**: A IA tem uma bolinha animada que se move pela tela
- ✨ **Animações**: A bolinha reage quando a IA está pensando ou respondendo
- 🖱️ **Interação**: Clique na bolinha para movê-la pela tela
- 📱 **Responsivo**: Funciona perfeitamente em mobile e desktop
- 🎭 **Personalidade**: A IA (Lano IA) tem personalidade amigável e brincalhona

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- Bun (recomendado) ou npm/yarn

### Instalação

```bash
# Instalar dependências
bun install

# Executar em desenvolvimento
bun run dev
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração para Produção (Vercel)

### Variáveis de Ambiente

Para funcionar corretamente no Vercel, você precisa configurar as seguintes variáveis de ambiente:

1. **ZAI_BASE_URL**: URL base da API do Z.ai
2. **ZAI_API_KEY**: Chave de API do Z.ai
3. **ZAI_CHAT_ID** (opcional): ID do chat
4. **ZAI_USER_ID** (opcional): ID do usuário

### Configurando no Vercel

1. Vá para o dashboard do Vercel
2. Selecione seu projeto
3. Navegue para **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

```
ZAI_BASE_URL = https://api.z.ai/v1  # Substitua pela URL real
ZAI_API_KEY = sua_api_key_aqui       # Substitua pela sua chave real
```

5. Clique em **Save**
6. Faça um novo deploy

## 📁 Estrutura do Projeto

```
lano-ia/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # API endpoint para chat
│   │   ├── page.tsx                # Página principal com UI
│   │   └── layout.tsx              # Layout da aplicação
│   └── components/
│       └── ui/                     # Componentes shadcn/ui
├── prisma/
│   └── schema.prisma               # Schema do banco de dados
├── .z-ai-config                   # Configuração do SDK (local)
└── package.json
```

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 16 com App Router
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **IA**: z-ai-web-dev-sdk
- **Icons**: Lucide React
- **Database**: Prisma ORM + SQLite

## 🤖 Como a IA Funciona

A aplicação usa o SDK z-ai-web-dev-sdk para se comunicar com o modelo de linguagem. O fluxo é:

1. Usuário envia uma mensagem via interface de chat
2. Frontend faz POST para `/api/chat`
3. Backend usa ZAI SDK para gerar resposta
4. Resposta é enviada de volta ao frontend
5. A bolinha animada reage durante todo o processo

## 🎨 Design e UX

- **Gradiente**: Tons de roxo e rosa
- **Animações**: Suaves e fluidas
- **Acessibilidade**: Componentes com suporte ARIA
- **Feedback Visual**: Indicadores de carregamento e estados
- **Footer Sticky**: Sempre fixo na parte inferior

## 📝 Personalidade da IA

A Lano IA foi configurada com as seguintes características:

- **Idioma**: Português (respondendo em outras línguas se solicitado)
- **Tom**: Amigável, brincalhão e prestativo
- **Comportamento**: Menciona que está se movendo enquanto pensa
- **Emojis**: Usa emojis para tornar a conversa mais envolvente

## 🔧 Solução de Problemas

### Erro: "Configuration file not found or invalid"

O código foi projetado para criar automaticamente o arquivo de configuração. Se o erro persistir:

1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Faça um novo deploy manual
3. Verifique os logs do Vercel para detalhes

### A IA não responde

1. Verifique se `ZAI_BASE_URL` e `ZAI_API_KEY` estão corretos
2. Confirme que a URL da API é acessível
3. Verifique os logs do servidor para erros

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👤 Autor

Desenvolvido por Davi Ribeiro

---

**Nota**: Este projeto foi criado usando a plataforma Z.ai Code. Para mais informações, visite [Z.ai](https://z.ai).
