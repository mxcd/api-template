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


export async function getHomeworldForPerson(parent, args, context, info) {
    const id = parent.id;
    const person = await prisma.person.findUnique({where: {id}, include: {homeworld: true}})
    if(person !== null) {
        return person.homeworld;
    }
    else {
        return null;
    }
}

export async function getFilmsForPerson(parent, args, context, info) {
    const id = parent.id;
    const person = await prisma.person.findUnique({where: {id}, include: {films: true}})
    if(person !== null) {
        return person.films;
    }
    else {
        return [];
    }
}

export async function getSpeciesForPerson(parent, args, context, info) {
    const id = parent.id;
    const person = await prisma.person.findUnique({where: {id}, include: {species: true}})
    if(person !== null) {
        return person.species;
    }
    else {
        return [];
    }
}

export async function getStarshipsForPerson(parent, args, context, info) {
    const id = parent.id;
    const person = await prisma.person.findUnique({where: {id}, include: {starships: true}})
    if(person !== null) {
        return person.starships;
    }
    else {
        return [];
    }
}

export async function getVehiclesForPerson(parent, args, context, info) {
    const id = parent.id;
    const person = await prisma.person.findUnique({where: {id}, include: {vehicles: true}})
    if(person !== null) {
        return person.vehicles;
    }
    else {
        return [];
    }
}

