import { serve } from "@hono/node-server";
import { createRelayServer, type DeferredLink, type FingerprintDbRecord } from "@korsolutions/relay";
import { Hono } from "hono";

let linkStore: DeferredLink[] = [];
let fingerprintStore: FingerprintDbRecord[] = [];

export const relayServer = createRelayServer({
  hooks: {
    onMatchFound: async (deferredLink) => {
      console.log("Match found for deferred link:", deferredLink);
    },
  },
  deferredLink: {
    methods: {
      storeDeferredLink: async (deferredLink) => {
        linkStore.push(deferredLink);
      },
      getDeferredLinkByFingerprintHash: async (fingerprintHash) => {
        const link = linkStore.find((link) => link.fingerprintHash === fingerprintHash) || null;
        return link;
      },
      deleteDeferredLink: async (id) => {
        linkStore = linkStore.filter((link) => link.id !== id);
      },
    },
  },
  fingerprint: {
    methods: {
      storeFingerprint: async (fingerprint, hash) => {
        const id = new Date().getTime().toString();
        const record = { ...fingerprint, hash, id, createdDate: new Date() };
        fingerprintStore.push(record);
        return record;
      },
      getFingerprintByHash: async (hash) => {
        const record = fingerprintStore.find((rec) => rec.hash === hash) || null;
        return record;
      },
    },
  },
});

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "relay/*", async (c) => {
  return relayServer.handler(c.req.raw);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
