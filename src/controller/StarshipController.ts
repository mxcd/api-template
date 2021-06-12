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
        if(filter.crew) where['AND'].push({crew: {equals: filter.crew}});
        if(filter.passengers) where['AND'].push({passengers: {equals: filter.passengers}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
            {model: {contains: search}},
            {starshipClass: {contains: search}},
            {manufacturer: {contains: search}},
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


export async function createStarship(parent, args, context, info) {
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('model' in args.inputs) data['model'] = args.inputs['model']
    if('starshipClass' in args.inputs) data['starshipClass'] = args.inputs['starshipClass']
    if('manufacturer' in args.inputs) data['manufacturer'] = args.inputs['manufacturer']
    if('cost' in args.inputs) data['cost'] = args.inputs['cost']
    if('length' in args.inputs) data['length'] = args.inputs['length']
    if('crew' in args.inputs) data['crew'] = args.inputs['crew']
    if('passengers' in args.inputs) data['passengers'] = args.inputs['passengers']
    if('maxAtmospheringSpeed' in args.inputs) data['maxAtmospheringSpeed'] = args.inputs['maxAtmospheringSpeed']
    if('hyperdriveRating' in args.inputs) data['hyperdriveRating'] = args.inputs['hyperdriveRating']
    if('mglt' in args.inputs) data['mglt'] = args.inputs['mglt']
    if('cargoCapacity' in args.inputs) data['cargoCapacity'] = args.inputs['cargoCapacity']
    if('consumables' in args.inputs) data['consumables'] = args.inputs['consumables']
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['connect'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('pilots' in args.inputs) {
        data['pilots'] = {};
        data['pilots']['connect'] = args.inputs['pilots'].map((e:number) => { return { id: e } });
    }

    const starship = await prisma.starship.create({data});
    return starship;
}

export async function editStarship(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('model' in args.inputs) data['model'] = args.inputs['model']
    if('starshipClass' in args.inputs) data['starshipClass'] = args.inputs['starshipClass']
    if('manufacturer' in args.inputs) data['manufacturer'] = args.inputs['manufacturer']
    if('cost' in args.inputs) data['cost'] = args.inputs['cost']
    if('length' in args.inputs) data['length'] = args.inputs['length']
    if('crew' in args.inputs) data['crew'] = args.inputs['crew']
    if('passengers' in args.inputs) data['passengers'] = args.inputs['passengers']
    if('maxAtmospheringSpeed' in args.inputs) data['maxAtmospheringSpeed'] = args.inputs['maxAtmospheringSpeed']
    if('hyperdriveRating' in args.inputs) data['hyperdriveRating'] = args.inputs['hyperdriveRating']
    if('mglt' in args.inputs) data['mglt'] = args.inputs['mglt']
    if('cargoCapacity' in args.inputs) data['cargoCapacity'] = args.inputs['cargoCapacity']
    if('consumables' in args.inputs) data['consumables'] = args.inputs['consumables']
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['set'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('pilots' in args.inputs) {
        data['pilots'] = {};
        data['pilots']['set'] = args.inputs['pilots'].map((e:number) => { return { id: e } });
    }
    const starship = await prisma.starship.update({where: {id}, data});
    return starship;
}

export async function deleteStarship(parent, args, context, info) {
    const id = args.id;
    await prisma.starship.delete({where: {id}});
    return true;
}
