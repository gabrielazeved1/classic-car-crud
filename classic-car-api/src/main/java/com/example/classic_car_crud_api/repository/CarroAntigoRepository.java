package com.example.classic_car_crud_api.repository;
// uma interface repository é responsavel por toda a comunicacao com o banco de dados.
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.classic_car_crud_api.model.CarroAntigo;

// o spring data jpa junto do findby "faz: conseultas sql

// ao estender jparepository, o spring data jpa cria automaticamente os metodos basicos de crud (salvar, buscar, apagar, mudar).
// <carroantigo, long> significa que este repositorio vai gerir a entidade carroantigo, e o tipo da chave primaria e long.
public interface CarroAntigoRepository extends JpaRepository<CarroAntigo, Long> {

    // este metodo vai procurar todos os carros que tenham a marca especificada.
    List<CarroAntigo> findByMarca(String marca);

    // este metodo vai procurar todos os carros fabricados no ano especificado.
    List<CarroAntigo> findByAno(int ano);
}
