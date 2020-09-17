import Action from "@BrainlyReq/Brainly";
import { DocumentNode } from "graphql";
// import { GraphQLClient } from "graphql-request";
import { /* RequestDocument, */ Variables } from "graphql-request/dist/types";

export default async function GQL<T>(
  document: DocumentNode,
  variables: Variables = {},
): Promise<{ data: T }> {
  return new Action().GQL().POST({
    operationName: "",
    variables,
    query: document.loc.source.body,
  });
  /* const origin = System?.data.meta.location.origin || window.location.origin;
  const marketKey = System.data.Brainly.defaultConfig.MARKET;
  const endpoint = `${origin}/graphql/${marketKey}`;

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: "include",
    mode: "cors",
    headers: {
      "X-B-Token-Long": System.data.Brainly.tokenLong,
    },
  });

  const res = await graphQLClient.request(document, variables);
  console.log("res", res); */
}
