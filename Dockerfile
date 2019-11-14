FROM node:12-alpine
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
ENTRYPOINT [ "npm", "run", "docker-build" ]
EXPOSE 8000
