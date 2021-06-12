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

    const person = await prisma.person.findUnique({
        where: {id},
        include: {
            films: { take: limit, skip: offset, where, orderBy}
    }});

    if(person !== null) {
        return person.films;
    }
    else {
        return [];
    }
}

export async function getSpeciesForPerson(parent, args, context, info) {
    const id = parent.id;


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

    const person = await prisma.person.findUnique({
        where: {id},
        include: {
            species: { take: limit, skip: offset, where, orderBy}
    }});

    if(person !== null) {
        return person.species;
    }
    else {
        return [];
    }
}

export async function getStarshipsForPerson(parent, args, context, info) {
    const id = parent.id;


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

    const person = await prisma.person.findUnique({
        where: {id},
        include: {
            starships: { take: limit, skip: offset, where, orderBy}
    }});

    if(person !== null) {
        return person.starships;
    }
    else {
        return [];
    }
}

export async function getVehiclesForPerson(parent, args, context, info) {
    const id = parent.id;


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

    const person = await prisma.person.findUnique({
        where: {id},
        include: {
            vehicles: { take: limit, skip: offset, where, orderBy}
    }});

    if(person !== null) {
        return person.vehicles;
    }
    else {
        return [];
    }
}


export async function createPerson(parent, args, context, info) {
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('height' in args.inputs) data['height'] = args.inputs['height']
    if('mass' in args.inputs) data['mass'] = args.inputs['mass']
    if('hairColor' in args.inputs) data['hairColor'] = args.inputs['hairColor']
    if('skinColor' in args.inputs) data['skinColor'] = args.inputs['skinColor']
    if('eyeColor' in args.inputs) data['eyeColor'] = args.inputs['eyeColor']
    if('birthYear' in args.inputs) data['birthYear'] = args.inputs['birthYear']
    if('gender' in args.inputs) data['gender'] = args.inputs['gender']
    if('homeworldId' in args.inputs) data['homeworldId'] = args.inputs['homeworldId']
    if('homeworld' in args.inputs) {
        data['homeworld'] = {};
        data['homeworld']['connect'] = { id: args.inputs['homeworld'] };
    }
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['connect'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('species' in args.inputs) {
        data['species'] = {};
        data['species']['connect'] = args.inputs['species'].map((e:number) => { return { id: e } });
    }
    if('starships' in args.inputs) {
        data['starships'] = {};
        data['starships']['connect'] = args.inputs['starships'].map((e:number) => { return { id: e } });
    }
    if('vehicles' in args.inputs) {
        data['vehicles'] = {};
        data['vehicles']['connect'] = args.inputs['vehicles'].map((e:number) => { return { id: e } });
    }

    const person = await prisma.person.create({data});
    return person;
}

export async function editPerson(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('height' in args.inputs) data['height'] = args.inputs['height']
    if('mass' in args.inputs) data['mass'] = args.inputs['mass']
    if('hairColor' in args.inputs) data['hairColor'] = args.inputs['hairColor']
    if('skinColor' in args.inputs) data['skinColor'] = args.inputs['skinColor']
    if('eyeColor' in args.inputs) data['eyeColor'] = args.inputs['eyeColor']
    if('birthYear' in args.inputs) data['birthYear'] = args.inputs['birthYear']
    if('gender' in args.inputs) data['gender'] = args.inputs['gender']
    if('homeworldId' in args.inputs) data['homeworldId'] = args.inputs['homeworldId']
    if('homeworld' in args.inputs) {
        data['homeworld'] = {};
        data['homeworld']['set'] = { id: args.inputs['homeworld'] };
    }
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['set'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('species' in args.inputs) {
        data['species'] = {};
        data['species']['set'] = args.inputs['species'].map((e:number) => { return { id: e } });
    }
    if('starships' in args.inputs) {
        data['starships'] = {};
        data['starships']['set'] = args.inputs['starships'].map((e:number) => { return { id: e } });
    }
    if('vehicles' in args.inputs) {
        data['vehicles'] = {};
        data['vehicles']['set'] = args.inputs['vehicles'].map((e:number) => { return { id: e } });
    }
    const person = await prisma.person.update({where: {id}, data});
    return person;
}

export async function deletePerson(parent, args, context, info) {
    const id = args.id;
    await prisma.person.delete({where: {id}});
    return true;
}
