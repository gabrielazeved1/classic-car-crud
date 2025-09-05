package com.example.classic_car_crud_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Data
@Entity
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O carro é obrigatório")
    @ManyToOne
    @JoinColumn(name = "carro_id")
    @JsonBackReference("carro-vendas")
    private CarroAntigo carro;

    @NotNull(message = "O cliente é obrigatório")
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonBackReference("cliente-vendas")
    private Cliente cliente;

    @NotNull(message = "O vendedor é obrigatório")
    @ManyToOne
    @JoinColumn(name = "vendedor_id")
    @JsonBackReference("vendedor-vendas")
    private Vendedor vendedor;

    @NotNull(message = "A data é obrigatória")
    private LocalDate data;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser positivo")
    private Double valor;
}