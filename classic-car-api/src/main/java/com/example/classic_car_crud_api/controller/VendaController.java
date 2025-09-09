package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.Venda;
import com.example.classic_car_crud_api.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// @restcontroller marca a classe como um controller que lida com requisicoes http.
@RestController
// @requestmapping define a url base para todos os endpoints deste controller.
@RequestMapping("/vendas")
public class VendaController {

    // o controller depende do service para executar as operacoes.
    private final VendaService vendaService;

    // injecao de dependencias do service.
    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    // @getmapping mapeia requisicoes http get para "/vendas".
    @GetMapping
    public ResponseEntity<List<Venda>> findAll() {
        return ResponseEntity.ok(vendaService.listarTodos());
    }

    // mapeia requisicoes get para "/vendas/{id}".
    @GetMapping("/{id}")
    public ResponseEntity<Venda> findById(@PathVariable Long id) {
        // @pathvariable pega o valor do {id} da url.
        Venda venda = vendaService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com o id: " + id));
        return ResponseEntity.ok(venda);
    }

    // @postmapping mapeia requisicoes post para "/vendas" (criar uma nova venda).
    @PostMapping
    public ResponseEntity<Venda> create(@Valid @RequestBody Venda venda) {
        // @requestbody converte o json da requisicao para um objeto venda.
        // @valid ativa as validacoes do model.
        Venda savedVenda = vendaService.salvar(venda);
        // retorna a venda guardada com um status 201 created.
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVenda);
    }

    // @putmapping mapeia requisicoes put para "/vendas/{id}" (atualizar uma venda).
    @PutMapping("/{id}")
    public ResponseEntity<Venda> update(@PathVariable Long id, @Valid @RequestBody Venda venda) {
        // verifica se a venda a ser atualizada existe.
        vendaService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com o id: " + id));

        venda.setId(id); // garante que o id do objeto e o mesmo da url.
        Venda updatedVenda = vendaService.salvar(venda);
        return ResponseEntity.ok(updatedVenda);
    }

    // @deletemapping mapeia requisicoes delete para "/vendas/{id}".
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendaService.deletar(id);
        // retorna um status 204 no content, indicando sucesso.
        return ResponseEntity.noContent().build();
    }

    // este e um endpoint personalizado para buscar vendas por cliente.
    // acessivel em "/vendas/cliente/{clienteid}".
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Venda>> findByCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(vendaService.buscarPorCliente(clienteId));
    }

    // este e um endpoint personalizado para buscar vendas por vendedor.
    // acessivel em "/vendas/vendedor/{vendedorid}".
    @GetMapping("/vendedor/{vendedorId}")
    public ResponseEntity<List<Venda>> findByVendedor(@PathVariable Long vendedorId) {
        return ResponseEntity.ok(vendaService.buscarPorVendedor(vendedorId));
    }
}

