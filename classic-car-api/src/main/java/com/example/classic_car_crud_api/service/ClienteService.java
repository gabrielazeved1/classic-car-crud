package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.Cliente;
import com.example.classic_car_crud_api.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// @service anota esta classe como um componente de servico, onde fica a logica de negocio.
@Service
public class ClienteService {

    // o servico depende do repositorio para interagir com o banco de dados.
    private final ClienteRepository repository;

    // injecao de dependencias via construtor. o spring fornece a instancia do clienterepository.
    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    // metodo para salvar (criar ou atualizar) um cliente.
    public Cliente salvar(Cliente cliente) {
        // delega a operacao de salvar para o repositorio.
        return repository.save(cliente);
    }

    // metodo para buscar todos os clientes.
    public List<Cliente> listarTodos() {
        // delega a busca de todos os registos para o repositorio.
        return repository.findAll();
    }

    // metodo para buscar um cliente especifico pelo id.
    public Optional<Cliente> buscarPorId(Long id) {
        // retorna um optional para tratar o caso em que o cliente pode nao ser encontrado.
        return repository.findById(id);
    }

    // metodo para apagar um cliente.
    public void deletar(Long id) {
        // regra de negocio: verificar se o cliente existe antes de tentar apagar.
        if (!repository.existsById(id)) {
            // se nao existir, lanca uma excecao que resultara num erro 404 (not found).
            throw new ResourceNotFoundException("Cliente não encontrado com o id: " + id);
        }
        // se existir, apaga o cliente.
        repository.deleteById(id);
    }
}
