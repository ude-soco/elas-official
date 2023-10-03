# syntax=docker/dockerfile:1.6
FROM node:18.12.1 as build
WORKDIR /app

COPY ./package*.json ./
RUN  npm ci 2>&1

COPY . ./
RUN  npm run lint || true
ENV  VITE_BACKEND_URL http://127.0.0.1:8000/api
RUN  npm run build 2>&1



FROM nginxinc/nginx-unprivileged:1.25
USER root
WORKDIR /usr/share/nginx/html
RUN chown -R nginx:nginx .

USER 101
COPY --link --from=build --chown=101 /app/dist/ ./
COPY --link ./nginx/conf.d/* /etc/nginx/conf.d/
COPY --link ./nginx/docker-entrypoint.d/* /docker-entrypoint.d/

ENV NGINX_ENTRYPOINT_QUIET_LOGS 1
EXPOSE 8080
