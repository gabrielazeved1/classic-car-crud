package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.service.CarroAntigoService;
import com.example.classic_car_crud_api.service.FileStorageService; // 1. IMPORTAR O NOVO SERVIÇO
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 2. IMPORTAR MULTIPARTFILE

import java.util.List;

@RestController
@RequestMapping("/carros")
public class CarroAntigoController {

    private final CarroAntigoService carroService;
    private final FileStorageService fileStorageService; // 3. INJETAR O FILESTORAGESERVICE

    // 4. ATUALIZAR O CONSTRUTOR
    public CarroAntigoController(CarroAntigoService carroService, FileStorageService fileStorageService) {
        this.carroService = carroService;
        this.fileStorageService = fileStorageService;
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

    // 5. MÉTODO CREATE TOTALMENTE ATUALIZADO
    @PostMapping
    public ResponseEntity<CarroAntigo> create(@Valid @RequestPart("carro") CarroAntigo carro,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // Verifica se um arquivo foi enviado
        if (file != null && !file.isEmpty()) {
            String filename = fileStorageService.save(file); // Salva o arquivo no servidor
            carro.setImagemUrl(filename); // Associa o nome do arquivo ao objeto carro
        }
        CarroAntigo savedCarro = carroService.salvar(carro);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCarro);
    }

    // 6. MÉTODO UPDATE TOTALMENTE ATUALIZADO
    @PutMapping("/{id}")
    public ResponseEntity<CarroAntigo> update(@PathVariable Long id, @Valid @RequestPart("carro") CarroAntigo carro,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        CarroAntigo existingCarro = carroService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o id: " + id));

        // Verifica se um novo arquivo foi enviado
        if (file != null && !file.isEmpty()) {
            String filename = fileStorageService.save(file);
            carro.setImagemUrl(filename);
        } else {
            // Se nenhum arquivo novo foi enviado, mantém a imagem que já existia
            carro.setImagemUrl(existingCarro.getImagemUrl());
        }

        carro.setId(id); // Garante que o ID correto está sendo atualizado
        CarroAntigo updatedCarro = carroService.salvar(carro);
        return ResponseEntity.ok(updatedCarro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
