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
