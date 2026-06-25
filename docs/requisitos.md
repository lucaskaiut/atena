# DOCUMENTO DE REQUISITOS FUNCIONAIS

# Sistema de Gestão de Tarefas Multiempresa (Multitenant)

## 1. Objetivo

Desenvolver uma plataforma de gestão de tarefas e projetos que permita que múltiplas empresas utilizem o sistema de forma independente, mantendo total segregação de dados entre elas.

A solução deverá possibilitar o gerenciamento completo de clientes, projetos, tarefas, subtarefas, sprints e apontamentos de horas, oferecendo diferentes formas de visualização e acompanhamento da produtividade.

---

# 2. Cadastro e Gestão de Empresas

## RF-001 – Cadastro de Empresa

O sistema deverá permitir o cadastro de empresas.

### Dados mínimos:

* Nome da empresa
* Razão social
* Nome fantasia
* CNPJ
* E-mail
* Telefone
* Endereço
* Data de cadastro
* Status da empresa

---

## RF-002 – Isolamento de Dados

Cada empresa deverá possuir acesso exclusivamente aos seus próprios dados.

Os seguintes registros deverão ser isolados por empresa:

* Usuários
* Clientes
* Projetos
* Tarefas
* Subtarefas
* Sprints
* Apontamentos
* Status
* Configurações

---

# 3. Gestão de Usuários

## RF-003 – Cadastro de Usuários

O sistema deverá permitir o cadastro de usuários vinculados a uma empresa.

### Dados mínimos:

* Nome
* E-mail
* Telefone
* Cargo
* Status

---

## RF-004 – Edição de Usuários

O sistema deverá permitir alterar informações cadastrais dos usuários.

---

## RF-005 – Inativação de Usuários

O sistema deverá permitir inativar usuários sem excluir seu histórico de trabalho.

---

# 4. Gestão de Clientes

## RF-006 – Cadastro de Clientes

O sistema deverá permitir cadastrar clientes para cada empresa.

### Dados mínimos:

* Nome
* Razão social
* Documento
* E-mail
* Telefone
* Responsável
* Observações
* Status

---

## RF-007 – Consulta de Clientes

O sistema deverá permitir pesquisar e filtrar clientes.

### Filtros:

* Nome
* Status
* Data de cadastro

---

# 5. Gestão de Projetos

## RF-008 – Cadastro de Projetos

O sistema deverá permitir criar projetos vinculados a um cliente.

### Dados mínimos:

* Nome do projeto
* Cliente
* Descrição
* Responsável
* Data de início
* Data prevista de término
* Prioridade
* Status
* Sprint atual

---

## RF-009 – Consulta de Projetos

O sistema deverá permitir visualizar todos os projetos da empresa.

### Filtros:

* Cliente
* Responsável
* Status
* Prioridade
* Sprint
* Data

---

## RF-010 – Encerramento de Projeto

O sistema deverá permitir concluir ou cancelar projetos.

---

# 6. Gestão de Status

## RF-011 – Cadastro de Status

O sistema deverá permitir cadastrar status personalizados.

### Exemplos:

* Backlog
* A Fazer
* Em Andamento
* Em Revisão
* Homologação
* Concluído
* Cancelado

---

## RF-012 – Ordenação de Status

O sistema deverá permitir definir a ordem de exibição dos status.

---

## RF-013 – Ativação e Inativação

O sistema deverá permitir ativar e inativar status.

---

# 7. Gestão de Prioridades

## RF-014 – Prioridade da Tarefa

Toda tarefa deverá possuir uma prioridade.

### Exemplos:

* Baixa
* Média
* Alta
* Crítica

---

# 8. Gestão de Tarefas

## RF-015 – Cadastro de Tarefas

O sistema deverá permitir cadastrar tarefas vinculadas a um projeto.

### Dados mínimos:

* Título
* Descrição
* Projeto
* Responsável
* Prioridade
* Status
* Sprint
* Data de início
* Data prevista de término
* Estimativa de horas

---

## RF-016 – Edição de Tarefas

O sistema deverá permitir alterar qualquer informação da tarefa.

---

## RF-017 – Atribuição de Responsáveis

O sistema deverá permitir atribuir um ou mais usuários responsáveis por uma tarefa.

---

## RF-018 – Comentários

O sistema deverá permitir registrar comentários em tarefas.

Cada comentário deverá registrar:

* Autor
* Data
* Hora
* Conteúdo

---

## RF-019 – Histórico de Alterações

O sistema deverá manter histórico de alterações das tarefas.

### Exemplos:

* Mudança de status
* Mudança de responsável
* Mudança de prioridade
* Alteração de estimativa

---

# 9. Gestão de Subtarefas

## RF-020 – Cadastro de Subtarefas

O sistema deverá permitir cadastrar subtarefas vinculadas a uma tarefa.

### Dados mínimos:

* Título
* Responsável
* Status
* Estimativa

---

## RF-021 – Conclusão de Subtarefas

O sistema deverá permitir concluir subtarefas individualmente.

---

## RF-022 – Progresso da Tarefa

O sistema deverá calcular automaticamente o percentual de conclusão da tarefa com base nas subtarefas concluídas.

---

# 10. Controle de Tempo

## RF-023 – Iniciar Apontamento

O sistema deverá permitir iniciar a contagem de tempo em uma tarefa através do botão "Play".

