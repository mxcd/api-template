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

export type Group = {
    key: String,
    name: String
}

export type User =  {
    id: Number | String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    groups: Group[]
}

export type ContextType = {
    auth: Boolean,
    user: User | null
}

export const contextBuilder = async ({ req }): Promise<ContextType> => {
    // build your context based on your request here
    // when authentication is needed, call your user api here and check if the request is authenticated
    // then build your user object and place it in the context variable
    // don't forget to set `auth` to `true` if the request is authenticated
    let context: ContextType = {auth: false, user: null}
    return context;
}

export function authedUserInGroups(context, groups) {
    if(typeof(context.user) === 'undefined' || context.user === null ||
        typeof(context.user.groups) === 'undefined' || context.user.groups === null || context.auth === false) {
        return false;
    }

    for(let groupKey of groups) {
        for(let userGroup of context.user.groups) {
            if(groupKey === userGroup.key) {
                return true;
            }
        }
    }

    // Always return true for sudo
    for(let userGroup of context.user.groups) {
        if("sudo" === userGroup.key) {
            return true;
        }
    }

    return false;
}

export function authedUserHasId(context, id) {
    if(typeof(context.user) === 'undefined' || context.user === null || context.auth === false) {
        return false;
    }
    return context.user.id === id;
}