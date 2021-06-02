#!/bin/bash

echo "Installing node modules"
npm install

echo "Creating .env file"
cp .env_template .env

echo "Starting postgres DB in docker"
docker run --rm -d -p 5432:5432 -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=test postgres:13
echo "Generating prisma client"
prisma generate
echo "Executing DB migration"
prisma migrate dev --name init

echo "Loading test data"
ts-node ./src/load-swapi.ts


echo "dev setup done"
echo "feel free to run 'prisma studio' to explore the data"
