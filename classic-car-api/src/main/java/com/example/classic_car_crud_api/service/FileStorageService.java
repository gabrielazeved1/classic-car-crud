package com.example.classic_car_crud_api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // Define o diretório raiz para salvar os arquivos
    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            // Cria o diretório 'uploads' se ele não existir
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar a pasta para upload!", e);
        }
    }

    public String save(MultipartFile file) {
        try {
            // Gera um nome de arquivo único para evitar que um arquivo sobrescreva outro
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Copia o arquivo recebido para o destino final (a pasta 'uploads')
            Files.copy(file.getInputStream(), this.root.resolve(uniqueFilename));
            
            return uniqueFilename; // Retorna o novo nome para ser salvo no banco
        } catch (Exception e) {
            throw new RuntimeException("Não foi possível armazenar o arquivo. Erro: " + e.getMessage());
        }
    }
}