# Projeto Concessionária de Carros Clássicos (Full-Stack)

Bem-vindo ao projeto **Concessionária de Carros Clássicos**, uma aplicação web **full-stack** completa que combina tecnologia moderna, arquitetura bem estruturada e uma experiência de usuário dinâmica.  

Este projeto foi desenvolvido para simular o ambiente de uma concessionária real, permitindo que **clientes explorem uma vitrine de veículos clássicos**, enquanto os administradores podem **gerenciar carros, clientes, vendedores e vendas** de forma prática e eficiente.  

O sistema foi cuidadosamente projetado para refletir as necessidades de um negócio real, incluindo:  
- **Vitrine pública interativa**: exibe os carros disponíveis para venda com fotos, preços e descrições detalhadas.  
- **Área administrativa robusta**: permite o cadastro e atualização de registros de veículos, clientes, vendedores e vendas.  
- **Fluxo de vendas inteligente**: agiliza o processo de venda e mantém um histórico completo das transações.  
- **Validação de dados e consistência**: impede vendas duplicadas, garante integridade referencial e formatação adequada de entradas como CPF, telefone, matrícula e valores monetários.  

O projeto foi construído com tecnologias modernas e **conteinerizado com Docker**, garantindo que qualquer pessoa possa executá-lo localmente ou em produção de forma consistente, sem a complexidade de instalar e configurar manualmente cada dependência.  

Além disso, a aplicação segue uma arquitetura **modular e escalável**, separando claramente **frontend, backend e banco de dados**, facilitando futuras expansões, manutenção e integração com novos serviços.

---

## Arquitetura

A aplicação é organizada em três principais serviços, definidos no `docker-compose.yml`:

- **Backend (classic-car-api)**  
  - Desenvolvido em **Java 17+** com **Spring Boot 3.x**.  
  - Exposição de **API RESTful** para operações de CRUD.  
  - Camadas: `controller`, `service`, `repository` e `model`.  
  - Porta: `8080`.

- **Frontend (classic-car-frontend)**  
  - Desenvolvido em **HTML5, CSS3 e JavaScript (ES6+)**.  
  - Exibe a vitrine pública de carros e integra com a API.  
  - Servido pelo **Nginx**.  
  - Porta: `5173`.

- **Banco de Dados (db)**  
  - Utiliza **PostgreSQL**.  
  - Gerencia todas as entidades (Carros, Clientes, Vendedores e Vendas).  
  - Porta: `5432`.

---

## Fluxo de Dados

```txt
flowchart LR
    U[Usuário] -->|Acessa site| FE[Frontend - Nginx]
    FE -->|Requisições HTTP (fetch)| BE[Backend - Spring Boot]
    BE -->|Consultas SQL| DB[(PostgreSQL)]
    DB -->|Respostas (dados)| BE
    BE -->|JSON| FE
    FE -->|Renderização dinâmica| U
```

## Fluxo de Funcionamento

1. O usuário acessa [http://localhost:5173](http://localhost:5173) (frontend).  
2. O frontend realiza chamadas `fetch()` para a API backend em [http://localhost:8080](http://localhost:8080).  
3. O backend processa a requisição e consulta o **PostgreSQL**.  
4. Os dados retornam em **JSON** e são renderizados dinamicamente no navegador.  

---

## Tecnologias Utilizadas

### Backend
- **Java 17+**  
- **Spring Boot 3.x** (Spring Web, Spring Data JPA, Validation)  
- **PostgreSQL**  
- **Maven**

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**  
- **IMask.js** (máscara de inputs)  
- **Nginx**

### Infraestrutura
- **Docker** e **Docker Compose**

---

## Configuração e Execução

### Pré-requisitos
- Docker e Docker Compose instalados.  
- Repositório clonado localmente.  

### Variáveis de Ambiente
Crie o arquivo `.env` na raiz do projeto:
```bash
DB_NAME=concessionaria
DB_USERNAME=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=db
DB_PORT=5432
```

### Inicialização

Na raiz do repositório:
```bash
docker compose up --build -d
```

### Acesso

- **Backend:** [http://localhost:8080](http://localhost:8080)  
- **Frontend:** [http://localhost:5173](http://localhost:5173)  

### Funcionalidades

- Cadastro de **Carros, Clientes, Vendedores e Vendas**  
- **CRUD completo** via API RESTful  
- **Prevenção de vendas duplicadas** (um carro vendido não pode ser vendido novamente)  
- **Upload de imagens** de veículos armazenadas no diretório `uploads/`  
- **Validações automáticas** (tamanho de campos, formatos, integridade referencial)  
- **Fluxo completo:** cadastro → listagem → venda → registro

```markdown
## Testes

Funcionalidades testadas via:  
- Insomnia (requisições HTTP)  
- cURL no terminal  
- psql (consulta direta no banco)  

### Exemplos de consultas no banco

- Acessar o PostgreSQL dentro do container  
```sql
docker exec -it postgres_db_concessionaria psql -U seu_usuario_postgres -d concessionaria
```

- Listar tabelas

```sql
\dt
```

- Ver carros cadastrados 

```sql
SELECT * FROM carro_antigo;
```

- Ver todas as vendas  

```sql
SELECT * FROM venda;
```

- Sair
```
\q
```
---

## Conclusão

Este projeto exemplifica a construção de uma aplicação **full-stack moderna e profissional**, unindo um **frontend leve e interativo**, um **backend robusto e seguro** e um **banco de dados relacional confiável**, tudo executando em um ambiente **conteinerizado com Docker**, garantindo portabilidade, consistência e facilidade de manutenção.  

Além de reproduzir fielmente as operações de uma concessionária real, o sistema foi projetado com **arquitetura modular e escalável**, oferecendo uma base sólida para futuras evoluções, como:  
- Implementação de **autenticação e controle de acesso**;  
- Criação de **dashboards analíticos** para monitoramento de vendas e desempenho;  
- Geração de **relatórios gerenciais**;  
- Integração com **APIs externas** e serviços adicionais.  

Dessa forma, o projeto não apenas cumpre os objetivos funcionais iniciais, mas também estabelece um padrão de desenvolvimento profissional, pronto para expansão e adaptação a novos requisitos.

