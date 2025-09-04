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
public class Vendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    @Column(length = 100)
    private String nome;

    @NotBlank(message = "A matrícula não pode estar em branco")
    @Size(max = 20, message = "A matrícula deve ter no máximo 20 caracteres")
    @Column(length = 20)
    private String matricula;

    @Size(max = 50, message = "O contato deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String contato;

    @JsonManagedReference("vendedor-vendas")
    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

}