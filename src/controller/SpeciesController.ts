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
        return species.homeworld;
    }
    else {
        return null;
    }
}

export async function getFilmsForSpecies(parent, args, context, info) {
    const id = parent.id;
    const species = await prisma.species.findUnique({where: {id}, include: {films: true}})
    if(species !== null) {
        return species.films;
    }
    else {
        return [];
    }
}

export async function getPeopleForSpecies(parent, args, context, info) {
    const id = parent.id;
    const species = await prisma.species.findUnique({where: {id}, include: {people: true}})
    if(species !== null) {
        return species.people;
    }
    else {
        return [];
    }
}


export async function createSpecies(parent, args, context, info) {
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('classification' in args.inputs) data['classification'] = args.inputs['classification']
    if('designation' in args.inputs) data['designation'] = args.inputs['designation']
    if('averageHeight' in args.inputs) data['averageHeight'] = args.inputs['averageHeight']
    if('averageLifespan' in args.inputs) data['averageLifespan'] = args.inputs['averageLifespan']
    if('hairColors' in args.inputs) data['hairColors'] = args.inputs['hairColors']
    if('skinColors' in args.inputs) data['skinColors'] = args.inputs['skinColors']
    if('eyeColors' in args.inputs) data['eyeColors'] = args.inputs['eyeColors']
    if('language' in args.inputs) data['language'] = args.inputs['language']
    if('homeworldId' in args.inputs) data['homeworldId'] = args.inputs['homeworldId']
    if('homeworld' in args.inputs) {
        data['homeworld'] = {};
        data['homeworld']['connect'] = { id: args.inputs['homeworld'] };
    }
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['connect'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('people' in args.inputs) {
        data['people'] = {};
        data['people']['connect'] = args.inputs['people'].map((e:number) => { return { id: e } });
    }

    const species = await prisma.species.create({data});
    return species;
}

export async function editSpecies(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('name' in args.inputs) data['name'] = args.inputs['name']
    if('classification' in args.inputs) data['classification'] = args.inputs['classification']
    if('designation' in args.inputs) data['designation'] = args.inputs['designation']
    if('averageHeight' in args.inputs) data['averageHeight'] = args.inputs['averageHeight']
    if('averageLifespan' in args.inputs) data['averageLifespan'] = args.inputs['averageLifespan']
    if('hairColors' in args.inputs) data['hairColors'] = args.inputs['hairColors']
    if('skinColors' in args.inputs) data['skinColors'] = args.inputs['skinColors']
    if('eyeColors' in args.inputs) data['eyeColors'] = args.inputs['eyeColors']
    if('language' in args.inputs) data['language'] = args.inputs['language']
    if('homeworldId' in args.inputs) data['homeworldId'] = args.inputs['homeworldId']
    if('homeworld' in args.inputs) {
        data['homeworld'] = {};
        data['homeworld']['set'] = { id: args.inputs['homeworld'] };
    }
    if('films' in args.inputs) {
        data['films'] = {};
        data['films']['set'] = args.inputs['films'].map((e:number) => { return { id: e } });
    }
    if('people' in args.inputs) {
        data['people'] = {};
        data['people']['set'] = args.inputs['people'].map((e:number) => { return { id: e } });
    }
    const species = await prisma.species.update({where: {id}, data});
    return species;
}

export async function deleteSpecies(parent, args, context, info) {
    const id = args.id;
    await prisma.species.delete({where: {id}});
    return true;
}
