import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getSpecies(parent, args, context, info) {
    const id = args.id;
    const species = await prisma.species.findUnique({where: {id}});
    if(!species) {
        throw new ApolloError(`No species with ID '${id}' found`, "NOT_FOUND")
    }
    return species;
}

export async function getSpecieses(parent, args, context, info) {
    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.name) where['AND'].push({name: {contains: filter.name}});
        if(filter.classification) where['AND'].push({classification: {contains: filter.classification}});
        if(filter.designation) where['AND'].push({designation: {contains: filter.designation}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
            {classification: {contains: search}},
            {designation: {contains: search}},
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
        prisma.species.count({where}),
        prisma.species.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const specieses = results[1];

    return {
        total,
        specieses
    };
}


export async function getHomeworldForSpecies(parent, args, context, info) {
    const id = parent.id;
    const species = await prisma.species.findUnique({where: {id}, include: {homeworld: true}})
    if(species !== null) {
        return species.homeworld
    }
    else {
        return null;
    }
}

export async function getFilmsForSpecies(parent, args, context, info) {
    const id = parent.id;
    const species = await prisma.species.findUnique({where: {id}, include: {films: true}})
    if(species !== null) {
        return species.films
    }
    else {
        return [];
    }
}

export async function getPeopleForSpecies(parent, args, context, info) {
    const id = parent.id;
    const species = await prisma.species.findUnique({where: {id}, include: {people: true}})
    if(species !== null) {
        return species.people
    }
    else {
        return [];
    }
}

