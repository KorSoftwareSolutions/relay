import z from "zod";
import { type DeferredLink, type DeferredLinkingConfig, DeferredLinkingSdk } from "./deferred-link";
import { createFingerprintSdk, type FingerprintMethods, fingerprintSchema } from "./fingerprint";

export interface RelayServer {
  handler: (request: Request) => Promise<Response>;
}

export interface RelayConfig {
  deferredLinkingConfig?: Partial<DeferredLinkingConfig>;
  methods?: FingerprintMethods;
  hooks?: {
    onMatchFound?: (deferredLink: DeferredLink) => Promise<void> | void;
  };
}

const captureRequestSchema = z.object({
  deferredLinkUrl: z.url(),
  fingerprint: fingerprintSchema,
});

const processRequestSchema = fingerprintSchema;

const getIpAddressFromRequest = (request: Request): string | null => {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
  return ip || null;
};

export type CaptureRequest = z.infer<typeof captureRequestSchema>;

export const createRelayServer = (config: RelayConfig): RelayServer => {
  const fingerprintSdk = createFingerprintSdk({
    useDefaultMethods: true,
    methods: config.methods,
  });
  const deferredLinkSdk = new DeferredLinkingSdk({});

  return {
    handler: async (request: Request): Promise<Response> => {
      if (request.method === "POST" && request.url.endsWith("/relay/capture")) {
        const jsonData = await request.json();
        const requestData = captureRequestSchema.parse(jsonData);
        const fingerprint = {
          ...requestData.fingerprint,
          ipAddress: getIpAddressFromRequest(request),
        };
        await fingerprintSdk.storeFingerprint?.(fingerprint);
        const fingerprintHash = await fingerprintSdk.hashFingerprint(fingerprint);
        await deferredLinkSdk.createDeferredLink({
          url: requestData.deferredLinkUrl,
          fingerprintHash,
        });
        return Response.json({ success: true }, { status: 200 });
      }
      if (request.method === "POST" && request.url.endsWith("/relay/process")) {
        const jsonData = await request.json();
        const requestData = processRequestSchema.parse(jsonData);
        const fingerprint = {
          ...requestData,
          ipAddress: getIpAddressFromRequest(request),
        };
        const fingerprintHash = await fingerprintSdk.hashFingerprint(fingerprint);
        const deferredLink = await deferredLinkSdk.getDeferredLinkByFingerprintHash(fingerprintHash);
        if (deferredLink) {
          await config.hooks?.onMatchFound?.(deferredLink);
          return Response.json({ deferredLink }, { status: 200 });
        }
      }
      return Response.json({ error: "Not Found" }, { status: 404 });
    },
  };
};
