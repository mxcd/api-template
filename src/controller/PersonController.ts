import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getPerson(parent, args, context, info) {
    const id = args.id;
    const person = await prisma.person.findUnique({where: {id}});
    if(!person) {
        throw new ApolloError(`No person with ID '${id}' found`, "NOT_FOUND")
    }
    return person;
}

export async function getPeople(parent, args, context, info) {
    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.name) where['AND'].push({name: {contains: filter.name}});
        if(filter.gender) where['AND'].push({gender: {equals: filter.gender}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
            {gender: {contains: search}},
        ]
    }

    const limit: number = parseInt(args.limit) || 100
    const offset: number = parseInt(args.offset) || 0

    let orderBy: any = [];
    if(sort) {
        for(const key in sort) {
            let sort = {}
            sort[key] = args.sort[key].toLowerCase();
            orderBy.push(sort);
        }
    }

    const results = await prisma.$transaction([
        prisma.person.count({where}),
        prisma.person.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const people = results[1];

    return {
        total,
        people
    };
}
