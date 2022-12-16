# syntax = docker/dockerfile:1.3
ARG NODE_VERSION=12.22.12



FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /var/www
COPY package.json package-lock.json ./
# RUN --mount=type=cache,target=/root/.npm npm install
RUN npm install



FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /var/www
COPY --from=deps /var/www .
COPY . .
ENV NODE_ENV=production
# RUN --mount=type=cache,target=./node_modules/.cache npm run build
RUN npm run build
#CMD ["npm", "run", "serve"]
#CMD ["sh"]
#EXPOSE 8080



FROM ghcr.io/rabotaru/dochub/nginx:v0.0.3 as nginx
COPY --chown=101 --from=builder /vagrant/pics /usr/share/nginx/html/pics
COPY --chown=101 --from=builder /var/www/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8079