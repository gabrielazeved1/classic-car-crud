# classic-car-frontend
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copia todos os arquivos do frontend (html, css, js)
COPY . .

# Copia também a pasta de imagens para dentro do container
COPY ./images ./images

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
