import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getPlanet(parent, args, context, info) {
    const id = args.id;
    const planet = await prisma.planet.findUnique({where: {id}});
    if(!planet) {
        throw new ApolloError(`No planet with ID '${id}' found`, "NOT_FOUND")
    }
    return planet;
}

export async function getPlanets(parent, args, context, info) {
    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.name) where['AND'].push({name: {contains: filter.name}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
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
        prisma.planet.count({where}),
        prisma.planet.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const planets = results[1];

    return {
        total,
        planets
    };
}
