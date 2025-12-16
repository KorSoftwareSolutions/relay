import crypto from "crypto";
import z from "zod";

export const fingerprintSchema = z.object({
  clipboardValue: z.string().nullable(),
  ipAddress: z.string().nullable(),
  deviceManufacturer: z.string().nullable(),
  deviceModel: z.string().nullable(),
  osName: z.string().nullable(),
  osVersion: z.string().nullable(),
  screenWidth: z.number(),
  screenHeight: z.number(),
  pixelRatio: z.number(),
  timeZone: z.string().nullable(),
  languageTags: z.array(z.string()),
});

export type Fingerprint = z.infer<typeof fingerprintSchema>;

export interface FingerprintDbRecord extends Fingerprint {
  hash: string;
  createdDate: Date;
  updatedDate?: Date;
}

type HashFn = (data: Fingerprint) => Promise<string>;

export interface FingerprintMethods {
  hashFingerprint: HashFn;
  parseFingerprint: (data: any) => Fingerprint;
  storeFingerprint: (data: Fingerprint, hash: string) => Promise<FingerprintDbRecord>;
  getFingerprintByHash: (hash: string) => Promise<FingerprintDbRecord | null>;
}

export type FingerprintSdkOptions = {
  methods: {
    hashFingerprint?: FingerprintMethods["hashFingerprint"];
    parseFingerprint?: FingerprintMethods["parseFingerprint"];
    storeFingerprint: FingerprintMethods["storeFingerprint"];
    getFingerprintByHash: FingerprintMethods["getFingerprintByHash"];
  };
};

type FingerprintSdk = FingerprintMethods;

export const createFingerprintSdk = ({ methods }: FingerprintSdkOptions): FingerprintSdk => {
  return {
    hashFingerprint: methods?.hashFingerprint ?? defaultHashFingerprint,
    parseFingerprint: methods?.parseFingerprint ?? defaultParseFingerprint,
    storeFingerprint:
      methods?.storeFingerprint ??
      (async () => {
        throw new Error("storeFingerprint method not implemented");
      }),
    getFingerprintByHash:
      methods?.getFingerprintByHash ??
      (async () => {
        throw new Error("getFingerprintByHash method not implemented");
      }),
  };
};

const defaultHashFingerprint = async (data: Fingerprint): Promise<string> => {
  // Keep the order consistent to ensure the same hash for the same data
  const stringToHash = JSON.stringify({
    ipAddress: data.ipAddress,
    deviceManufacturer: data.deviceManufacturer,
    deviceModel: data.deviceModel,
    osName: data.osName,
    osVersion: data.osVersion,
    screenWidth: data.screenWidth,
    screenHeight: data.screenHeight,
    pixelRatio: data.pixelRatio,
    timeZone: data.timeZone,
    languageTags: data.languageTags,
    clipboardValue: data.clipboardValue,
  } satisfies Fingerprint);

  return generateHash(stringToHash);
};

const defaultParseFingerprint = (data: any): Fingerprint => {
  return fingerprintSchema.parse(data);
};

export const generateHash = (payload: string): string => {
  return crypto.createHash("sha256").update(payload).digest("hex");
};
