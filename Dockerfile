ARG DOCKER_REPO

FROM ${DOCKER_REPO}/infrastructure/node-prod:latest

WORKDIR /usr/src/

COPY ./dist /usr/src/

CMD ["node", "index.js"]