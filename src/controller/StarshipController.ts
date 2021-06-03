import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getStarship(parent, args, context, info) {
    const id = args.id;
    const starship = await prisma.starship.findUnique({where: {id}});
    if(!starship) {
        throw new ApolloError(`No starship with ID '${id}' found`, "NOT_FOUND")
    }
    return starship;
}

export async function getStarships(parent, args, context, info) {
    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.name) where['AND'].push({name: {contains: filter.name}});
        if(filter.model) where['AND'].push({model: {contains: filter.model}});
        if(filter.starshipClass) where['AND'].push({starshipClass: {contains: filter.starshipClass}});
        if(filter.manufacturer) where['AND'].push({manufacturer: {contains: filter.manufacturer}});
        if(filter.cost) where['AND'].push({cost: {contains: filter.cost}});
        if(filter.length) where['AND'].push({length: {contains: filter.length}});
        if(filter.crew) where['AND'].push({crew: {equals: filter.crew}});
        if(filter.passengers) where['AND'].push({passengers: {equals: filter.passengers}});
        if(filter.maxAtmospheringSpeed) where['AND'].push({maxAtmospheringSpeed: {contains: filter.maxAtmospheringSpeed}});
        if(filter.hyperdriveRating) where['AND'].push({hyperdriveRating: {contains: filter.hyperdriveRating}});
        if(filter.mglt) where['AND'].push({mglt: {contains: filter.mglt}});
        if(filter.cargoCapacity) where['AND'].push({cargoCapacity: {contains: filter.cargoCapacity}});
        if(filter.consumables) where['AND'].push({consumables: {contains: filter.consumables}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
            {model: {contains: search}},
            {starshipClass: {contains: search}},
            {manufacturer: {contains: search}},
            {cost: {contains: search}},
            {length: {contains: search}},
            {crew: {contains: search}},
            {passengers: {contains: search}},
            {maxAtmospheringSpeed: {contains: search}},
            {hyperdriveRating: {contains: search}},
            {mglt: {contains: search}},
            {cargoCapacity: {contains: search}},
            {consumables: {contains: search}},
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
        prisma.starship.count({where}),
        prisma.starship.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const starships = results[1];

    return {
        total,
        starships
    };
}


export async function getFilmsForStarship(parent, args, context, info) {
    const id = parent.id;
    const starship = await prisma.starship.findUnique({where: {id}, include: {films: true}})
    if(starship !== null) {
        return starship.films;
    }
    else {
        return [];
    }
}

export async function getPilotsForStarship(parent, args, context, info) {
    const id = parent.id;
    const starship = await prisma.starship.findUnique({where: {id}, include: {pilots: true}})
    if(starship !== null) {
        return starship.pilots;
    }
    else {
        return [];
    }
}

