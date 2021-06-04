import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getVehicle(parent, args, context, info) {
    const id = args.id;
    const vehicle = await prisma.vehicle.findUnique({where: {id}});
    if(!vehicle) {
        throw new ApolloError(`No vehicle with ID '${id}' found`, "NOT_FOUND")
    }
    return vehicle;
}

export async function getVehicles(parent, args, context, info) {
    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.name) where['AND'].push({name: {contains: filter.name}});
        if(filter.model) where['AND'].push({model: {contains: filter.model}});
        if(filter.vehicleClass) where['AND'].push({vehicleClass: {contains: filter.vehicleClass}});
        if(filter.manufacturer) where['AND'].push({manufacturer: {contains: filter.manufacturer}});
        if(filter.crew) where['AND'].push({crew: {equals: filter.crew}});
        if(filter.passengers) where['AND'].push({passengers: {equals: filter.passengers}});
    }

    if(search) {
        where['OR'] = [
            {name: {contains: search}},
            {model: {contains: search}},
            {vehicleClass: {contains: search}},
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
        prisma.vehicle.count({where}),
        prisma.vehicle.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const vehicles = results[1];

    return {
        total,
        vehicles
    };
}


export async function getFilmsForVehicle(parent, args, context, info) {
    const id = parent.id;
    const vehicle = await prisma.vehicle.findUnique({where: {id}, include: {films: true}})
    if(vehicle !== null) {
        return vehicle.films;
    }
    else {
        return [];
    }
}

export async function getPilotsForVehicle(parent, args, context, info) {
    const id = parent.id;
    const vehicle = await prisma.vehicle.findUnique({where: {id}, include: {pilots: true}})
    if(vehicle !== null) {
        return vehicle.pilots;
    }
    else {
        return [];
    }
}

