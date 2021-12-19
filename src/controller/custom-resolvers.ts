
export default function addCustomResolvers(resolvers) {
    if(!resolvers.Query) {
        resolvers.Query = {}
    }

    if(!resolvers.Mutation) {
        resolvers.Mutation = {}
    }
}
