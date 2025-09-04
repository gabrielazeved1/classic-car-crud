package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.service.CarroAntigoService;
import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carros")
public class CarroAntigoController {

    private final CarroAntigoService carroService;

    public CarroAntigoController(CarroAntigoService carroService) {
        this.carroService = carroService;
    }

    @GetMapping
    public ResponseEntity<List<CarroAntigo>> findAll() {
        return ResponseEntity.ok(carroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarroAntigo> findById(@PathVariable Long id) {
        CarroAntigo carro = carroService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o id: " + id));
        return ResponseEntity.ok(carro);
    }

    @PostMapping
    public ResponseEntity<CarroAntigo> create(@Valid @RequestBody CarroAntigo carro) {
        CarroAntigo savedCarro = carroService.salvar(carro);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCarro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarroAntigo> update(@PathVariable Long id, @Valid @RequestBody CarroAntigo carro) {
        CarroAntigo existingCarro = carroService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o id: " + id));

        carro.setId(id);
        CarroAntigo updatedCarro = carroService.salvar(carro);
        return ResponseEntity.ok(updatedCarro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}