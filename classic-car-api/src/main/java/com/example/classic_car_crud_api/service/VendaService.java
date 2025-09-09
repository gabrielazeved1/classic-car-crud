package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.BusinessRuleException;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.model.Venda;
import com.example.classic_car_crud_api.repository.CarroAntigoRepository;
import com.example.classic_car_crud_api.repository.VendaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// @service anota a classe como um componente de servico, onde a logica de negocio e implementada.
@Service
public class VendaService {

    // o servico de venda precisa de dois repositorios:
    // um para guardar a propria venda (vendarepository).
    private final VendaRepository repository;
    // e outro para atualizar o status do carro que foi vendido (carroantigorepository).
    private final CarroAntigoRepository carroRepository;

    // o spring faz a injecao de dependencias de ambos os repositorios atraves do construtor.
    public VendaService(VendaRepository repository, CarroAntigoRepository carroRepository) {
        this.repository = repository;
        this.carroRepository = carroRepository;
    }

    // este e o metodo com a logica de negocio mais importante do sistema.
    public Venda salvar(Venda venda) {
        // 1. antes de salvar a venda, primeiro buscamos o carro associado a ela no banco de dados.
        CarroAntigo carro = carroRepository.findById(venda.getCarro().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado."));

        // 2. regra de negocio: verificamos se o status do carro ja e "vendido".
        if ("VENDIDO".equalsIgnoreCase(carro.getStatus())) {
            // se ja for vendido, lancamos uma excecao de regra de negocio, impedindo uma nova venda.
            throw new BusinessRuleException("O carro já foi vendido e não pode ser negociado novamente.");
        }

        // 3. se o carro estiver disponivel, atualizamos o seu status para "vendido".
        carro.setStatus("VENDIDO");
        // e guardamos a alteracao do carro de volta no banco de dados.
        carroRepository.save(carro);

        // 4. finalmente, com o carro ja atualizado, guardamos o registo da venda.
        return repository.save(venda);
    }

    // metodo para listar todas as vendas.
    public List<Venda> listarTodos() {
        return repository.findAll();
    }

    // metodo para buscar uma venda especifica pelo seu id.
    public Optional<Venda> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // metodo para apagar uma venda.
    public void deletar(Long id) {
        // antes de apagar, verifica se a venda existe.
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Venda não encontrada com o id: " + id);
        }
        repository.deleteById(id);
    }

    // metodo para buscar todas as vendas de um cliente especifico.
    public List<Venda> buscarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    // metodo para buscar todas as vendas de um vendedor especifico.
    public List<Venda> buscarPorVendedor(Long vendedorId) {
        return repository.findByVendedorId(vendedorId);
    }
}

