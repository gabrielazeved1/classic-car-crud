package com.example.classic_car_crud_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
// quando eu esqueco de mandar algum arquivo, vai me chamar.

// @responsestatus mapeia esta excecao para um status http.
// neste caso, sempre que esta excecao for lancada, a resposta http tera o status 404 not found,
// que e o codigo correto para "recurso nao encontrado".
@ResponseStatus(HttpStatus.NOT_FOUND)
// esta e a nossa excecao personalizada para quando um recurso nao e encontrado.
// estender 'runtimeexception' torna-a uma "unchecked exception".
public class ResourceNotFoundException extends RuntimeException {

    // o construtor recebe a mensagem de erro a ser exibida.
    public ResourceNotFoundException(String message) {
        // 'super(message)' passa a mensagem para a classe pai (runtimeexception).
        super(message);
    }
}
