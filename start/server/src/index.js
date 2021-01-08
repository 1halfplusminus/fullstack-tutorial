import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import { createStore } from "./utils";
import { LaunchAPI } from "./datasources/launch";
import UserAPI from "./datasources/user";
import resolvers from "./resolvers";
import isEmail from "isemail";

dotenv.config();

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) {
      return { user: null };
    }
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;
    return { user: { ...user.dataValues } };
  },
});

server.listen().then(({ url }) => {
  console.log(`
    🚀 Server ready at ${url}
    Explore at https://studio.apollographql.com/dev
  `);
});
