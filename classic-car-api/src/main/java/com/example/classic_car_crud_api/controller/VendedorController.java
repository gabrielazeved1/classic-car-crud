package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.model.Vendedor;
import com.example.classic_car_crud_api.service.VendedorService;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// @restcontroller define que esta classe e um controller rest, responsavel por receber requisicoes http.
@RestController
// @requestmapping define a url base para todos os metodos nesta classe.
// todas as requisicoes para "/vendedores" serao tratadas aqui.
@RequestMapping("/vendedores")
public class VendedorController {

    // o controller depende do service para executar a logica de negocio.
    private final VendedorService vendedorService;

    // o spring faz a injecao de dependencias do service atraves do construtor.
    public VendedorController(VendedorService vendedorService) {
        this.vendedorService = vendedorService;
    }

    // @getmapping mapeia requisicoes http get para "/vendedores".
    @GetMapping
    public ResponseEntity<List<Vendedor>> findAll() {
        // retorna a lista de todos os vendedores com um status http 200 ok.
        return ResponseEntity.ok(vendedorService.listarTodos());
    }

    // mapeia requisicoes get para "/vendedores/{id}".
    @GetMapping("/{id}")
    public ResponseEntity<Vendedor> findById(@PathVariable Long id) {
        // @pathvariable extrai o 'id' da url.
        Vendedor vendedor = vendedorService.buscarPorId(id)
                // se o vendedor nao for encontrado, lanca uma excecao que o spring converte para um erro 404.
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com o id: " + id));
        return ResponseEntity.ok(vendedor);
    }

    // @postmapping mapeia requisicoes post para "/vendedores" (criar um novo vendedor).
    @PostMapping
    public ResponseEntity<Vendedor> create(@Valid @RequestBody Vendedor vendedor) {
        // @requestbody converte o corpo json da requisicao para um objeto vendedor.
        // @valid ativa as validacoes do model (ex: @notblank).
        Vendedor savedVendedor = vendedorService.salvar(vendedor);
        // retorna o vendedor guardado com um status 201 created.
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVendedor);
    }

    // @putmapping mapeia requisicoes put para "/vendedores/{id}" (atualizar um vendedor).
    @PutMapping("/{id}")
    public ResponseEntity<Vendedor> update(@PathVariable Long id, @Valid @RequestBody Vendedor vendedor) {
        // verifica se o vendedor a ser atualizado existe.
        vendedorService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com o id: " + id));

        vendedor.setId(id); // garante que o id do objeto e o mesmo da url.
        Vendedor updatedVendedor = vendedorService.salvar(vendedor);
        return ResponseEntity.ok(updatedVendedor);
    }

    // @deletemapping mapeia requisicoes delete para "/vendedores/{id}".
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendedorService.deletar(id);
        // para um delete bem-sucedido, retorna um status 204 no content .
        return ResponseEntity.noContent().build();
    }
}
