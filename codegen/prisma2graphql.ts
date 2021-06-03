import {readFileSync, writeFileSync, existsSync, mkdirSync} from "fs";
import {join} from 'path'
const pluralize = require("pluralize")
let ejs = require('ejs');

const DEFAULT_QUERY_LIMIT = 100;

function getPlural(s) {
    if(pluralize.singular(s) === pluralize.plural(s)) {
        return `${s}es`
    }
    else {
        return pluralize.plural(s);
    }
}

/*function isModel(models, s) {
    for(const model of models) {
        if(model.name === s) return true
    }
    return false;
}*/

function getField(model, name) {
    for(const field of model.fields) {
        if(field.name === name) return field;
    }
    return null;
}

if(process.argv.length !== 4) {
    console.log(`ts-node prisma2graphql.ts <schema.prisma> <outputDir>`)
    process.exit(1);
}

const prismaSchemaFile = process.argv[2]
const outputDir = process.argv[3]

if(!existsSync(prismaSchemaFile)) {
    console.log(`Error: prisma schema file '${prismaSchemaFile}' does not exist!`)
    process.exit(1);
}

// if(existsSync(outputDir)) {
//     console.log(`Error: output dir '${outputDir}' does already exist!`)
//     process.exit(1);
// }

const prismaSchema = readFileSync(prismaSchemaFile, 'utf8');

const MODEL_REGEX = /model\s+?(.+?)\s*?{([\s\S]*?)}/gm
const FIELD_REGEX = /^\s*?(\w+?)\s+(\S+)/gm
const FIELD_ANNOTATION_REGEX = /(\/\/.*\s)(?:^\s*(\w+))/gm

let models: any = []

let modelMatch;
do {
    modelMatch = MODEL_REGEX.exec(prismaSchema)
    if(modelMatch) {
        let model:any = {name: modelMatch[1], fields: [], searchFields: [], filterFields: []}

        console.log(`parsing model '${modelMatch[1]}'`)
        let fieldMatch;
        do {
            fieldMatch = FIELD_REGEX.exec(modelMatch[2])
            if(fieldMatch) {
                console.log(`\t => ${fieldMatch[1]}`)
                model.fields.push({
                    name: fieldMatch[1],
                    type: fieldMatch[2]
                })
            }
        } while(fieldMatch)

        let annotationMatch;
        do {
            annotationMatch = FIELD_ANNOTATION_REGEX.exec(modelMatch[2])
            if(annotationMatch) {
                const field = getField(model, annotationMatch[2])
                if(annotationMatch[1].indexOf("@search") !== 0) {
                    const searchModeMatch = /@search\((\w*)\)/gm.exec(annotationMatch[1]);
                    field.searchMode = searchModeMatch ? searchModeMatch[1] : "contains";
                    model.searchFields.push(field)
                }
                if(annotationMatch[1].indexOf("@filter") !== 0) {
                    const filterModeMatch = /@filter\((\w*)\)/gm.exec(annotationMatch[1]);
                    field.filterMode = filterModeMatch ? filterModeMatch[1] : "contains";
                    model.filterFields.push(field)
                }
            }
        } while(annotationMatch)

        models.push(model)
    }
} while(modelMatch);

if(!existsSync(outputDir)) mkdirSync(outputDir)
const schemaDir = join(outputDir, "schema")
if(!existsSync(schemaDir)) mkdirSync(schemaDir)


// GraphQL types
for(const model of models) {
    for(const field of model.fields) {
        const prismaType = field.type;
        field.isRequired = !prismaType.endsWith("?");
        field.isArray = prismaType.endsWith("[]");
        field.dataType = prismaType.replace("?", "").replace("[", "").replace("]", "")
        field.gqlType = `${field.isArray?'[':''}${field.dataType}${field.isArray?'!]':''}${field.isRequired?'!':''}`
    }
    model.pluralName = getPlural(model.name)
}
const typesTemplate = readFileSync(join(__dirname, 'types.ejs'), 'utf8');
let types = ejs.render(typesTemplate, {models})
writeFileSync(join(schemaDir, `types.graphql`), types)


// GraphQL operations
const operationsTemplate = readFileSync(join(__dirname, 'operations.ejs'), 'utf8');
let operations = ejs.render(operationsTemplate, {models, DEFAULT_QUERY_LIMIT})
writeFileSync(join(schemaDir, `operations.graphql`), operations)

// GraphQL inputs
const inputsTemplate = readFileSync(join(__dirname, 'inputs.ejs'), 'utf8');
let inputs = ejs.render(inputsTemplate, {models})
writeFileSync(join(schemaDir, `inputs.graphql`), inputs)

// Model Controller
const controllerDir = join(outputDir, "controller")
if(!existsSync(controllerDir)) mkdirSync(controllerDir)
const controllerTemplate = readFileSync(join(__dirname, 'controller.ejs'), 'utf8');
for(const model of models) {
    let controller = ejs.render(controllerTemplate, {model})
    writeFileSync(join(controllerDir, `${model.name}Controller.ts`), controller)
}

// Resolvers file
const resolversTemplate = readFileSync(join(__dirname, 'resolvers.ejs'), 'utf8');
let resolvers = ejs.render(resolversTemplate, {models})
writeFileSync(join(controllerDir, `resolvers.ts`), resolvers)

