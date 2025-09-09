package com.example.classic_car_crud_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.Vendedor;

// esta interface e a camada de acesso aos dados para a entidade vendedor.
// ao estender jparepository<vendedor, long>, o spring automaticamente nos fornece
// os metodos de crud (create, read, update, delete) para a entidade vendedor,
// que tem uma chave primaria (id) do tipo long.
// nao precisamos de escrever nenhuma implementacao, o spring faz tudo por nos.
public interface VendedorRepository extends JpaRepository<Vendedor, Long> { }

// quase inutil 