package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.Vendedor;
import com.example.classic_car_crud_api.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// @service anota a classe como um componente de servico, onde a logica de negocio e implementada.
@Service
public class VendedorService {

    // o servico depende do repositorio para comunicar com a base de dados.
    private final VendedorRepository repository;

    // o spring faz a injecao de dependencias do repositorio atraves do construtor.
    public VendedorService(VendedorRepository repository) {
        this.repository = repository;
    }

    // metodo para salvar (criar ou atualizar) um vendedor.
    public Vendedor salvar(Vendedor vendedor) {
        return repository.save(vendedor);
    }

    // metodo para listar todos os vendedores.
    public List<Vendedor> listarTodos() {
        return repository.findAll();
    }

    // metodo para buscar um vendedor pelo seu id.
    // o retorno e um 'optional' para lidar com casos onde o vendedor pode nao existir.
    public Optional<Vendedor> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // metodo para apagar um vendedor.
    public void deletar(Long id) {
        // regra de negocio: antes de apagar, e importante verificar se o vendedor existe.
        if (!repository.existsById(id)) {
            // se nao existir, toma um erro de presente
            throw new ResourceNotFoundException("Vendedor não encontrado com o id: " + id);
        }
        // se o vendedor existir, ele e apagado.
        repository.deleteById(id);
    }
}

