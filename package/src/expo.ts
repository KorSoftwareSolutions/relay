import * as ExpoDevice from "expo-device";
import * as Localization from "expo-localization";
import * as Clipboard from "expo-clipboard";
import { Dimensions, PixelRatio } from "react-native";
import { type Fingerprint } from "./fingerprint";
import type { RelayClient } from "./client";

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

const getProbabilisticFingerprint = async (): Promise<Fingerprint> => {
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

export class ExpoRelayClient implements RelayClient {
  async capture(): Promise<void> {
    const fingerprint = await getProbabilisticFingerprint();
    // Implementation for capturing deferred link on Expo
    console.log("Capturing deferred link on Expo device with fingerprint:", fingerprint);
    // ... actual implementation goes here
  }

  async process(): Promise<void> {
    const fingerprint = await getProbabilisticFingerprint();
    // Implementation for processing deferred link on Expo
    console.log("Processing deferred link on Expo device with fingerprint:", fingerprint);
    // ... actual implementation goes here
  }
}
