package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.repository.CarroAntigoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


// @service indica que esta classe contem a logica de negocio da aplicacao.
@Service
public class CarroAntigoService {

    // o servico depende do repositorio para aceder ao banco de dados.
    // 'final' garante que ele seja inicializado no construtor.
    private final CarroAntigoRepository repository;

    // isso é um construtor da classe!!! ou seja, ele automaticamente fornece uma instancia do carroantigorepository.
    public CarroAntigoService(CarroAntigoRepository repository) {
        this.repository = repository;
    }

    // metodo para salvar um carro (tanto para criar um novo como para atualizar um existente).
    // ele simplesmente chama o metodo 'save' do repositorio.
    public CarroAntigo salvar(CarroAntigo carro) {
        return repository.save(carro);
    }

    // metodo para listar todos os carros cadastrados.
    // ele chama o metodo 'findall' do repositorio, que retorna uma lista de todos os registos.
    public List<CarroAntigo> listarTodos() {
        return repository.findAll();
    }

    // metodo para buscar um unico carro pelo seu id.
    // retorna um 'optional', que é uma forma segura de lidar com a possibilidade do carro nao existir {trata erros}
    public Optional<CarroAntigo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // metodo para apagar um carro pelo seu id.
    public void deletar(Long id) {
        // nao faz sentido apagar um carro que nao exista
        // esta é uma regra de negocio:verificar antes de existir
        if (!repository.existsById(id)) {
            // se nao existir, toma um errao .
            throw new ResourceNotFoundException("Carro não encontrado com o id: " + id);
        }
        // se o carro existir, chamamos o metodo 'deletebyid' do repositorio para o apagar.
        repository.deleteById(id);
    }
}
