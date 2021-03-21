import {prisma} from "../util";


export async function getGroups(parent, args, context, info) {
    // TODO add support for search and cursor
    return await prisma.group.findMany();
}

export async function getGroup(parent, args, context, info) {
    return await prisma.group.findUnique({where: {id: args.id}});
}

export async function getMembersForGroup(parent, args, context, info) {
    return await prisma.group.findUnique({where: {id: parent.id}}).members();
}

export async function addGroup(parent, args, context, info) {
    // TODO check if API consumer is allowed to create a new group based on context entry
    let addGroupInput = args.input;
    Object.assign(addGroupInput, {createdBy: context.username, modifiedBy: context.username})
    const group = await prisma.group.create({data: addGroupInput});
    return group;
}
