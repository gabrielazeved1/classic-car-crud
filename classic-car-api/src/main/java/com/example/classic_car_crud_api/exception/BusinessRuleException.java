package com.example.classic_car_crud_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
// quando de alguma treta eu chamo 
// @responsestatus e uma anotacao muito util do spring.
// ela mapeia esta excecao para um status http especifico.
// sempre que esta excecao for lancada, a resposta http tera o status 400 bad request.
@ResponseStatus(HttpStatus.BAD_REQUEST)
// esta e uma classe de excecao personalizada que criei.
// estender 'runtimeexception' faz dela uma "unchecked exception", o que simplifica o codigo
// pois nao precisamos de a declarar em todos os metodos com 'throws'.
public class BusinessRuleException extends RuntimeException {

    // este e o construtor da nossa excecao.
    // ele recebe uma mensagem de erro quando e criado.
    public BusinessRuleException(String message) {
        // 'super(message)' passa a mensagem de erro para a classe pai (runtimeexception),
        // que se encarrega de a processar e exibir.
        super(message);
    }
}
