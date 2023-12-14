import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://api-stg.shortcast.ai/graphql",
	cache: new InMemoryCache({
		typePolicies: {
			Query: {},
		},
	}),
});

export default client;
