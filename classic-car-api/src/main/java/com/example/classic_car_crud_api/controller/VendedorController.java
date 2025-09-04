package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.model.Vendedor;
import com.example.classic_car_crud_api.service.VendedorService;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vendedores")
public class VendedorController {

    private final VendedorService vendedorService;

    public VendedorController(VendedorService vendedorService) {
        this.vendedorService = vendedorService;
    }

    @GetMapping
    public ResponseEntity<List<Vendedor>> findAll() {
        return ResponseEntity.ok(vendedorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendedor> findById(@PathVariable Long id) {
        Vendedor vendedor = vendedorService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com o id: " + id));
        return ResponseEntity.ok(vendedor);
    }

    @PostMapping
    public ResponseEntity<Vendedor> create(@Valid @RequestBody Vendedor vendedor) {
        Vendedor savedVendedor = vendedorService.salvar(vendedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVendedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendedor> update(@PathVariable Long id, @Valid @RequestBody Vendedor vendedor) {
        Vendedor existingVendedor = vendedorService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado com o id: " + id));

        vendedor.setId(id);
        Vendedor updatedVendedor = vendedorService.salvar(vendedor);
        return ResponseEntity.ok(updatedVendedor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendedorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}