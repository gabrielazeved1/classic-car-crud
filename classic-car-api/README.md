# Classic Car CRUD API

API REST desenvolvida em **Java Spring Boot** para gerenciar um sistema de concessionária de carros clássicos.  
O projeto implementa **CRUD completo** para Clientes, Vendedores, Carros e Vendas, persistindo os dados em **PostgreSQL**.

---

## Tecnologias Utilizadas

- **Java 17+**
- **Spring Boot 3.x**
  - Spring Web
  - Spring Data JPA
  - Validation
- **PostgreSQL**
- **Maven**
- **Lombok** (facilita getters/setters e construtores)
- **Hibernate** (implementação JPA)
- **Docker**

---

## Estrutura do Projeto
``` properties
classic-car-crud-api
├── src/main/java/com/example/classic_car_crud_api
│ ├── controller # Endpoints REST
│ ├── exception # Exceções personalizadas
│ ├── model # Entidades (Cliente, Vendedor, CarroAntigo, Venda)
│ ├── repository # Interfaces JPA
│ └── service # Lógica de negócio
└── src/main/resources
  └── application.properties # Configurações do PostgreSQL
└── Dockerfile
└── docker-compose.yml
└── .env # Variáveis sensíveis (usuário e senha do banco)
```
---

## Configuração do Banco de Dados

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.application.name=concessionaria

# PostgreSQL
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```
### No arquivo .env (não versionado, adicionado ao .gitignore) coloque suas credenciais sensíveis:

```bash
DB_NAME=concessionaria
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```
---

## Docker e Docker Compose

Para garantir consistência, isolamento e facilidade de deploy, o projeto usa **Docker**:

- **Dockerfile:** cria uma imagem da aplicação Spring Boot. Primeiro constrói com Maven e Java 21, depois gera uma imagem leve contendo apenas o `.jar`.

- **docker-compose.yml:** orquestra múltiplos containers, incluindo a API e o banco PostgreSQL. Configura volumes persistentes e mapeia portas, garantindo que a API só inicie quando o banco estiver pronto.

### Rodando com Docker

```bash
docker compose up --build -d
```
- Toda vez que fizer alterações no código, use --build para reconstruir a imagem.

- Para desligar e limpar volumes:

```bash
docker compose down -v
```

- "Ligar" docker:

```bash
docker-compose up -d
```

- "Desligar" docker:

```bash
docker compose down
``` 

--- 

## Importância do Docker nesse Projeto

- **Garante consistência:** funciona igual em qualquer máquina.  
- **Facilita o deploy:** imagens prontas para produção.  
- **Mantém isolamento:** API e banco em containers separados.  
- **Permite recuperação rápida:** volumes persistem dados mesmo que containers sejam recriados.  
- **Facilita arquitetura de software moderna:** separação de responsabilidades entre serviços e infraestrutura versionada.

*A API estará disponível em: http://localhost:8080*

## Endpoints Principais

### Clientes
- POST `/clientes` → Cadastrar cliente
- GET `/clientes` → Listar clientes
- GET `/clientes/{id}` → Buscar cliente por ID
- DELETE `/clientes/{id}` → Remover cliente

### Vendedores
- POST `/vendedores` → Cadastrar vendedor
- GET `/vendedores` → Listar vendedores

### Carros
- POST `/carros` → Cadastrar carro
- GET `/carros` → Listar carros
- PUT `/carros/{id}` → Atualizar carro

### Vendas
- POST `/vendas` → Registrar venda
- GET `/vendas` → Listar vendas
- GET `/vendas/{id}` → Buscar venda por ID
- DELETE `/vendas/{id}` → Remover venda

---

## Principais Dificuldades e Correções

Durante o desenvolvimento deste projeto, encontrei algumas dificuldades e erros comuns, que exigiram atenção especial e ajustes na implementação. Abaixo estão os principais pontos:

### 1. Compatibilidade de Dependências
**Problema:** Ao iniciar o projeto com Spring Boot 3.x, algumas dependências, como JPA e PostgreSQL, geravam conflitos de versão no `pom.xml`.  
**Solução:** Ajustei as versões das dependências no `pom.xml` para garantir compatibilidade com o Spring Boot 3.x e o Java 17, evitando conflitos de compilação e runtime.

### 2. Regra de Negócio da Venda
**Problema:** Inicialmente, era possível registrar vendas múltiplas para o mesmo carro, quebrando a lógica de negócio.  
**Solução:** No `VendaService`, implementei uma validação que verifica se o carro já foi vendido antes de salvar a venda. Caso o carro já tenha status `"VENDIDO"`, uma exceção `BusinessRuleException` é lançada. Caso contrário, o status do carro é atualizado para `"VENDIDO"` e a venda é registrada.

### 3. Relacionamentos entre Entidades
**Problema:** Erros de serialização JSON devido a relacionamentos bidirecionais entre `Venda`, `CarroAntigo`, `Cliente` e `Vendedor`.  
**Solução:** Usei as anotações `@JsonManagedReference` e `@JsonBackReference` nas entidades para evitar loops infinitos na serialização JSON e permitir o correto retorno de dados via API.

### 4. Validação de Dados
**Problema:** Algumas requisições poderiam ser feitas com campos nulos ou inválidos, quebrando a aplicação.  
**Solução:** Adicionei validações nas entidades usando `@NotBlank`, `@NotNull`, `@Size` e `@Positive` para garantir que os dados obrigatórios fossem preenchidos corretamente antes de persistir no banco.

### 5. Testes de Endpoints
**Problema:** Inicialmente, nem todos os endpoints estavam respondendo como esperado, principalmente ao criar vendas ou deletar registros.  
**Solução:** Testei todas as rotas usando o Insomnia e ajustei o código para tratar exceções como `ResourceNotFoundException` e `BusinessRuleException`. Isso garantiu que a API retornasse mensagens claras de erro quando necessário.

---

## Testes no Banco via Terminal PostgreSQL
## Usando o Terminal (psql)

Se você já tem o PostgreSQL instalado ou está rodando via Docker, pode usar o `psql` para acessar o banco:
## Acessando via container Docker

```bash
docker exec -it postgres_db_concessionaria psql -U $DB_USERNAME -d $DB_NAME
````

### Comandos SQL básicos
-- Listar todos os clientes

```bash
SELECT * FROM cliente;
```
-- Listar todos os vendedores

```bash
SELECT * FROM vendedor;
```

-- Listar todos os carros antigos

```bash
SELECT * FROM carro_antigo;
```

-- Listar todas as vendas

```bash
SELECT * FROM venda;
```

*Esses comandos permitem conferir se os dados estão sendo inseridos corretamente pela API.*.
---

## Conclusão
Apesar das dificuldades iniciais com versões, validação e relacionamentos complexos, a implementação final do projeto garante:

- Integridade das regras de negócio (ex: não vender carro já vendido).
- Estrutura de projeto clara e organizada em camadas.
- Retorno consistente de dados pela API.
- Validações automáticas de dados, reduzindo erros durante a operação.

Esses ajustes são fundamentais para que o sistema funcione de forma confiável e mantenha a lógica de negócio correta.

### Autor

Gabriel Azevedo  
Engenharia de Computação - UFU
