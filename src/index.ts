import express from 'express';
const { ApolloServer } =  require('apollo-server-express');
import { createServer } from 'http';
import compression from 'compression';

import schema from './schema/schemas';

import {prisma, log, env, contextBuilder} from "./util";

async function main() {
    log.info(`Generating express server`)
    const app = express();

    log.info(`Generating Apollo server`)
    const index = new ApolloServer({
        schema: schema,
        context: contextBuilder
    });

    log.info(`Applying middlewares`)
    app.use(compression());
    index.applyMiddleware({ app, path: '/graphql' });

    log.info(`Creating server`)
    const httpServer = createServer(app);

    log.info(`Starting server`)
    httpServer.listen({ port: env.API_PORT }, (): void => console.log(`GraphQL is now running on port ${env.API_PORT}`));
}

main()
.catch(e => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect()
})
