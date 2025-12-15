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

export interface FingerprintMethods {
  hashFingerprint(data: Fingerprint): Promise<string>;
  parseFingerprint: (data: any) => Fingerprint;
  storeFingerprint?(data: Fingerprint): Promise<FingerprintDbRecord>;
  getFingerprintByHash?(hash: string): Promise<FingerprintDbRecord | null>;
}

type FingerprintParams = {
  useDefaultMethods?: boolean;
  methods?: Partial<FingerprintMethods>;
};

type FingerprintSdk = FingerprintMethods;

export const createFingerprintSdk = ({ useDefaultMethods = false, methods }: FingerprintParams): FingerprintSdk => {
  const hashFn = methods?.hashFingerprint ?? defaultHashFingerprint;
  const parseFn = methods?.parseFingerprint ?? defaultParseFingerprint;
  let storeFn = methods?.storeFingerprint;
  let getByHashFn = methods?.getFingerprintByHash;

  if (useDefaultMethods) {
    if (!storeFn) {
      storeFn = defaultStoreFingerprint(hashFn);
    }
    if (!getByHashFn) {
      getByHashFn = defaultGetFingerprintByHash;
    }
  }

  return {
    hashFingerprint: hashFn,
    parseFingerprint: parseFn,
    storeFingerprint: storeFn,
    getFingerprintByHash: getByHashFn,
  };
};

const localFingerprintStore: Map<string, FingerprintDbRecord> = new Map();

const defaultStoreFingerprint =
  (hashFn: FingerprintMethods["hashFingerprint"]) =>
  async (data: Fingerprint): Promise<FingerprintDbRecord> => {
    const hash = await hashFn(data);

    let record = localFingerprintStore.get(hash);
    if (record) {
      record.updatedDate = new Date();
      return record;
    } else {
      record = {
        hash,
        createdDate: new Date(),
        ...data,
      };
    }

    localFingerprintStore.set(hash, record);

    return record;
  };

const defaultGetFingerprintByHash = async (hash: string): Promise<FingerprintDbRecord | null> => {
  return localFingerprintStore.get(hash) || null;
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
  return {
    clipboardValue: data.clipboardValue || null,
    ipAddress: data.ipAddress || null,
    deviceManufacturer: data.deviceManufacturer || null,
    deviceModel: data.deviceModel || null,
    osName: data.osName || null,
    osVersion: data.osVersion || null,
    screenWidth: typeof data.screenWidth === "number" ? data.screenWidth : 0,
    screenHeight: typeof data.screenHeight === "number" ? data.screenHeight : 0,
    pixelRatio: typeof data.pixelRatio === "number" ? data.pixelRatio : 1,
    timeZone: data.timeZone || null,
    languageTags: Array.isArray(data.languageTags) ? data.languageTags : [],
  };
};

export const generateHash = (payload: string): string => {
  return crypto.createHash("sha256").update(payload).digest("hex");
};
