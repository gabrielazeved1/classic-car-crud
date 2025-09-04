package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.Venda;
import com.example.classic_car_crud_api.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @GetMapping
    public ResponseEntity<List<Venda>> findAll() {
        return ResponseEntity.ok(vendaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venda> findById(@PathVariable Long id) {
        Venda venda = vendaService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com o id: " + id));
        return ResponseEntity.ok(venda);
    }

    @PostMapping
    public ResponseEntity<Venda> create(@Valid @RequestBody Venda venda) {
        Venda savedVenda = vendaService.salvar(venda);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVenda);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venda> update(@PathVariable Long id, @Valid @RequestBody Venda venda) {
        Venda existingVenda = vendaService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com o id: " + id));

        venda.setId(id);
        Venda updatedVenda = vendaService.salvar(venda);
        return ResponseEntity.ok(updatedVenda);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
