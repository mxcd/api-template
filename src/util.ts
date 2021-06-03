import * as winston from "winston";
import {PrismaClient} from "@prisma/client";

require('dotenv').config()

export const prisma = new PrismaClient();

export const env = process.env;

export const log = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    log.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export const contextBuilder = async ({ req }) => {
    // build your context based on your request here
}
