import { IResolvers } from 'graphql-tools';
import {getStarship, getStarships} from "./StarshipController";
import {getPerson, getPeople} from "./PersonController";
import {getFilm, getFilms} from "./FilmController";
import {getVehicle, getVehicles} from "./VehicleController";
import {getSpecies, getSpecieses} from "./SpeciesController";
import {getPlanet, getPlanets} from "./PlanetController";

const resolvers: IResolvers = {
    Query: {
        starship(parent, args, context, info) {
            return getStarship(parent, args, context, info);
        },
        starships(parent, args, context, info) {
            return getStarships(parent, args, context, info);
        },
        person(parent, args, context, info) {
            return getPerson(parent, args, context, info);
        },
        people(parent, args, context, info) {
            return getPeople(parent, args, context, info);
        },
        film(parent, args, context, info) {
            return getFilm(parent, args, context, info);
        },
        films(parent, args, context, info) {
            return getFilms(parent, args, context, info);
        },
        vehicle(parent, args, context, info) {
            return getVehicle(parent, args, context, info);
        },
        vehicles(parent, args, context, info) {
            return getVehicles(parent, args, context, info);
        },
        species(parent, args, context, info) {
            return getSpecies(parent, args, context, info);
        },
        specieses(parent, args, context, info) {
            return getSpecieses(parent, args, context, info);
        },
        planet(parent, args, context, info) {
            return getPlanet(parent, args, context, info);
        },
        planets(parent, args, context, info) {
            return getPlanets(parent, args, context, info);
        },
    }
};

export default resolvers;
