package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.repository.CarroAntigoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CarroAntigoService {

    private final CarroAntigoRepository repository;

    public CarroAntigoService(CarroAntigoRepository repository) {
        this.repository = repository;
    }

    public CarroAntigo salvar(CarroAntigo carro) {
        return repository.save(carro);
    }

    public List<CarroAntigo> listarTodos() {
        return repository.findAll();
    }

    public Optional<CarroAntigo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Carro não encontrado com o id: " + id);
        }
        repository.deleteById(id);
    }
}