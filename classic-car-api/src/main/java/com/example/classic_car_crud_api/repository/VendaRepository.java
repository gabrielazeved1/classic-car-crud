package com.example.classic_car_crud_api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.Venda;

// esta interface e a camada de acesso aos dados para a entidade venda.
// ao estender jparepository, o spring nos da todos os metodos de crud basicos.
public interface VendaRepository extends JpaRepository<Venda, Long> {

    // o spring data jpa cria consultas sql automaticamente com base no nome do metodo.
    // este metodo vai procurar na tabela 'venda' todas as entradas
    // onde a coluna da chave estrangeira 'cliente_id' corresponda ao id fornecido.
    List<Venda> findByClienteId(Long clienteId);

    // da mesma forma, este metodo vai procurar todas as vendas
    // realizadas pelo vendedor com o id fornecido.
    List<Venda> findByVendedorId(Long vendedorId);
}
