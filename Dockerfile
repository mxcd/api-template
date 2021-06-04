FROM mxcd/node-build:latest as build

WORKDIR /usr/src/
RUN npm i -g prisma
COPY package.json /usr/src/package.json
COPY package-lock.json /usr/src/package-lock.json

RUN npm i

COPY ./prisma /usr/src/prisma
COPY ./src /usr/src/src
COPY ./tsconfig.json /usr/src/tsconfig.json
COPY ./gqlCodegen.yml /usr/src/gqlCodegen.yml

RUN npm run codegen
RUN npm run build

RUN rm -f .npmrc

FROM mxcd/node-prod:latest
WORKDIR /usr/src/
COPY --from=build /usr/src/dist /usr/src
CMD ["node", "index.js"]
