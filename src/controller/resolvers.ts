import { IResolvers } from 'graphql-tools';
import {addMember, getGroupsForMember, getMember, getMembers} from "./MemberController";
import {addGroup, getGroup, getGroups, getMembersForGroup} from "./GroupController";


const resolvers: IResolvers = {
    Query: {
        members(parent, args, context, info) {
            return getMembers(parent, args, context, info);
        },
        member(parent, args, context, info) {
            return getMember(parent, args, context, info);
        },
        groups(parent, args, context, info) {
            return getGroups(parent, args, context, info)
        },
        group(parent, args, context, info) {
            return getGroup(parent, args, context, info)
        }
    },
    Member: {
        __resolveReference(member, {fetchMemberById}) {
            return fetchMemberById(member.id)
        },
        groups(parent, args, context, info) {
            return getGroupsForMember(parent, args, context, info);
        }
    },
    Group: {
        members(parent, args, context, info) {
            return getMembersForGroup(parent, args, context, info);
        }
    },
    Mutation: {
        addMember(parent, args, context, info) {
            return addMember(parent, args, context, info);
        },
        addGroup(parent, args, context, info) {
            return addGroup(parent, args, context, info);
        }
    }
};

export default resolvers;