# Concessionária de Carros Clássicos

Aplicação full-stack de gestão de uma concessionária, com CRUD de carros, clientes, vendedores e vendas.

---

## Arquitetura

Três serviços definidos no `docker-compose.yml`:

- **Backend** — Java 17 + Spring Boot 3.x, API REST, porta `8080`
- **Frontend** — HTML/CSS/JS servido por Nginx, porta `5173`
- **Banco de dados** — PostgreSQL, porta `5432`

```
Utilizador → Nginx (Frontend) → Spring Boot (API) → PostgreSQL
```

---

## Tecnologias

| Camada         | Stack                                          |
| -------------- | ---------------------------------------------- |
| Backend        | Java 17, Spring Boot 3, Spring Data JPA, Maven |
| Frontend       | HTML5, CSS3, JavaScript ES6+, IMask.js, Nginx  |
| Infraestrutura | Docker, Docker Compose, PostgreSQL             |

---

## Como executar

**Pré-requisitos:** Docker e Docker Compose instalados.

1. Copie o ficheiro de variáveis de ambiente:

```bash
cp .env.sample .env
```

2. Preencha os valores no `.env`:

```bash
DB_NAME=concessionaria
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=db
DB_PORT=5432
```

3. Suba os containers:

```bash
docker compose up --build -d
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:8080](http://localhost:8080)

---

## Funcionalidades

- CRUD de carros, clientes, vendedores e vendas
- Upload de imagens de veículos
- Prevenção de venda duplicada (carro já vendido não pode ser revendido)
- Validações de CPF, telefone, matrícula e valores monetários

---

## Verificação manual

As funcionalidades foram verificadas manualmente via Insomnia, cURL e consultas directas no PostgreSQL.

```bash
# Aceder ao PostgreSQL dentro do container
docker exec -it postgres_db_concessionaria psql -U seu_usuario -d concessionaria
```

```sql
SELECT * FROM carro_antigo;
SELECT * FROM venda;
```

---

## Próximos passos

- [ ] Testes automatizados (JUnit + Mockito)
- [ ] Autenticação e controlo de acesso (Spring Security + JWT)
- [ ] Paginação e filtros na listagem de carros
- [ ] CI/CD básico (GitHub Actions)
