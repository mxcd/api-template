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
        if(filter.releaseDate) where['AND'].push({releaseDate: {contains: filter.releaseDate}});
    }

    if(search) {
        where['OR'] = [
            {title: {contains: search}},
            {releaseDate: {contains: search}},
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

