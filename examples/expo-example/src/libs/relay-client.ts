import { RelayExpoClient } from "@korsolutions/relay";

export const relayExpoClient = new RelayExpoClient({
  serverUrl: "http://localhost:8081/api",
});
