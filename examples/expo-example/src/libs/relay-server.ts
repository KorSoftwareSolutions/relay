import { createRelayServer } from "@korsolutions/relay";

const fingerPrintStore: Record<string, any> = {};

export const relayServer = createRelayServer({
  hooks: {
    onMatchFound: async (deferredLink) => {
      console.log("Match found for deferred link:", deferredLink);
    },
  },
  fingerprint: {
    methods: {
      storeFingerprint: async (fingerprint, hash) => {
        console.log("Storing fingerprint:", fingerprint);
        const id = new Date().getTime().toString();
        const record = { ...fingerprint, hash, id, createdDate: new Date() };
        fingerPrintStore[id] = record;
        console.log("Current fingerprint store:", fingerPrintStore);
        return record;
      },
      getFingerprintByHash: async (hash) => {
        return Object.values(fingerPrintStore).find((rec) => rec.hash === hash) || null;
      },
      listAllFingerprints: async () => {
        console.log("Listing all fingerprints", fingerPrintStore);
        return Object.values(fingerPrintStore);
      },
    },
  },
});
