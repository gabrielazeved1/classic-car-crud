package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.model.Cliente;
import com.example.classic_car_crud_api.service.ClienteService;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// @restcontroller marca a classe como um controller rest, que lida com requisicoes http -> defie APIREST
@RestController
// @requestmapping define a url base para todos os endpoints deste controller.
@RequestMapping("/clientes")
public class ClienteController {

    // o controller depende do service para executar as operacoes.
    private final ClienteService clienteService;

    // injecao de dependencias do service via construtor.
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // @getmapping mapeia requisicoes http get para "/clientes".
    @GetMapping
    public ResponseEntity<List<Cliente>> findAll() {
        // retorna uma lista de todos os clientes com um status 200 ok.
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    // mapeia requisicoes get para "/clientes/{id}", onde {id} e uma variavel.
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> findById(@PathVariable Long id) {
        // @pathvariable pega o valor do {id} da url e o passa para o metodo.
        Cliente cliente = clienteService.buscarPorId(id)
                // se o cliente nao for encontrado, lanca uma excecao (erro 404).
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o id: " + id));
        return ResponseEntity.ok(cliente);
    }

    // @postmapping mapeia requisicoes post para "/clientes" (criar um novo cliente).
    @PostMapping
    public ResponseEntity<Cliente> create(@Valid @RequestBody Cliente cliente) {
        // @requestbody converte o json enviado no corpo da requisicao para um objeto cliente.
        // @valid ativa as validacoes definidas no model.
        Cliente savedCliente = clienteService.salvar(cliente);
        // retorna o cliente guardado com um status 201 created.
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCliente);
    }

    // @putmapping mapeia requisicoes put para "/clientes/{id}" (atualizar um cliente).
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        // primeiro, verifica se o cliente que se quer atualizar realmente existe.
        clienteService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o id: " + id));

        cliente.setId(id); // garante que estamos a atualizar o id correto.
        Cliente updatedCliente = clienteService.salvar(cliente);
        return ResponseEntity.ok(updatedCliente);
    }

    // @deletemapping mapeia requisicoes delete para "/clientes/{id}".
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.deletar(id);
        // retorna um status 204 no content, indicando sucesso sem corpo de resposta.
        return ResponseEntity.noContent().build();
    }
}
