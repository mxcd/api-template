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


export async function getFilmsForPlanet(parent, args, context, info) {
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

    const planet = await prisma.planet.findUnique({
        where: {id},
        include: {
            films: { take: limit, skip: offset, where, orderBy}
    }});

    if(planet !== null) {
        return planet.films;
    }
    else {
        return [];
    }
}

export async function getSpeciesForPlanet(parent, args, context, info) {
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

    const planet = await prisma.planet.findUnique({
        where: {id},
        include: {
            species: { take: limit, skip: offset, where, orderBy}
    }});

    if(planet !== null) {
        return planet.species;
    }
    else {
        return [];
    }
}

export async function getResidentsForPlanet(parent, args, context, info) {
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

    const planet = await prisma.planet.findUnique({
        where: {id},
        include: {
            residents: { take: limit, skip: offset, where, orderBy}
    }});

    if(planet !== null) {
        return planet.residents;
    }
    else {
        return [];
    }
}


export async function createPlanet(parent, args, context, info) {
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('diameter' in args.inputs) data['diameter'] = args.inputs['diameter']
    if('rotationPeriod' in args.inputs) data['rotationPeriod'] = args.inputs['rotationPeriod']
    if('orbitalPeriod' in args.inputs) data['orbitalPeriod'] = args.inputs['orbitalPeriod']
    if('gravity' in args.inputs) data['gravity'] = args.inputs['gravity']
    if('population' in args.inputs) data['population'] = args.inputs['population']
    if('climate' in args.inputs) data['climate'] = args.inputs['climate']
    if('terrain' in args.inputs) data['terrain'] = args.inputs['terrain']
    if('surfaceWater' in args.inputs) data['surfaceWater'] = args.inputs['surfaceWater']
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['connect'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('species' in args.inputs) {
        data['species'] = {};
        data['species']['connect'] = args.inputs['species'].map((e:number) => { return { id: e } });
    }
    if('residents' in args.inputs) {
        data['residents'] = {};
        data['residents']['connect'] = args.inputs['residents'].map((e:number) => { return { id: e } });
    }

    const planet = await prisma.planet.create({data});
    return planet;
}

export async function editPlanet(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('diameter' in args.inputs) data['diameter'] = args.inputs['diameter']
    if('rotationPeriod' in args.inputs) data['rotationPeriod'] = args.inputs['rotationPeriod']
    if('orbitalPeriod' in args.inputs) data['orbitalPeriod'] = args.inputs['orbitalPeriod']
    if('gravity' in args.inputs) data['gravity'] = args.inputs['gravity']
    if('population' in args.inputs) data['population'] = args.inputs['population']
    if('climate' in args.inputs) data['climate'] = args.inputs['climate']
    if('terrain' in args.inputs) data['terrain'] = args.inputs['terrain']
    if('surfaceWater' in args.inputs) data['surfaceWater'] = args.inputs['surfaceWater']
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['set'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('species' in args.inputs) {
        data['species'] = {};
        data['species']['set'] = args.inputs['species'].map((e:number) => { return { id: e } });
    }
    if('residents' in args.inputs) {
        data['residents'] = {};
        data['residents']['set'] = args.inputs['residents'].map((e:number) => { return { id: e } });
    }
    const planet = await prisma.planet.update({where: {id}, data});
    return planet;
}

export async function deletePlanet(parent, args, context, info) {
    const id = args.id;
    await prisma.planet.delete({where: {id}});
    return true;
}
