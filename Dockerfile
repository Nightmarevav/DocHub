# syntax = docker/dockerfile:1.3
FROM node:12-alpine AS deps
WORKDIR /var/www
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm install


FROM node:12-alpine AS builder
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
EXPOSE 8079