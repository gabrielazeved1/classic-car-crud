package com.example.classic_car_crud_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia requisições para a URL /images/** para a pasta física 'uploads/'
        // Ex: http://localhost:8080/images/arquivo.jpg buscará o arquivo 'arquivo.jpg' na pasta 'uploads'
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
    }
}