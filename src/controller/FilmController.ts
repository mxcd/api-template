import {prisma} from "../util";
import {ApolloError} from "apollo-server-errors";

export async function getFilm(parent, args, context, info) {
    const id = args.id;
    const film = await prisma.film.findUnique({where: {id}});
    if(!film) {
        throw new ApolloError(`No film with ID '${id}' found`, "NOT_FOUND")
    }
    return film;
}

export async function getFilms(parent, args, context, info) {
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

    const results = await prisma.$transaction([
        prisma.film.count({where}),
        prisma.film.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset
        })
    ])
    const total = results[0];
    const films = results[1];

    return {
        total,
        films
    };
}


export async function getSpeciesForFilm(parent, args, context, info) {
    const id = parent.id;
    const film = await prisma.film.findUnique({where: {id}, include: {species: true}})
    if(film !== null) {
        return film.species;
    }
    else {
        return [];
    }
}

export async function getStarshipsForFilm(parent, args, context, info) {
    const id = parent.id;
    const film = await prisma.film.findUnique({where: {id}, include: {starships: true}})
    if(film !== null) {
        return film.starships;
    }
    else {
        return [];
    }
}

export async function getVehiclesForFilm(parent, args, context, info) {
    const id = parent.id;
    const film = await prisma.film.findUnique({where: {id}, include: {vehicles: true}})
    if(film !== null) {
        return film.vehicles;
    }
    else {
        return [];
    }
}

export async function getCharactersForFilm(parent, args, context, info) {
    const id = parent.id;
    const film = await prisma.film.findUnique({where: {id}, include: {characters: true}})
    if(film !== null) {
        return film.characters;
    }
    else {
        return [];
    }
}

export async function getPlanetsForFilm(parent, args, context, info) {
    const id = parent.id;
    const film = await prisma.film.findUnique({where: {id}, include: {planets: true}})
    if(film !== null) {
        return film.planets;
    }
    else {
        return [];
    }
}


export async function createFilm(parent, args, context, info) {
    const data:any = {}
    if('title' in args.inputs) data['title'] = args.inputs['title']
    if('episodeId' in args.inputs) data['episodeId'] = args.inputs['episodeId']
    if('openingCrawl' in args.inputs) data['openingCrawl'] = args.inputs['openingCrawl']
    if('director' in args.inputs) data['director'] = args.inputs['director']
    if('producer' in args.inputs) data['producer'] = args.inputs['producer']
    if('releaseDate' in args.inputs) data['releaseDate'] = args.inputs['releaseDate']
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
    if('characters' in args.inputs) {
        data['characters'] = {};
        data['characters']['set'] = args.inputs['characters'].map((e:number) => { return { id: e } });
    }
    if('planets' in args.inputs) {
        data['planets'] = {};
        data['planets']['set'] = args.inputs['planets'].map((e:number) => { return { id: e } });
    }

    const film = await prisma.film.create({data});
    return film;
}

export async function editFilm(parent, args, context, info) {
    const id = args.id;
    const data:any = {}
    if('title' in args.inputs) data['title'] = args.inputs['title']
    if('episodeId' in args.inputs) data['episodeId'] = args.inputs['episodeId']
    if('openingCrawl' in args.inputs) data['openingCrawl'] = args.inputs['openingCrawl']
    if('director' in args.inputs) data['director'] = args.inputs['director']
    if('producer' in args.inputs) data['producer'] = args.inputs['producer']
    if('releaseDate' in args.inputs) data['releaseDate'] = args.inputs['releaseDate']
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
    if('characters' in args.inputs) {
        data['characters'] = {};
        data['characters']['set'] = args.inputs['characters'].map((e:number) => { return { id: e } });
    }
    if('planets' in args.inputs) {
        data['planets'] = {};
        data['planets']['set'] = args.inputs['planets'].map((e:number) => { return { id: e } });
    }
    const film = await prisma.film.update({where: {id}, data});
    return film;
}

export async function deleteFilm(parent, args, context, info) {
    const id = args.id;
    await prisma.film.delete({where: {id}});
    return true;
}
