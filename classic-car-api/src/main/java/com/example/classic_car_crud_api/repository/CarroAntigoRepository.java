package com.example.classic_car_crud_api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.CarroAntigo;

public interface CarroAntigoRepository extends JpaRepository<CarroAntigo, Long> {
    List<CarroAntigo> findByMarca(String marca);
    List<CarroAntigo> findByAno(int ano);
}