import * as winston from "winston";
import { AuthenticationError } from "apollo-server-errors/dist";
const axios = require("axios")
const qs = require('querystring')
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
    if(env.USE_AUTH === "true") {
        const authHeader: string = req.headers["authorization"];
        if (!authHeader) {
            log.debug(`No authorization header provided`)
            throw new AuthenticationError('No authorization header provided');
        }

        const authToken: string = authHeader.split("Bearer ")[1];
        if (!authToken) {
            log.debug(`No access token in authorization header`)
            throw new AuthenticationError(`No access token in authorization header`);
        }

        const userData = await token_introspection(authToken);
        if (!userData) {
            log.debug(`Provided access token is invalid`)
            throw new AuthenticationError(`Provided access token is invalid`);
        }

        // @ts-ignore
        const usernameField: string = env.TOKEN_USERNAME_FIELD;
        const username: string = userData[usernameField];
        return {username: username, userData: userData};
    }

    // else and in case of error catch above
    return {username: `unauthenticated`, userData: {}};

}

const token_introspection = async (token) => {
    try {
        const requestBody = {
            client_secret: env.CLIENT_SECRET,
            client_id: env.CLIENT_ID,
            token: token
        }

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const res = await axios.post(env.INTROSPECTION_ENDPOINT, qs.stringify(requestBody), config)
        const data = res.data;
        if(!data.active) {
            return null;
        }
        log.debug(`Received authenticated request by ${data.preferred_username}`)
        return data;
    }
    catch (err) {
        log.error(err)
    }
}

export function listEmpty(obj): boolean {
    return !(typeof(obj) === 'object' && obj.length !== 0);
}

export function removeNull(obj: object): object {
    let foo = {};
    for(let key in obj) {
        if(obj[key] !== null) {
            foo[key] = obj[key];
        }
    }
    return foo
}

export function removeId(obj: object): object {
    if("id" in obj) {
        delete obj["id"];
    }
    return obj;
}