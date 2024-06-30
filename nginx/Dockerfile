
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*

COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

# Launch NGINX
CMD ["nginx", "-g","daemon off;"]