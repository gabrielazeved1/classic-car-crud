# Estágio 1: Use a imagem base do Nginx, que é leve e otimizada
FROM nginx:alpine

# Define o diretório de trabalho padrão para onde os ficheiros do site serão servidos
WORKDIR /usr/share/nginx/html

# Copia TODO o conteúdo do contexto de build (a pasta 'classic-car-frontend')
# para o diretório de trabalho do contentor.
# A linha que copiava a pasta 'images' foi removida, pois ela não pertence ao frontend.
COPY . .

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o servidor Nginx em modo "foreground" (necessário para o Docker)
CMD ["nginx", "-g", "daemon off;"]

