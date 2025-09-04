package com.example.classic_car_crud_api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByClienteId(Long clienteId);
    List<Venda> findByVendedorId(Long vendedorId);
}