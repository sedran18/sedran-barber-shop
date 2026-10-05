<!-- 

# ✂️ Sedran Barber Shop

Sistema Full Stack de alta performance para gestão de barbearias, focado em agendamentos dinâmicos e automação de pagamentos. O projeto utiliza uma arquitetura moderna de **Server Components** e **Server Actions**, garantindo segurança e velocidade no processamento de dados.

🔗 **Link do Projeto:** [sedran-barber-shop.vercel.app](https://sedran-barber-shop.vercel.app/)

---

## 🚀 Funcionalidades Principais

- **Agendamento em Tempo Real:** Fluxo intuitivo para seleção de serviços (Cabelo, Barba, Sobrancelha) com validação de horários.
    
- **Integração com Mercado Pago:** Checkout transparente para pagamentos via Pix.
    
- **Webhooks de Pagamento:** Sistema de escuta ativa que atualiza o status do agendamento no banco de dados automaticamente após a confirmação do pagamento.
    
- **Dashboard Administrativo:** Painel restrito para o barbeiro com métricas de faturamento, ticket médio e controle de agenda.
    
- **Gestão Dinâmica via Environment:** Preços, nomes e descrições configuráveis via variáveis de ambiente, facilitando a manutenção e escalabilidade.
    

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn/UI.
    
- **Backend:** Next.js Server Actions (eliminando a necessidade de APIs REST tradicionais em fluxos internos).
    
- **Banco de Dados:** PostgreSQL hospedado no **Supabase**.
    
- **ORM:** Prisma com suporte a **Connection Pooling** (essencial para ambientes Serverless).
    
- **Pagamentos:** Mercado Pago SDK & Webhooks.
    
- **Segurança:** Auth.js para autenticação e criptografia de dados sensíveis.
    

## 📂 Arquitetura e Organização

O projeto segue uma estrutura modular para facilitar a manutenção:

Plaintext

```
├── app/              # Rotas, Layouts e Server Components
├── lib/actions/      # Server Actions (Lógica de mutação de dados)
├── components/       # Componentes reutilizáveis 
├── lib/constants/    # Configurações e constantes do sistema
├── lib/              # Configurações do Prisma, Auth e Utilitários
├── prisma/           # Schema do banco de dados e Migrations
└── public/           # Ativos estáticos (Logos e Ícones)
```

## ⚙️ Configuração do Ambiente (`.env`)

O sistema é altamente configurável. Abaixo as variáveis necessárias:


```
# Banco de Dados (Supabase + Pooling)
DATABASE_URL="postgres://..." # Transaction mode para a App
DIRECT_URL="postgres://..."   # Session mode para Migrations

# Admin & Segurança
AUTH_SECRET="sua_chave_secreta"
NAME_ADMIN="Admin"
EMAIL_ADMIN="admin@email.com"
PASSWORD_ADMIN="sua_senha"

# Integrações
MERCADO_PAGO_ACCESS_TOKEN="seu_token_mp"
NEXT_PUBLIC_BASE_URL="https://seu-site.vercel.app"

# Preços Dinâmicos
NEXT_PUBLIC_HAIRCUT_PRICE="40"
NEXT_PUBLIC_BEARD_PRICE="25"
NEXT_PUBLIC_EYEBROW_PRICE="15"
``` -->
