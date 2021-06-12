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


    const filter:any = args.filter;
    const search:string = args.search;
    const sort: any = args.sort;
    let where: any = {};

    if(filter) {
        where['AND'] = [];
        if(filter.title) where['AND'].push({title: {contains: filter.title}});
    }

    if(search) {
        where['OR'] = [
            {title: {contains: search}},
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

    const vehicle = await prisma.vehicle.findUnique({
        where: {id},
        include: {
            films: { take: limit, skip: offset, where, orderBy}
    }});

    if(vehicle !== null) {
        return vehicle.films;
    }
    else {
        return [];
    }
}

export async function getPilotsForVehicle(parent, args, context, info) {
    const id = parent.id;


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

    const vehicle = await prisma.vehicle.findUnique({
        where: {id},
        include: {
            pilots: { take: limit, skip: offset, where, orderBy}
    }});

    if(vehicle !== null) {
        return vehicle.pilots;
    }
    else {
        return [];
    }
}


export async function createVehicle(parent, args, context, info) {
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('model' in args.inputs) data['model'] = args.inputs['model']
    if('vehicleClass' in args.inputs) data['vehicleClass'] = args.inputs['vehicleClass']
    if('manufacturer' in args.inputs) data['manufacturer'] = args.inputs['manufacturer']
    if('length' in args.inputs) data['length'] = args.inputs['length']
    if('cost' in args.inputs) data['cost'] = args.inputs['cost']
    if('crew' in args.inputs) data['crew'] = args.inputs['crew']
    if('passengers' in args.inputs) data['passengers'] = args.inputs['passengers']
    if('maxAtmospheringSpeed' in args.inputs) data['maxAtmospheringSpeed'] = args.inputs['maxAtmospheringSpeed']
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

    const vehicle = await prisma.vehicle.create({data});
    return vehicle;
}

export async function editVehicle(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('model' in args.inputs) data['model'] = args.inputs['model']
    if('vehicleClass' in args.inputs) data['vehicleClass'] = args.inputs['vehicleClass']
    if('manufacturer' in args.inputs) data['manufacturer'] = args.inputs['manufacturer']
    if('length' in args.inputs) data['length'] = args.inputs['length']
    if('cost' in args.inputs) data['cost'] = args.inputs['cost']
    if('crew' in args.inputs) data['crew'] = args.inputs['crew']
    if('passengers' in args.inputs) data['passengers'] = args.inputs['passengers']
    if('maxAtmospheringSpeed' in args.inputs) data['maxAtmospheringSpeed'] = args.inputs['maxAtmospheringSpeed']
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
    const vehicle = await prisma.vehicle.update({where: {id}, data});
    return vehicle;
}

export async function deleteVehicle(parent, args, context, info) {
    const id = args.id;
    await prisma.vehicle.delete({where: {id}});
    return true;
}