Ao iniciar:

* Registrar data e hora de início
* Registrar usuário responsável

---

## RF-024 – Pausar Apontamento

O sistema deverá permitir interromper a contagem através do botão "Pause".

Ao pausar:

* Registrar data e hora de término
* Calcular o período trabalhado

---

## RF-025 – Retomar Apontamento

O sistema deverá permitir reiniciar um apontamento pausado.

---

## RF-026 – Múltiplos Apontamentos

Uma tarefa poderá possuir diversos apontamentos de trabalho.

---

## RF-027 – Histórico de Apontamentos

O sistema deverá armazenar:

* Usuário
* Data
* Hora inicial
* Hora final
* Tempo total

---

## RF-028 – Registro Manual

O sistema deverá permitir lançar apontamentos manualmente.

---

# 11. Controle de Horas

## RF-029 – Estimativa de Esforço

Toda tarefa deverá possuir uma estimativa de horas.

---

## RF-030 – Horas Trabalhadas

O sistema deverá calcular automaticamente o total de horas apontadas.

---

## RF-031 – Comparativo Estimado x Realizado

O sistema deverá exibir:

* Horas estimadas
* Horas apontadas
* Diferença
* Percentual consumido

---

## RF-032 – Indicadores Visuais

O sistema deverá apresentar indicadores para identificar:

* Dentro da estimativa
* Próximo do limite
* Estimativa excedida

---

# 12. Gestão de Sprints

## RF-033 – Cadastro de Sprint

O sistema deverá permitir criar sprints.

### Dados mínimos:

* Nome
* Objetivo
* Data de início
* Data de término
* Status

---

## RF-034 – Vinculação de Tarefas

O sistema deverá permitir vincular tarefas a uma sprint.

---

## RF-035 – Encerramento de Sprint

O sistema deverá permitir concluir uma sprint.

---

## RF-036 – Indicadores da Sprint

O sistema deverá exibir:

* Total de tarefas
* Tarefas concluídas
* Tarefas pendentes
* Horas estimadas
* Horas realizadas

---

# 13. Visualização Kanban

## RF-037 – Quadro Kanban

O sistema deverá disponibilizar visualização em Kanban.

---

## RF-038 – Colunas por Status

Cada coluna deverá representar um status cadastrado.

---

## RF-039 – Movimentação

O sistema deverá permitir mover tarefas entre colunas.

Ao mover:

* Atualizar automaticamente o status

---

## RF-040 – Filtros do Kanban

Permitir filtrar por:

* Projeto
* Cliente
* Responsável
* Sprint
* Prioridade
* Status

---

# 14. Visualização em Tabela

## RF-041 – Lista de Tarefas

O sistema deverá disponibilizar visualização tabular.

---

## RF-042 – Colunas Configuráveis

Permitir exibir:

* Projeto
* Cliente
* Responsável
* Prioridade
* Status
* Sprint
* Estimativa
* Horas apontadas
* Data de início
* Data de término

---

## RF-043 – Ordenação

Permitir ordenar por qualquer coluna.

---

# 15. Visualização Gantt

## RF-044 – Cronograma

O sistema deverá disponibilizar visualização em Gantt.

---

## RF-045 – Linha do Tempo

O sistema deverá exibir:

* Projetos
* Tarefas
* Subtarefas
* Datas

---

## RF-046 – Atualização Automática

As alterações de datas deverão refletir automaticamente no cronograma.

---

# 16. Dashboard

## RF-047 – Dashboard Geral

O sistema deverá disponibilizar um painel com indicadores.

---

## RF-048 – Indicadores

Exibir:

* Projetos ativos
* Tarefas pendentes
* Tarefas concluídas
* Horas apontadas
* Horas estimadas
* Tarefas atrasadas
* Sprints ativas

---

## RF-049 – Produtividade por Usuário

O sistema deverá apresentar indicadores individuais de produtividade.

---

# 17. Pesquisa e Filtros

## RF-050 – Pesquisa Global

O sistema deverá permitir pesquisar:

* Clientes
* Projetos
* Tarefas
* Subtarefas

---

## RF-051 – Filtros Avançados

Permitir combinar múltiplos filtros simultaneamente.

---

# 18. Notificações

## RF-052 – Notificações do Sistema

O sistema deverá gerar notificações para:

* Nova tarefa atribuída
* Alteração de status
* Alteração de responsável
* Aproximação da data de vencimento
* Sprint iniciada
* Sprint encerrada

---

# 19. Relatórios

## RF-053 – Relatório de Horas

Permitir visualizar horas trabalhadas por:

* Usuário
* Projeto
* Cliente
* Sprint

---

## RF-054 – Relatório de Tarefas

Permitir visualizar:

* Tarefas abertas
* Tarefas concluídas
* Tarefas atrasadas

---

## RF-055 – Relatório de Estimativas

Permitir comparar esforço planejado versus realizado.

---

# 20. Regras Gerais

## RF-056

Toda tarefa deverá estar vinculada a um projeto.

---

## RF-057

Todo projeto deverá estar vinculado a um cliente.

---

## RF-058

Toda subtarefa deverá estar vinculada a uma tarefa.

---

## RF-059

Os apontamentos de horas deverão impactar automaticamente os indicadores de produtividade e controle de horas.

---

## RF-060

Todas as informações deverão respeitar o isolamento de dados da empresa proprietária dos registros.
