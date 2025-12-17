export type Fingerprint = {
  clipboardValue: string | null;
  ipAddress: string | null;
  deviceManufacturer: string | null;
  deviceModel: string | null;
  osName: string | null;
  osVersion: string | null;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  timeZone: string | null;
  languageTags: string[];
};
