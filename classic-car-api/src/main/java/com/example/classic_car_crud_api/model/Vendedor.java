package com.example.classic_car_crud_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

// @data e uma anotacao do lombok para gerar metodos como getters e setters. -> relaicona com model
@Data
// @entity indica que esta classe representa uma tabela na base de dados. -> relaciona com repository
@Entity
public class Vendedor {

    // @id e @generatedvalue definem este campo como a chave primaria auto-incrementada.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @notblank e @size sao validacoes para o campo nome.
    @NotBlank(message = "O nome não pode estar em branco")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    // @column mapeia este atributo para uma coluna com um limite de 100 caracteres.
    @Column(length = 100)
    private String nome;

    @NotBlank(message = "A matrícula não pode estar em branco")
    @Size(max = 20, message = "A matrícula deve ter no máximo 20 caracteres")
    @Column(length = 20)
    private String matricula;

    @Size(max = 50, message = "O contato deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String contato;

    // @jsonmanagedreference e usado para gerir a serializacao json e evitar loops.
    // este é o lado "pai" da relacao com venda.
    @JsonManagedReference("vendedor-vendas")
    // @onetomany define que um vendedor pode estar associado a muitas vendas.
    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

}
