package com.example.classic_car_crud_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    @Column(length = 100)
    private String nome;

    @NotBlank(message = "O CPF não pode estar em branco")
    @Size(max = 14, message = "O CPF deve ter no máximo 14 caracteres")
    @Column(length = 14)
    private String cpf;

    @Size(max = 50, message = "O contato deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String contato;

    @Size(max = 200, message = "O endereço deve ter no máximo 200 caracteres")
    @Column(length = 200)
    private String endereco;

    @JsonManagedReference("cliente-vendas")
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

}