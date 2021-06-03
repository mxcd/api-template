import { IResolvers } from 'graphql-tools';
import {getStarship, getStarships, getFilmsForStarship, getPilotsForStarship} from "./StarshipController";
import {getPerson, getPeople, getHomeworldForPerson, getFilmsForPerson, getSpeciesForPerson, getStarshipsForPerson, getVehiclesForPerson} from "./PersonController";
import {getFilm, getFilms, getSpeciesForFilm, getStarshipsForFilm, getVehiclesForFilm, getCharactersForFilm, getPlanetsForFilm} from "./FilmController";
import {getVehicle, getVehicles, getFilmsForVehicle, getPilotsForVehicle} from "./VehicleController";
import {getSpecies, getSpecieses, getHomeworldForSpecies, getFilmsForSpecies, getPeopleForSpecies} from "./SpeciesController";
import {getPlanet, getPlanets, getFilmsForPlanet, getSpeciesForPlanet, getResidentsForPlanet} from "./PlanetController";

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
    },

    Starship: {
        films(parent, args, context, info) {
            return getFilmsForStarship(parent, args, context, info);
        },
        pilots(parent, args, context, info) {
            return getPilotsForStarship(parent, args, context, info);
        },
    },

    Person: {
        homeworld(parent, args, context, info) {
            return getHomeworldForPerson(parent, args, context, info);
        },
        films(parent, args, context, info) {
            return getFilmsForPerson(parent, args, context, info);
        },
        species(parent, args, context, info) {
            return getSpeciesForPerson(parent, args, context, info);
        },
        starships(parent, args, context, info) {
            return getStarshipsForPerson(parent, args, context, info);
        },
        vehicles(parent, args, context, info) {
            return getVehiclesForPerson(parent, args, context, info);
        },
    },

    Film: {
        species(parent, args, context, info) {
            return getSpeciesForFilm(parent, args, context, info);
        },
        starships(parent, args, context, info) {
            return getStarshipsForFilm(parent, args, context, info);
        },
        vehicles(parent, args, context, info) {
            return getVehiclesForFilm(parent, args, context, info);
        },
        characters(parent, args, context, info) {
            return getCharactersForFilm(parent, args, context, info);
        },
        planets(parent, args, context, info) {
            return getPlanetsForFilm(parent, args, context, info);
        },
    },

    Vehicle: {
        films(parent, args, context, info) {
            return getFilmsForVehicle(parent, args, context, info);
        },
        pilots(parent, args, context, info) {
            return getPilotsForVehicle(parent, args, context, info);
        },
    },

    Species: {
        homeworld(parent, args, context, info) {
            return getHomeworldForSpecies(parent, args, context, info);
        },
        films(parent, args, context, info) {
            return getFilmsForSpecies(parent, args, context, info);
        },
        people(parent, args, context, info) {
            return getPeopleForSpecies(parent, args, context, info);
        },
    },

    Planet: {
        films(parent, args, context, info) {
            return getFilmsForPlanet(parent, args, context, info);
        },
        species(parent, args, context, info) {
            return getSpeciesForPlanet(parent, args, context, info);
        },
        residents(parent, args, context, info) {
            return getResidentsForPlanet(parent, args, context, info);
        },
    },
};

export default resolvers;
