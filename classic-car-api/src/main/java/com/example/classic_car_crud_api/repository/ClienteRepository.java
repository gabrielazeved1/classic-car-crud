package com.example.classic_car_crud_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.Cliente;

// esta interface e a ponte entre a nossa aplicacao e a tabela 'cliente' no banco de dados.
// ao estender jparepository<cliente, long>, o spring data jpa automaticamente nos da
// todos os metodos basicos de crud (create, read, update, delete) para a entidade cliente,
// cuja chave primaria (id) e do tipo long.
// como nao precisamos de nenhuma busca especial para clientes 
// a interface fica vazia, pois ja herda tudo o que e necessario.
public interface ClienteRepository extends JpaRepository<Cliente, Long> { }

// isso é quase que desnecessario