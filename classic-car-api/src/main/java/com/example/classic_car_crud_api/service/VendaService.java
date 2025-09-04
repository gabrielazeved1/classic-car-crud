package com.example.classic_car_crud_api.service;

import com.example.classic_car_crud_api.exception.BusinessRuleException;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.model.Cliente;
import com.example.classic_car_crud_api.model.Venda;
import com.example.classic_car_crud_api.model.Vendedor;
import com.example.classic_car_crud_api.repository.CarroAntigoRepository;
import com.example.classic_car_crud_api.repository.ClienteRepository;
import com.example.classic_car_crud_api.repository.VendaRepository;
import com.example.classic_car_crud_api.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

    private final VendaRepository repository;
    private final CarroAntigoRepository carroRepository;
    private final ClienteRepository clienteRepository;
    private final VendedorRepository vendedorRepository;

    public VendaService(VendaRepository repository, CarroAntigoRepository carroRepository,
                        ClienteRepository clienteRepository, VendedorRepository vendedorRepository) {
        this.repository = repository;
        this.carroRepository = carroRepository;
        this.clienteRepository = clienteRepository;
        this.vendedorRepository = vendedorRepository;
    }

    public Venda salvar(Venda venda) {
        CarroAntigo carro = carroRepository.findById(venda.getCarro().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado."));
        Cliente cliente = clienteRepository.findById(venda.getCliente().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));
        Vendedor vendedor = vendedorRepository.findById(venda.getVendedor().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado."));

        if ("VENDIDO".equalsIgnoreCase(carro.getStatus())) {
            throw new BusinessRuleException("O carro já foi vendido e não pode ser negociado novamente.");
        }

        carro.setStatus("VENDIDO");
        carroRepository.save(carro);

        venda.setCarro(carro);
        venda.setCliente(cliente);
        venda.setVendedor(vendedor);

        return repository.save(venda);
    }

    public List<Venda> listarTodos() {
        return repository.findAll();
    }

    public Optional<Venda> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Venda não encontrada com o id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Venda> buscarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    public List<Venda> buscarPorVendedor(Long vendedorId) {
        return repository.findByVendedorId(vendedorId);
    }
}
