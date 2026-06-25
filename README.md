# Atena - Sistema de Gestão de Tarefas Multiempresa

Plataforma de gestão de tarefas e projetos com arquitetura **multitenant**, permitindo que múltiplas empresas utilizem o sistema de forma independente com total segregação de dados.

## Stack

| Camada    | Tecnologia                          |
|-----------|-------------------------------------|
| Backend   | Laravel 11 + PHP 8.4 + Sanctum      |
| Frontend  | Next.js 15 + Tailwind CSS 4         |
| Database  | MySQL 8.4                           |
| Cache     | Redis 7                             |
| Proxy     | Nginx (reverse proxy)               |
| Infra     | Docker Compose                      |

### Bibliotecas Frontend

- **react-hook-form** + **zod** — formulários com validação
- **@tanstack/react-query** — data fetching e cache
- **zustand** — estado global (auth)
- **recharts** — gráficos do dashboard
- **lucide-react** — ícones
- **date-fns** — formatação de datas
- **axios** — cliente HTTP

## Funcionalidades (60 Requisitos Funcionais)

- **Multiempresa**: Isolamento total de dados por empresa (RF-001, RF-002)
- **Gestão de Usuários**: CRUD com inativação (RF-003 a RF-005)
- **Gestão de Clientes**: CRUD com filtros (RF-006, RF-007)
- **Gestão de Projetos**: CRUD com encerramento (RF-008 a RF-010)
- **Status Personalizados**: CRUD, ordenação, ativação/inativação (RF-011 a RF-013)
- **Prioridades**: Baixa, Média, Alta, Crítica (RF-014)
- **Gestão de Tarefas**: CRUD, múltiplos responsáveis, comentários, histórico (RF-015 a RF-019)
- **Subtarefas**: CRUD, conclusão individual, progresso automático (RF-020 a RF-022)
- **Controle de Tempo**: Play/Pause/Resume, múltiplos apontamentos, registro manual (RF-023 a RF-028)
- **Controle de Horas**: Estimativa vs realizado, indicadores visuais (RF-029 a RF-032)
- **Sprints**: CRUD com indicadores (RF-033 a RF-036)
- **Kanban**: Colunas por status, drag-and-drop, filtros (RF-037 a RF-040)
- **Tabela**: Colunas configuráveis, ordenação, filtros avançados (RF-041 a RF-043, RF-050, RF-051)
- **Gantt**: Linha do tempo de projetos/tarefas/subtarefas (RF-044 a RF-046)
- **Dashboard**: Indicadores gerais e produtividade por usuário (RF-047 a RF-049)
- **Notificações**: Atribuições, status, prazos, sprints (RF-052)
- **Relatórios**: Horas, tarefas, estimativas (RF-053 a RF-055)

## Pré-requisitos

- Docker 24+ e Docker Compose v2

## Executando em Desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/lucaskaiut/atena.git
cd atena

# 2. (Opcional) Ajuste as portas no arquivo .env se houver conflitos
#    Por padrão: Backend=8000, Frontend=3000, MySQL=3307, Redis=6379

# 3. Suba os containers
docker compose up -d

# 4. Execute as migrations e seeders
docker compose exec backend php artisan migrate:fresh --seed

# 5. Execute os testes
docker compose exec backend php artisan test
```

### Acessos

| Serviço   | URL                     |
|-----------|-------------------------|
| App (Nginx) | http://localhost:80   |

> Nginx atua como reverse proxy: `/` → Frontend, `/api/` → Backend

### Credenciais de Teste (seed)

| Empresa           | Email                         | Senha      |
|-------------------|-------------------------------|------------|
| TechSolutions     | admin@techsolutions.com.br    | password   |
| Inova Digital     | admin@inovadigital.com.br     | password   |

## Estrutura do Projeto

```
atena/
├── .env                    # Configuração de portas e credenciais
├── docker-compose.yml      # Serviços Docker
├── docker/                 # Dockerfiles e scripts
│   ├── backend/Dockerfile
│   ├── frontend/Dockerfile
│   ├── nginx/default.conf
│   └── mysql/init.sql
├── backend/                # Laravel API
│   ├── app/
│   │   ├── Enums/          # PriorityEnum, TaskStatusEnum, etc.
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # 17 controllers REST
│   │   │   ├── Middleware/       # SetCompanyFromUser
│   │   │   ├── Requests/         # Form Requests com validação
│   │   │   └── Resources/        # API Resources
│   │   ├── Interfaces/     # Contratos de repositórios
│   │   ├── Models/         # 13 modelos Eloquent
│   │   ├── Policies/       # Autorização por empresa
│   │   ├── Repositories/   # Implementações dos repositórios
│   │   ├── Services/       # Camada de negócio (14 serviços)
│   │   └── Traits/         # BelongsToCompany (multitenant)
│   ├── database/
│   │   ├── migrations/     # 17 migrações
│   │   └── seeders/        # DatabaseSeeder
│   └── tests/
│       ├── Feature/        # 52 testes de integração
│       └── Unit/           # 5 testes unitários
└── frontend/               # Next.js App
    └── src/
        ├── app/            # 20 rotas (App Router)
        ├── components/     # UI, forms, kanban, gantt, etc.
        ├── hooks/          # 12 hooks com react-query
        ├── lib/            # api.ts, validators.ts, utils.ts
        ├── stores/         # Zustand authStore
        ├── providers/      # QueryProvider, AuthProvider
        └── types/          # TypeScript interfaces
```

## Arquitetura Backend (SOLID)

- **S**ingle Responsibility: Controllers, Services e Repositories com responsabilidades únicas
- **O**pen/Closed: Interfaces permitem extensão sem modificação
- **L**iskov Substitution: Repository pattern com contratos bem definidos
- **I**nterface Segregation: Interfaces focadas por domínio
- **D**ependency Inversion: Controllers dependem de abstrações (interfaces), não de implementações concretas

### Multi-tenancy

O isolamento de dados é implementado via:
- Global Scope `BelongsToCompany` em todos os modelos tenant
- Middleware `SetCompanyFromUser` que injeta o contexto da empresa
- Todas as queries são automaticamente filtradas por `company_id`

## Portas

As portas são configuráveis via `.env` na raiz do projeto:

```env
NGINX_PORT=80          # Porta principal de acesso (frontend + api)
BACKEND_PORT=8000      # Acesso direto ao backend (debug)
FRONTEND_PORT=3000     # Acesso direto ao frontend (debug)
MYSQL_PORT=3307
REDIS_PORT=6379
```

Altere os valores se as portas padrão estiverem em uso por outros projetos.

## Comandos Úteis

```bash
# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Executar comandos artisan
docker compose exec backend php artisan <comando>

# Rodar testes
docker compose exec backend php artisan test

# Parar todos os serviços
docker compose down

# Parar e remover volumes (reset completo)
docker compose down -v
```
