package com.example.classic_car_crud_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// isso é pra conentar as portas
// @configuration indica que esta classe contem configuracoes para a aplicacao spring.
@Configuration
public class CorsConfig {

    // @bean define que este metodo cria um "bean" (um objeto gerido pelo spring)
    // que sera usado para configurar o comportamento do mvc.
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // esta e a configuracao do cors (cross-origin resource sharing).
                // por seguranca, os navegadores bloqueiam requisicoes http de um dominio para outro.
                // esta configuracao e uma permissao explicita.

                // registry.addmapping("/**") aplica a regra a todos os endpoints da nossa api.
                registry.addMapping("/**")
                        // .allowedorigins(...) permite que o nosso frontend, que corre em "http://localhost:5173",
                        // faca requisicoes para o nosso backend, que corre em "http://localhost:8080".
                        .allowedOrigins("http://localhost:5173")
                        // .allowedmethods(...) especifica quais metodos http (get, post, etc.) sao permitidos.
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
