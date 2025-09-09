package com.example.classic_car_crud_api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

// @service indica que esta e uma classe de servico gerida pelo spring.
// a sua responsabilidade e exclusivamente lidar com o armazenamento. -> isso é basicamente para guardar as fotos
@Service
public class FileStorageService {

    // 'path' e uma classe para representar caminhos de ficheiros .
    // 'paths.get("uploads")' cria um caminho para uma pasta chamada "uploads" na raiz do projeto.
    private final Path root = Paths.get("uploads");

    // o construtor do servico. é executado assim que a aplicacao inicia.
    public FileStorageService() {
        try {
            // logica de inicializacao: verifica se a pasta "uploads" ja existe.
            if (!Files.exists(root)) {
                // se nao existir, cria a pasta. isto garante que o diretorio esteja sempre pronto para receber ficheiros.
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            // se houver um erro ao criar a pasta (ex: falta de permissao), lanca uma excecao dizendo que deu ruim.
            throw new RuntimeException("Não foi possível inicializar a pasta para upload!", e);
        }
    }

    // metodo principal que recebe um ficheiro (multipartfile) e o guarda.
    public String save(MultipartFile file) {
        try {
            // 1. obtem o nome original do ficheiro para extrair a sua extensao (ex: ".png").
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // 2. gera um nome de ficheiro unico e aleatorio usando uuid (universally unique identifier).
            // isto e crucial para evitar que duas imagens com o mesmo nome se sobrescrevam.
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // 3. copia o conteudo do ficheiro recebido (file.getinputstream()) para o destino final.
            // 'this.root.resolve(uniquefilename)' combina o caminho da pasta "uploads" com o novo nome unico.
            Files.copy(file.getInputStream(), this.root.resolve(uniqueFilename));
            
            // 4. retorna o novo nome unico. este nome sera guardado na coluna 'imagem_url' do banco de dados.
            return uniqueFilename;
        } catch (Exception e) {
            throw new RuntimeException("Não foi possível armazenar o arquivo. Erro: " + e.getMessage());
        }
    }
}
