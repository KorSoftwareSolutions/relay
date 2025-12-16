import { RelayExpoClient } from "@korsolutions/relay/client";

export const relayExpoClient = new RelayExpoClient({
  serverUrl: "http://localhost:8081/api",
});
