package com.example.classic_car_crud_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

// @data (lombok) gera os metodos getters e setters.
@Data
// @entity marca esta classe como uma tabela no banco de dados.
@Entity
public class Venda {

    // @id e @generatedvalue definem a chave primaria com auto-incremento.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @notnull garante que o carro nao seja nulo ao criar uma venda.
    @NotNull(message = "O carro é obrigatório")
    // @manytoone define um relacionamento muitos-para-um: muitas vendas podem estar associadas a um carro.
    @ManyToOne
    // @joincolumn especifica a coluna da chave estrangeira na tabela 'venda'.
    // o hibernate vai criar uma coluna chamada 'carro_id'.
    @JoinColumn(name = "carro_id")
    // @jsonbackreference e o lado "filho" da relacao. evita loops quando o objeto e convertido para json.
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
