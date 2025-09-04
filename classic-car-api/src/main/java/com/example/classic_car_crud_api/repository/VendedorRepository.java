package com.example.classic_car_crud_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.Vendedor;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> { }