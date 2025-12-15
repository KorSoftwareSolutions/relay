import { createRelayServer } from "@korsolutions/relay";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const storePath = path.join(process.cwd(), "src/app/api/fingerprint-store.json");
const linkStorePath = path.join(process.cwd(), "src/app/api/deferred-link-store.json");

export const relayServer = createRelayServer({
  hooks: {
    onMatchFound: async (deferredLink) => {
      console.log("Match found for deferred link:", deferredLink);
    },
  },
  deferredLink: {
    methods: {
      storeDeferredLink: async (deferredLink) => {
        const store = JSON.parse(readFileSync(linkStorePath, "utf-8"));
        store.push(deferredLink);
        writeFileSync(linkStorePath, JSON.stringify(store, null, 2), "utf-8");
      },
      getDeferredLinkByFingerprintHash: async (fingerprintHash) => {
        const store = JSON.parse(readFileSync(linkStorePath, "utf-8"));
        return store.find((link: any) => link.fingerprintHash === fingerprintHash) || null;
      },
      deleteDeferredLink: async (id) => {
        let store = JSON.parse(readFileSync(linkStorePath, "utf-8"));
        store = store.filter((link: any) => link.id !== id);
        writeFileSync(linkStorePath, JSON.stringify(store, null, 2), "utf-8");
      },
    },
  },
  fingerprint: {
    methods: {
      storeFingerprint: async (fingerprint, hash) => {
        const id = new Date().getTime().toString();
        const record = { ...fingerprint, hash, id, createdDate: new Date() };
        const store = JSON.parse(readFileSync(storePath, "utf-8"));
        store[hash] = record;
        writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
        return record;
      },
      getFingerprintByHash: async (hash) => {
        const store = JSON.parse(readFileSync(storePath, "utf-8"));
        const record = Object.values(store).find((rec: any) => rec.hash === hash) || null;
        return record as any;
      },
      listAllFingerprints: async () => {
        const store = JSON.parse(readFileSync(storePath, "utf-8"));
        return Object.values(store);
      },
    },
  },
});
