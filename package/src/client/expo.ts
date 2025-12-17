import * as ExpoDevice from "expo-device";
import * as Localization from "expo-localization";
import * as Clipboard from "expo-clipboard";
import { Dimensions, PixelRatio } from "react-native";
import { type Fingerprint } from "../fingerprint";
import type { RelayClient, RelayClientOptions } from ".";
import type { CaptureRequest, ProcessRequest, ProcessResponse } from "../server";

const getTimeZone = () => {
  return Localization.getCalendars()[0]?.timeZone || null;
};

const getLanguageTags = () => {
  const locales = Localization.getLocales();
  const localeLanguageTags = locales.map((locale) => locale.languageTag);
  return localeLanguageTags.sort();
};

const getClipboardValue = async (): Promise<string | null> => {
  try {
    const clipboardContent = await Clipboard.getStringAsync();
    return clipboardContent || null;
  } catch {
    return null;
  }
};

const calculateFingerprint = async (): Promise<Fingerprint> => {
  const screenDimensions = Dimensions.get("screen");

  return {
    ipAddress: null,
    deviceManufacturer: ExpoDevice.manufacturer,
    deviceModel: ExpoDevice.modelName,
    osName: ExpoDevice.osName,
    osVersion: ExpoDevice.osVersion,
    screenWidth: screenDimensions.width,
    screenHeight: screenDimensions.height,
    pixelRatio: PixelRatio.get(),
    timeZone: getTimeZone(),
    languageTags: getLanguageTags(),
    clipboardValue: await getClipboardValue(),
  };
};

class RelayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RelayError";
  }
}

export class RelayExpoClient implements RelayClient {
  private options: RelayClientOptions;
  constructor(options: RelayClientOptions) {
    this.options = options;
  }

  async capture(url: string) {
    const fingerprint = await calculateFingerprint();

    const captureRequest: CaptureRequest = {
      deferredLinkUrl: url,
      fingerprint,
    };

    const response = await fetch(`${this.options.serverUrl}/capture`, {
      ...this.options.fetchOptions,
      method: "POST",
      headers: {
        ...(this.options.fetchOptions?.headers || {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(captureRequest),
    });
    if (!response.ok) {
      throw new RelayError(`Capture request failed with status ${response.status}`);
    }
  }

  async process() {
    const fingerprint = await calculateFingerprint();
    const request: ProcessRequest = fingerprint;

    const response = await fetch(`${this.options.serverUrl}/process`, {
      ...this.options.fetchOptions,
      method: "POST",
      headers: {
        ...(this.options.fetchOptions?.headers || {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new RelayError(`Process request failed with status ${response.status}`);
    }
    const responseData = await response.json();
    return responseData as ProcessResponse;
  }
}
