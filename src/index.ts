import express from 'express';
const { ApolloServer } =  require('apollo-server-express');
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';
import compression from 'compression';

import schema from './schema/schemas';

import {prisma, log, env, contextBuilder} from "./util";

async function main() {
    log.info(`Generating express server`)
    const app = express();
    app.use(compression());
    log.info(`Creating server`)
    const httpServer = createServer(app);

    log.info(`Generating Apollo server`)
    const server = new ApolloServer({
        schema,
        context: contextBuilder,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: env.API_PORT }, resolve));
    console.log(`GraphQL is now running on port ${env.API_PORT}`);
}

main()
.catch(e => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect()
})
