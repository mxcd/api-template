import {readFileSync, writeFileSync, existsSync} from "fs";

if(process.argv.length !== 4) {
    console.log(`ts-node prisma2graphql.ts <schema.prisma> <types.graphql>`)
    process.exit(1);
}

const prismaSchemaFile = process.argv[2]
const graphqlTypesFile = process.argv[3]

if(!existsSync(prismaSchemaFile)) {
    console.log(`Error: prisma schema file '${prismaSchemaFile}' does not exist!`)
    process.exit(1);
}

if(existsSync(graphqlTypesFile)) {
    console.log(`Error: graphql types file '${graphqlTypesFile}' does already exist!`)
    process.exit(1);
}

const prismaSchema = readFileSync(prismaSchemaFile, 'utf8');

const MODEL_REGEX = /model\s+?(.+?)\s*?{([\s\S]*?)}/gm
const FIELD_REGEX = /^\s*?(\S+?)\s+(\S+)/gm

let models: any = []

let modelMatch;
do {
    modelMatch = MODEL_REGEX.exec(prismaSchema)
    if(modelMatch) {
        let model:any = {name: modelMatch[1], fields: []}
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
        models.push(model)
    }
} while(modelMatch);

let graphqlTypes = "scalar DateTime\n\n"

for(const model of models) {
    graphqlTypes += `type ${model.name} {\n`
    for(const field of model.fields) {
        const name = field.name;
        const prismaType = field.type;
        const isRequired = !prismaType.endsWith("?");
        const isArray = prismaType.endsWith("[]");
        const gqlType = prismaType.replace("?", "").replace("[", "").replace("]", "")
        graphqlTypes += `  ${name}: ${isArray?'[':''}${gqlType}${isArray?'!]':''}${isRequired?'!':''}\n`
    }
    graphqlTypes += `}\n\n`
}

writeFileSync(graphqlTypesFile, graphqlTypes)
