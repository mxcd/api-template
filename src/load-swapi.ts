import {prisma} from './util';
const axios = require('axios');

async function loadWithPagination(startUrl) {
    let results = [];
    let nextUrl = startUrl;
    do {
        const res = await axios(nextUrl)
        nextUrl = res.data.next;
        results = results.concat(res.data.results);
    }
    while(nextUrl)

    return results;
}

async function main() {
    let persons:any = await loadWithPagination('https://swapi.dev/api/people');
    console.log(`loaded ${persons.length} persons`)
    await prisma.person.deleteMany()
    await prisma.person.createMany({data: persons.map(e => toDatabasePerson(e))})

    let planets:any = await loadWithPagination('https://swapi.dev/api/planets');
    console.log(`loaded ${planets.length} planets`)
    await prisma.planet.deleteMany();
    await prisma.planet.createMany({data: planets.map(e => toDatabasePlanet(e))})

    let films:any = await loadWithPagination('https://swapi.dev/api/films');
    console.log(`loaded ${films.length} films`)
    await prisma.film.deleteMany();
    await prisma.film.createMany({data: films.map(e => toDatabaseFilm(e))})

    let species:any = await loadWithPagination('https://swapi.dev/api/species');
    console.log(`loaded ${species.length} species`)
    await prisma.species.deleteMany();
    await prisma.species.createMany({data: species.map(e => toDatabaseSpecies(e))})

    let vehicles:any = await loadWithPagination('https://swapi.dev/api/vehicles');
    console.log(`loaded ${vehicles.length} vehicles`)
    await prisma.vehicle.deleteMany();
    await prisma.vehicle.createMany({data: vehicles.map(e => toDatabaseVehicle(e))})

    let starships:any = await loadWithPagination('https://swapi.dev/api/starships');
    console.log(`loaded ${starships.length} starships`)
    await prisma.starship.deleteMany();
    await prisma.starship.createMany({data: starships.map(e => toDatabaseStarship(e))})


    console.log(`connecting persons`)
    for(const person of persons) {
        const id = parseInt(getUrlId(person.url))
        await prisma.person.update({
            where: {id},
            data: {
                films: {connect: mapIdArray(person.films)},
                species: {connect: mapIdArray(person.species)},
                vehicles: {connect: mapIdArray(person.vehicles)},
                starships: {connect: mapIdArray(person.starships)}
            }
        })
    }

    console.log(`connecting planets`)
    for(const planet of planets) {
        const id = parseInt(getUrlId(planet.url))
        await prisma.planet.update({
            where: {id},
            data: {
                films: {connect: mapIdArray(planet.films)},
                residents: {connect: mapIdArray(planet.residents)},
            }
        })
    }

    console.log(`connecting films`)
    for(const film of films) {
        const id = parseInt(getUrlId(film.url))
        await prisma.film.update({
            where: {id},
            data: {
                species: {connect: mapIdArray(film.species)},
                starships: {connect: mapIdArray(film.starships)},
                vehicles: {connect: mapIdArray(film.vehicles)},
                characters: {connect: mapIdArray(film.characters)},
                planets: {connect: mapIdArray(film.planets)},
            }
        })
    }

    console.log(`connecting species`)
    for(const s of species) {
        const id = parseInt(getUrlId(s.url))
        const homeworld = s.homeworld ? { homeworld: {connect: { id: parseInt(getUrlId(s.homeworld))}}} : {};
        await prisma.species.update({
            where: {id},
            data: {
                ...homeworld,
                people: {connect: mapIdArray(s.people)},
                films: {connect: mapIdArray(s.films)},
            }
        })
    }

    console.log(`connecting vehicles`)
    for(const vehicle of vehicles) {
        const id = parseInt(getUrlId(vehicle.url))
        await prisma.vehicle.update({
            where: {id},
            data: {
                films: {connect: mapIdArray(vehicle.films)},
                pilots: {connect: mapIdArray(vehicle.pilots)},
            }
        })
    }
}

function getUrlId(url) {
    return url.split('/')[url.split('/').length - 2]
}

function mapIdArray(array) {
    return array.map(e => { return { id: parseInt(getUrlId(e)) } })
}

function toDatabasePerson(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        name: swApiObj.name,
        height: parseInt(swApiObj.height) || null,
        mass: parseInt(swApiObj.mass) || null,
        hairColor: swApiObj.hair_color,
        skinColor: swApiObj.skin_color,
        eyeColor: swApiObj.eye_color,
        birthYear: swApiObj.birth_year,
        gender: swApiObj.gender,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
        // homeworldId: getUrlId(swApiObj.homeworld),
    }
}

function toDatabasePlanet(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        name: swApiObj.name,
        diameter: parseInt(swApiObj.diameter) || null,
        rotationPeriod: parseFloat(swApiObj.rotation_period) || null,
        orbitalPeriod: parseFloat(swApiObj.orbital_period) || null,
        gravity: parseFloat(swApiObj.gravity) || null,
        population: parseInt(swApiObj.population) || null,
        climate: swApiObj.climate,
        terrain: swApiObj.terrain,
        surfaceWater: parseFloat(swApiObj.surface_water) || null,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
    }
}

function toDatabaseFilm(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        title: swApiObj.title,
        episodeId: swApiObj.episode_id,
        openingCrawl: swApiObj.opening_crawl,
        director: swApiObj.director,
        producer: swApiObj.producer,
        releaseDate: swApiObj.release_date,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
    }
}

function toDatabaseSpecies(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        name: swApiObj.name,
        classification: swApiObj.classification,
        designation: swApiObj.designation,
        averageHeight: parseFloat(swApiObj.average_height) || null,
        averageLifespan: parseFloat(swApiObj.average_lifespan) || null,
        hairColors: swApiObj.hair_colors,
        skinColors: swApiObj.skin_colors,
        eyeColors: swApiObj.eye_colors,
        language: swApiObj.language,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
    }
}

function toDatabaseVehicle(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        name: swApiObj.name,
        model: swApiObj.model,
        vehicleClass: swApiObj.vehicle_class,
        manufacturer: swApiObj.manufacturer,
        length: parseFloat(swApiObj.length) || null,
        cost: parseInt(swApiObj.cost_in_credits) || null,
        crew: parseInt(swApiObj.crew) || null,
        passengers: parseInt(swApiObj.passengers) || null,
        maxAtmospheringSpeed: parseInt(swApiObj.max_atmosphering_speed) || null,
        cargoCapacity: parseInt(swApiObj.cargo_capacity) || null,
        consumables: swApiObj.consumables,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
    }
}

function toDatabaseStarship(swApiObj) {
    return {
        id: parseInt(getUrlId(swApiObj.url)),
        name: swApiObj.name,
        model: swApiObj.model,
        starshipClass: swApiObj.starship_class,
        manufacturer: swApiObj.manufacturer,
        length: parseFloat(swApiObj.length) || null,
        cost: parseInt(swApiObj.cost_in_credits) || null,
        crew: parseInt(swApiObj.crew) || null,
        passengers: parseInt(swApiObj.passengers) || null,
        maxAtmospheringSpeed: parseInt(swApiObj.max_atmosphering_speed) || null,
        hyperdriveRating: parseFloat(swApiObj.hyperdrive_rating) || null,
        mglt: parseFloat(swApiObj.MGLT) || null,
        cargoCapacity: parseInt(swApiObj.cargo_capacity) || null,
        consumables: swApiObj.consumables,
        createdDate: swApiObj.created,
        modifiedDate: swApiObj.edited,
    }
}

main().then(() => {
    console.log("done");
    prisma.$disconnect();
})
