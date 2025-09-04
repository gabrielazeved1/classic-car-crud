package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.Vendedor;
import com.example.classic_car_crud_api.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VendedorService {

    private final VendedorRepository repository;

    public VendedorService(VendedorRepository repository) {
        this.repository = repository;
    }

    public Vendedor salvar(Vendedor vendedor) {
        return repository.save(vendedor);
    }

    public List<Vendedor> listarTodos() {
        return repository.findAll();
    }

    public Optional<Vendedor> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Vendedor não encontrado com o id: " + id);
        }
        repository.deleteById(id);
    }
}