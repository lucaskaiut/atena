<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Company;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Status;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 2 companies
        $company1 = Company::create([
            'name' => 'Tech Solutions Ltda',
            'corporate_name' => 'Tech Solutions Tecnologia Ltda',
            'trade_name' => 'Tech Solutions',
            'cnpj' => '12.345.678/0001-90',
            'email' => 'contato@techsolutions.com.br',
            'phone' => '(11) 3456-7890',
            'address' => ['street' => 'Av. Paulista', 'number' => '1000', 'city' => 'São Paulo', 'state' => 'SP'],
            'status' => 'active',
        ]);

        $company2 = Company::create([
            'name' => 'Inova Digital S.A.',
            'corporate_name' => 'Inova Digital Serviços S.A.',
            'trade_name' => 'Inova Digital',
            'cnpj' => '98.765.432/0001-10',
            'email' => 'contato@inovadigital.com.br',
            'phone' => '(21) 98765-4321',
            'address' => ['street' => 'Rua da Inovação', 'number' => '500', 'city' => 'Rio de Janeiro', 'state' => 'RJ'],
            'status' => 'active',
        ]);

        // Create users for each company
        $admin1 = User::create([
            'name' => 'Admin Tech',
            'email' => 'admin@techsolutions.com.br',
            'password' => Hash::make('password'),
            'company_id' => $company1->id,
            'phone' => '(11) 99999-0001',
            'position' => 'Administrador',
            'status' => 'active',
        ]);

        for ($i = 1; $i <= 4; $i++) {
            User::create([
                'name' => "Usuário Tech {$i}",
                'email' => "user{$i}@techsolutions.com.br",
                'password' => Hash::make('password'),
                'company_id' => $company1->id,
                'phone' => "(11) 99999-000{$i}",
                'position' => $i === 1 ? 'Gerente de Projetos' : ($i === 2 ? 'Desenvolvedor' : ($i === 3 ? 'Designer' : 'Analista')),
                'status' => 'active',
            ]);
        }

        $admin2 = User::create([
            'name' => 'Admin Inova',
            'email' => 'admin@inovadigital.com.br',
            'password' => Hash::make('password'),
            'company_id' => $company2->id,
            'phone' => '(21) 99999-0001',
            'position' => 'Administrador',
            'status' => 'active',
        ]);

        for ($i = 1; $i <= 4; $i++) {
            User::create([
                'name' => "Usuário Inova {$i}",
                'email' => "user{$i}@inovadigital.com.br",
                'password' => Hash::make('password'),
                'company_id' => $company2->id,
                'phone' => "(21) 99999-000{$i}",
                'position' => $i === 1 ? 'Gerente de Projetos' : ($i === 2 ? 'Desenvolvedor' : ($i === 3 ? 'QA' : 'Analista')),
                'status' => 'active',
            ]);
        }

        // Create default statuses for each company
        $statusNames = [
            ['name' => 'backlog', 'color' => '#6B7280', 'position' => 0],
            ['name' => 'todo', 'color' => '#3B82F6', 'position' => 1],
            ['name' => 'in_progress', 'color' => '#F59E0B', 'position' => 2],
            ['name' => 'review', 'color' => '#8B5CF6', 'position' => 3],
            ['name' => 'approval', 'color' => '#EC4899', 'position' => 4],
            ['name' => 'done', 'color' => '#10B981', 'position' => 5],
            ['name' => 'cancelled', 'color' => '#EF4444', 'position' => 6],
        ];

        foreach ([$company1, $company2] as $company) {
            foreach ($statusNames as $statusData) {
                Status::create(array_merge($statusData, ['company_id' => $company->id]));
            }
        }

        $statuses1 = Status::where('company_id', $company1->id)->pluck('id', 'name');
        $statuses2 = Status::where('company_id', $company2->id)->pluck('id', 'name');

        // Create clients for company1
        $client1 = Client::create([
            'company_id' => $company1->id,
            'name' => 'João Silva',
            'corporate_name' => 'Silva Comércio Ltda',
            'document' => '111.222.333-44',
            'email' => 'joao@silvacomercio.com.br',
            'phone' => '(11) 2222-3333',
            'contact_person' => 'João Silva',
            'notes' => 'Cliente desde 2023',
            'status' => 'active',
        ]);

        $client2 = Client::create([
            'company_id' => $company1->id,
            'name' => 'Maria Souza',
            'corporate_name' => 'Souza Indústria S.A.',
            'document' => '55.666.777/0001-88',
            'email' => 'maria@souzaindustria.com.br',
            'phone' => '(11) 4444-5555',
            'contact_person' => 'Maria Souza',
            'status' => 'active',
        ]);

        // Create projects for company1
        $project1 = Project::create([
            'company_id' => $company1->id,
            'client_id' => $client1->id,
            'name' => 'Sistema de Gestão ERP',
            'description' => 'Desenvolvimento de sistema ERP completo para gestão empresarial',
            'manager_id' => $admin1->id,
            'start_date' => '2025-01-15',
            'expected_end_date' => '2025-12-31',
            'priority' => 'high',
            'status_id' => $statuses1['in_progress'],
        ]);

        $project2 = Project::create([
            'company_id' => $company1->id,
            'client_id' => $client2->id,
            'name' => 'Portal E-commerce',
            'description' => 'Portal de vendas online com integração de pagamentos',
            'manager_id' => $admin1->id,
            'start_date' => '2025-03-01',
            'expected_end_date' => '2025-09-30',
            'priority' => 'medium',
            'status_id' => $statuses1['todo'],
        ]);

        // Create sprints for project1
        $sprint1 = Sprint::create([
            'company_id' => $company1->id,
            'project_id' => $project1->id,
            'name' => 'Sprint 1 - MVP',
            'goal' => 'Desenvolver funcionalidades básicas do ERP',
            'start_date' => '2025-01-15',
            'end_date' => '2025-02-15',
            'status' => 'completed',
        ]);

        $sprint2 = Sprint::create([
            'company_id' => $company1->id,
            'project_id' => $project1->id,
            'name' => 'Sprint 2 - Financeiro',
            'goal' => 'Implementar módulo financeiro',
            'start_date' => '2025-02-16',
            'end_date' => '2025-03-15',
            'status' => 'active',
        ]);

        // Create tasks
        $task1 = Task::create([
            'company_id' => $company1->id,
            'project_id' => $project1->id,
            'title' => 'Cadastro de clientes',
            'description' => 'CRUD completo para cadastro de clientes',
            'priority' => 'high',
            'status_id' => $statuses1['done'],
            'sprint_id' => $sprint1->id,
            'start_date' => '2025-01-15',
            'expected_end_date' => '2025-01-25',
            'estimated_hours' => 20,
        ]);

        $task2 = Task::create([
            'company_id' => $company1->id,
            'project_id' => $project1->id,
            'title' => 'Relatório de contas a pagar',
            'description' => 'Gerar relatórios de contas a pagar com filtros',
            'priority' => 'high',
            'status_id' => $statuses1['in_progress'],
            'sprint_id' => $sprint2->id,
            'start_date' => '2025-02-16',
            'expected_end_date' => '2025-03-10',
            'estimated_hours' => 16,
        ]);

        $task3 = Task::create([
            'company_id' => $company1->id,
            'project_id' => $project1->id,
            'title' => 'Dashboard financeiro',
            'description' => 'Dashboard com indicadores financeiros',
            'priority' => 'medium',
            'status_id' => $statuses1['backlog'],
            'sprint_id' => $sprint2->id,
            'start_date' => '2025-03-01',
            'expected_end_date' => '2025-03-15',
            'estimated_hours' => 24,
        ]);

        // Create clients for company2
        $client3 = Client::create([
            'company_id' => $company2->id,
            'name' => 'Pedro Alves',
            'corporate_name' => 'Alves Consultoria Ltda',
            'document' => '99.888.777/0001-66',
            'email' => 'pedro@alvesconsultoria.com.br',
            'phone' => '(21) 3333-4444',
            'contact_person' => 'Pedro Alves',
            'status' => 'active',
        ]);

        $project3 = Project::create([
            'company_id' => $company2->id,
            'client_id' => $client3->id,
            'name' => 'App Mobile Delivery',
            'description' => 'Aplicativo mobile para delivery de alimentos',
            'manager_id' => $admin2->id,
            'start_date' => '2025-04-01',
            'expected_end_date' => '2025-10-15',
            'priority' => 'critical',
            'status_id' => $statuses2['in_progress'],
        ]);

        Sprint::create([
            'company_id' => $company2->id,
            'project_id' => $project3->id,
            'name' => 'Sprint 1 - App',
            'goal' => 'Desenvolver funcionalidades iniciais do app',
            'start_date' => '2025-04-01',
            'end_date' => '2025-04-30',
            'status' => 'active',
        ]);
    }
}
