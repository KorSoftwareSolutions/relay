export interface RelayClient {
  /**
   * Capture a deferred link for the current device
   * @returns
   */
  capture: () => Promise<void>;
  /**
   * Lookup any deferred links associated with the current device
   * @returns
   */
  process: () => Promise<void>;
}

export class ExpoRelayClient implements RelayClient {
  async capture(): Promise<void> {
    // Implementation for capturing deferred link on Expo
    console.log("Capturing deferred link on Expo device");
    // ... actual implementation goes here
  }

  async process(): Promise<void> {
    // Implementation for processing deferred link on Expo
    console.log("Processing deferred link on Expo device");
    // ... actual implementation goes here
  }
}
