import z from "zod";
import { type DeferredLink, type DeferredLinkSdkOptions, DeferredLinkSdk } from "./deferred-link";
import { createFingerprintSdk, type FingerprintSdkOptions, fingerprintSchema } from "./fingerprint";

export interface RelayServer {
  handler: (request: Request) => Promise<Response>;
}

export interface RelayConfig {
  fingerprint: FingerprintSdkOptions;
  deferredLink: DeferredLinkSdkOptions;
  hooks?: {
    onMatchFound?: (deferredLink: DeferredLink) => Promise<void> | void;
  };
}

const captureRequestSchema = z.object({
  deferredLinkUrl: z.string().min(1),
  fingerprint: fingerprintSchema,
});

const processRequestSchema = fingerprintSchema;
export type ProcessRequest = z.infer<typeof processRequestSchema>;
export type ProcessResponse = {
  url: string | null;
};

const getIpAddressFromRequest = (request: Request): string | null => {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
  return ip || null;
};

export type CaptureRequest = z.infer<typeof captureRequestSchema>;

export const createRelayServer = (config: RelayConfig): RelayServer => {
  const fingerprintSdk = createFingerprintSdk({
    methods: config.fingerprint.methods,
  });
  const deferredLinkSdk = new DeferredLinkSdk(config.deferredLink);

  return {
    handler: async (request: Request): Promise<Response> => {
      if (request.method === "POST" && request.url.endsWith("/relay/capture")) {
        const jsonData = await request.json();
        const requestData = captureRequestSchema.parse(jsonData);
        const fingerprint = {
          ...requestData.fingerprint,
          ipAddress: getIpAddressFromRequest(request),
        };
        const fingerprintHash = await fingerprintSdk.hashFingerprint?.(fingerprint);
        await fingerprintSdk.storeFingerprint?.(fingerprint, fingerprintHash);
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
        const response: ProcessResponse = { url: null };
        if (!deferredLink) {
          return Response.json(response, { status: 200 });
        }
        await deferredLinkSdk.deleteDeferredLink(deferredLink.id);
        await config.hooks?.onMatchFound?.(deferredLink);
        response.url = deferredLink.url;
        return Response.json(response, { status: 200 });
      }
      return Response.json({ error: "Not Found" }, { status: 404 });
    },
  };
};
