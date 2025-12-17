import type { ProcessResponse } from "../server";

export interface RelayClient {
  /**
   * Capture a deferred link for the current device
   * @returns
   */
  capture: (url: string) => Promise<void>;
  /**
   * Lookup any deferred links associated with the current device
   * @returns
   */
  process: () => Promise<ProcessResponse>;
}

export interface RelayClientOptions {
  serverUrl: string;
  fetchOptions?: RequestInit;
}

export * from "./expo";
export type * from "../server";
export type * from "../fingerprint";
export type * from "../deferred-link";
