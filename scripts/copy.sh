#!/bin/bash
cd /vagrant
DOCKER_BUILDKIT=1 docker build -f ./Dockerfile.build -t dist .
docker run --name dist dist:latest

if [ -d "dist" ]; then
  rm -r dist 
fi


docker cp dist:/var/www/dist dist
docker rm dist
