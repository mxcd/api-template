import {prisma} from "../util";


export async function getMembers(parent, args, context, info) {
    // TODO add support for search and cursor
    return await prisma.member.findMany();
}

export async function getMember(parent, args, context, info) {
    return await prisma.member.findOne({where: {id: args.id}});
}

export async function getGroupsForMember(parent, args, context, info) {
    return await prisma.member.findOne({where: {id: parent.id}}).groups();
}

export async function addMember(parent, args, context, info) {
    // TODO check if API consumer is allowed to create a new group based on context entry
    let addMemberInput = args.input;
    Object.assign(addMemberInput, {createdBy: context.username, modifiedBy: context.username})
    const member = await prisma.member.create({data: addMemberInput});
    return member;
}