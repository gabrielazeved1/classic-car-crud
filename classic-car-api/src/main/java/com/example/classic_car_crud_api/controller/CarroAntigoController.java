package com.example.classic_car_crud_api.controller;

import com.example.classic_car_crud_api.exception.ResourceNotFoundException;
import com.example.classic_car_crud_api.model.CarroAntigo;
import com.example.classic_car_crud_api.service.CarroAntigoService;
import com.example.classic_car_crud_api.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// @restcontroller combina @controller e @responsebody. define que esta classe e um controller rest  
// -> ou seja define que isso é um API REST
// e os retornos dos metodos serao convertidos para json.
@RestController
// @requestmapping define a url base para todos os metodos nesta classe.
// todas as requisicoes para "/carros" serao tratadas aqui.
@RequestMapping("/carros")
public class CarroAntigoController {

    private final CarroAntigoService carroService;
    private final FileStorageService fileStorageService;

    // o controller depende do service para executar a logica de negocio.
    // o spring faz a injecao de dependencias de ambos os servicos aqui.
    public CarroAntigoController(CarroAntigoService carroService, FileStorageService fileStorageService) {
        this.carroService = carroService;
        this.fileStorageService = fileStorageService;
    }

    // @getmapping mapeia requisicoes http get para este metodo.
    // neste caso, um get para "/carros" vai chamar o 'findall'.
    @GetMapping
    public ResponseEntity<List<CarroAntigo>> findAll() {
        // responseentity permite controlar toda a resposta http (status, corpo, cabecalhos).
        // aqui, retornamos um status 200 ok com a lista de carros no corpo.
        return ResponseEntity.ok(carroService.listarTodos());
    }

    // o "{id}" na url e uma variavel de caminho.
    // um get para "/carros/1" chamara este metodo, e o 'id' sera 1.
    @GetMapping("/{id}")
    public ResponseEntity<CarroAntigo> findById(@PathVariable Long id) {
        // @pathvariable extrai o valor da url (o 'id') e passa-o como parametro para o metodo.
        CarroAntigo carro = carroService.buscarPorId(id)
                // se o carro nao for encontrado, lanca a excecao, que resulta num erro 404.
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o id: " + id));
        return ResponseEntity.ok(carro);
    }

    // @postmapping mapeia requisicoes http post para este metodo (criar um novo recurso).
    @PostMapping
    // responseentity permite controlar toda a resposta http (status, corpo, cabecalhos).
    // nesse caso criar
    public ResponseEntity<CarroAntigo> create(@Valid @RequestPart("carro") CarroAntigo carro,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // @requestpart é usado para receber partes de uma requisicao multipart/form-data.
        
        // NAO SEI PQ TA DANDO BOA AO ENVIAR VIA INSONIA, MAS VIA CURL CONSIGO.
        // VERIFICAR COM O PROFESSOR SE O O INSONIA ESTA VENDO COMO TEXT


        // uma parte e o json do 'carro', e a outra e o 'file' (a imagem).
        // @valid ativa as regras de validacao que definimos no model.
        if (file != null && !file.isEmpty()) {
            // se um ficheiro foi enviado, ele e guardado no servidor.
            String filename = fileStorageService.save(file);
            // o nome do ficheiro e associado ao objeto carro.
            carro.setImagemUrl(filename);
        }
        CarroAntigo savedCarro = carroService.salvar(carro);
        // retorna um status 201 created, que e o correto para a criacao de um novo recurso.
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCarro);
    }

    // @putmapping mapeia requisicoes http put para este metodo.
    @PutMapping("/{id}")
    public ResponseEntity<CarroAntigo> update(@PathVariable Long id, @Valid @RequestPart("carro") CarroAntigo carro,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // primeiro, busca o carro existente para garantir que ele esta na base de dados.
        CarroAntigo existingCarro = carroService.buscarPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o id: " + id));

        if (file != null && !file.isEmpty()) {
            String filename = fileStorageService.save(file);
            carro.setImagemUrl(filename);
        } else {
            // se nenhum ficheiro novo for enviado, mantem a imagem que ja existia.
            carro.setImagemUrl(existingCarro.getImagemUrl());
        }

        carro.setId(id); // garante que estamos a atualizar o registo correto.
        CarroAntigo updatedCarro = carroService.salvar(carro);
        return ResponseEntity.ok(updatedCarro);
    }

    // @deletemapping mapeia requisicoes http delete para este metodo.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carroService.deletar(id);
        // para um delete bem-sucedido, e uma boa pratica retornar um status 204 no content (sem corpo).
        return ResponseEntity.noContent().build();
    }
}

