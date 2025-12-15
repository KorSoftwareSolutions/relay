export interface DeferredLink {
  id: string;
  fingerprintHash: string;
  url: string;
  createdDate: Date;
}

export interface DeferredLinkMethods {
  storeDeferredLink: (deferredLink: DeferredLink) => Promise<void>;
  getDeferredLinkByFingerprintHash: (fingerprintHash: string) => Promise<DeferredLink | null>;
  deleteDeferredLink: (id: string) => Promise<void>;
}

export interface DeferredLinkSdkOptions {
  expiryDays?: number;
  autoCleanup?: boolean;
  methods: DeferredLinkMethods;
}

export interface CreateDeferredLinkRequest {
  fingerprintHash: string;
  url: string;
}

export class DeferredLinkSdk {
  private config: Required<DeferredLinkSdkOptions>;

  constructor(config: DeferredLinkSdkOptions) {
    this.config = {
      expiryDays: config.expiryDays ?? 7,
      autoCleanup: config.autoCleanup ?? true,
      methods: config.methods,
    };
  }
  async createDeferredLink(request: CreateDeferredLinkRequest): Promise<DeferredLink> {
    const deferredLink: DeferredLink = {
      id: crypto.randomUUID(),
      fingerprintHash: request.fingerprintHash,
      url: request.url,
      createdDate: new Date(),
    };
    await this.config.methods.storeDeferredLink(deferredLink);
    return deferredLink;
  }

  async getDeferredLinkByFingerprintHash(fingerprintHash: string): Promise<DeferredLink | null> {
    return this.config.methods.getDeferredLinkByFingerprintHash(fingerprintHash);
  }

  async deleteDeferredLink(id: string): Promise<void> {
    return this.config.methods.deleteDeferredLink(id);
  }
}
