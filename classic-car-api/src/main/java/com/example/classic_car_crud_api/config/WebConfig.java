package com.example.classic_car_crud_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// trabalha junto de filestoreservice.java
// @configuration indica que esta e uma classe de configuracao do spring.
// diz onde deve ser procurado a foto
@Configuration
// ao implementar webmvcconfigurer, podemos personalizar o comportamento do spring mvc.
public class WebConfig implements WebMvcConfigurer {

    // este metodo e usado para configurar "resource handlers", que sao responsaveis
    // por servir ficheiros estaticos.
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // esta linha cria uma regra de mapeamento.
        // registry.addresourcehandler("/images/**") define o padrao da url publica.
        // qualquer requisicao que comece com "/images/" sera tratada por esta regra.
        registry.addResourceHandler("/images/**")
                // .addresourcelocations(...) mapeia a url publica para uma pasta fisica no servidor.
                // "file:uploads/" indica que os ficheiros devem ser procurados na pasta "uploads"
                // que esta na raiz do projeto.
                // exemplo: uma requisicao para http://localhost:8080/images/foto.png
                // fara o servidor procurar o ficheiro 'foto.png' dentro da pasta 'uploads/'.
                .addResourceLocations("file:uploads/");
    }
}
