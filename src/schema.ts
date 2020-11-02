import { makeSchema, mutationType, objectType, queryType } from "@nexus/schema";
import { transformSchemaFederation } from "graphql-transform-federation";
import { nexusPrisma } from "nexus-plugin-prisma";
import path from "path";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users({ pagination: true, filtering: true });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.updateOneUser();
    t.crud.deleteOneUser();
  },
});

const schema = makeSchema({
  types: [Query, Mutation, User],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), "./generated/schema.graphql"),
    typegen: path.join(
      __dirname,
      "../../node_modules/@types/nexus-typegen/index.d.ts"
    ),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: ".prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});

const federatedSchema = transformSchemaFederation(schema, {
  Query: {
    extend: true,
  },
});

export default federatedSchema;
