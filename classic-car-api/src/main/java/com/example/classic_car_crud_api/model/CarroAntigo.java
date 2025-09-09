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

// @data e uma anotacao do lombok que cria automaticamente os getters e setters
@Data
// @entity indica que esta classe e uma tabela no banco de dados -> é o que relaciona java com bd -> ORM
@Entity
public class CarroAntigo {

    // @id define que este campo e a chave primaria da tabela
    @Id
    // @generatedvalue diz ao banco de dados para a chave 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @notblank e uma regra de validacao, ou seja ->  o campo nao pode ser nulo nem vazio.
    @NotBlank(message = "A marca não pode estar em branco")
    // @size define o tamanho minimo e/ou maximo do campo.
    @Size(max = 50, message = "A marca deve ter no máximo 50 caracteres")
    // @column mapeia este atributo para uma coluna na tabela, com um tamanho maximo de 50 caracteres.
    @Column(length = 50)
    private String marca;

    @NotBlank(message = "O modelo não pode estar em branco")
    @Size(max = 50, message = "O modelo deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String modelo;

    // @notnull valida que o valor nao pode ser nulo.
    @NotNull(message = "O ano é obrigatório")
    // @positive valida que o numero deve ser positivo.
    @Positive(message = "O ano deve ser um número positivo")
    private Integer ano;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser um valor positivo")
    private Double preco;
    // tive que trocar, pois a descricao as vezes é > q 50 caracteres
    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
    @Column(length = 1000)
    private String descricao;

    // @column define propriedades da coluna no banco. aqui, definimos um valor padrao 'a_venda'.
    @Column(length = 10, columnDefinition = "VARCHAR(10) DEFAULT 'A_VENDA'")
    private String status = "A_VENDA";

    // esta coluna vai guardar o nome do ficheiro da imagem do carro.
    @Column(name = "imagem_url")
    private String imagemUrl;

    // @jsonmanagedreference é usado para evitar um loop infinito quando convertemos o objeto para json.
    // ele indica que este lado da relacao (o carro) é o "pai" -> aqui que manda
    @JsonManagedReference("carro-vendas")
    // @onetomany define um relacionamento de um-para-muitos: um carro pode ter muitas vendas.
    // mappedby="carro" indica que o lado "venda" é o dono da relacao.
    // cascade= tratar erros -> cascadeType.all faz com que, se um carro for apagado, todas as vendas associadas tambem sejam.
    @OneToMany(mappedBy = "carro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

}

