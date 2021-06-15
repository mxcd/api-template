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

function isModel(models, s) {
    for(const model of models) {
        if(model.upperCamelCaseName === s || model.lowerCamelCaseName === s || model.upperCamelCasePluralName === s || model.lowerCamelCasePluralName === s) return true
    }
    return false;
}

function getModel(models, s) {
    for(const model of models) {
        if(model.upperCamelCaseName === s || model.lowerCamelCaseName === s || model.upperCamelCasePluralName === s || model.lowerCamelCasePluralName === s) return model
    }
    return null;
}

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
        let model:any = {upperCamelCaseName: modelMatch[1], fields: [], searchFields: [], filterFields: [], sortFields: [], relationFields: []}
        model.upperCamelCasePluralName = getPlural(model.upperCamelCaseName)
        model.lowerCamelCasePluralName = model.upperCamelCasePluralName.charAt(0).toLowerCase() + model.upperCamelCasePluralName.slice(1)
        model.lowerCamelCaseName = model.upperCamelCaseName.charAt(0).toLowerCase() + model.upperCamelCaseName.slice(1)

        console.log(`parsing model '${modelMatch[1]}'`)
        let fieldMatch;
        do {
            fieldMatch = FIELD_REGEX.exec(modelMatch[2])
            if(fieldMatch) {
                console.log(`\t => ${fieldMatch[1]}`)
                let field:any = {
                    name: fieldMatch[1],
                    type: fieldMatch[2]
                }

                field.lowerCamelCaseName = field.name;
                field.upperCamelCaseName = field.lowerCamelCaseName.charAt(0).toUpperCase() + field.lowerCamelCaseName.slice(1)

                model.fields.push(field)
            }
        } while(fieldMatch)

        let annotationMatch;
        do {
            annotationMatch = FIELD_ANNOTATION_REGEX.exec(modelMatch[2])
            if(annotationMatch) {
                const field = getField(model, annotationMatch[2])
                if(annotationMatch[1].indexOf("@search") !== -1) {
                    const searchModeMatch = /@search\((\w*)\)/gm.exec(annotationMatch[1]);
                    field.searchMode = searchModeMatch ? searchModeMatch[1] : "contains";
                    model.searchFields.push(field)
                }
                if(annotationMatch[1].indexOf("@filter") !== -1) {
                    const filterModeMatch = /@filter\((\w*)\)/gm.exec(annotationMatch[1]);
                    field.filterMode = filterModeMatch ? filterModeMatch[1] : "contains";
                    model.filterFields.push(field)
                }
                if(annotationMatch[1].indexOf("@sort") !== -1) {
                    model.sortFields.push(field)
                }
            }
        } while(annotationMatch)

        models.push(model)
    }
} while(modelMatch);

for(const model of models) {
    for(let field of model.fields) {
        const prismaType = field.type;
        field.isRequired = !prismaType.endsWith("?");
        field.isArray = prismaType.endsWith("[]");
        field.dataType = prismaType.replace("?", "").replace("[", "").replace("]", "")
        field.isModel = isModel(models, field.dataType)
        if(field.isModel) {
            field.model = getModel(models, field.dataType)
        }
        field.gqlType = `${field.isArray?'[':''}${field.dataType}${field.isArray?'!]':''}${field.isRequired?'!':''}`
        if(field.isModel) {
            model.relationFields.push(field)
        }
        if(field.name === "id") {
            model.idType = field.dataType;
        }
    }
}

if(!existsSync(outputDir)) mkdirSync(outputDir)
const schemaDir = join(outputDir, "schema")
if(!existsSync(schemaDir)) mkdirSync(schemaDir)


// GraphQL types
const typesTemplate = readFileSync(join(__dirname, 'types.ejs'), 'utf8');
let types = ejs.render(typesTemplate, {models, DEFAULT_QUERY_LIMIT})
writeFileSync(join(schemaDir, `types.graphql`), types)


// GraphQL operations
const operationsTemplate = readFileSync(join(__dirname, 'operations.ejs'), 'utf8');
let operations = ejs.render(operationsTemplate, {models, DEFAULT_QUERY_LIMIT})
writeFileSync(join(schemaDir, `operations.graphql`), operations)

// GraphQL inputs
const inputsTemplate = readFileSync(join(__dirname, 'inputs.ejs'), 'utf8');
let inputs = ejs.render(inputsTemplate, {models, DEFAULT_QUERY_LIMIT})
writeFileSync(join(schemaDir, `inputs.graphql`), inputs)

// Model Controller
const controllerDir = join(outputDir, "controller")
if(!existsSync(controllerDir)) mkdirSync(controllerDir)
const controllerTemplate = readFileSync(join(__dirname, 'controller.ejs'), 'utf8');
for(const model of models) {
    let controller = ejs.render(controllerTemplate, {model})
    writeFileSync(join(controllerDir, `${model.upperCamelCaseName}Controller.ts`), controller)
}

// Resolvers file
const resolversTemplate = readFileSync(join(__dirname, 'resolvers.ejs'), 'utf8');
let resolvers = ejs.render(resolversTemplate, {models})
writeFileSync(join(controllerDir, `resolvers.ts`), resolvers)

