package com.example.classic_car_crud_api.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class CarroAntigo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A marca não pode estar em branco")
    @Size(max = 50, message = "A marca deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String marca;

    @NotBlank(message = "O modelo não pode estar em branco")
    @Size(max = 50, message = "O modelo deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String modelo;

    @NotNull(message = "O ano é obrigatório")
    @Positive(message = "O ano deve ser um número positivo")
    private Integer ano;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser um valor positivo")
    private Double preco;

    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
    @Column(length = 1000) // Também aumentar o tamanho da coluna na base de dados
    private String descricao;

    @Column(length = 10, columnDefinition = "VARCHAR(10) DEFAULT 'A_VENDA'")
    private String status = "A_VENDA";

    // ===== CAMPO ADICIONADO =====
    // Armazenará o nome único do arquivo de imagem (ex: 'uuid-aleatorio.jpg')
    @Column(name = "imagem_url")
    private String imagemUrl;

    @JsonManagedReference("carro-vendas")
    @OneToMany(mappedBy = "carro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

}
