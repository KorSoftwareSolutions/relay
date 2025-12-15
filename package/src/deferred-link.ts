export interface DeferredLink {
  id: string;
  fingerprintHash: string;
  url: string;
  createdDate: Date;
}

export interface DeferredLinkMethods {
  storeDeferredLink: (deferredLink: DeferredLink) => Promise<void>;
  getDeferredLinkByFingerprintHash: (fingerprintHash: string) => Promise<DeferredLink | null>;
}

export interface DeferredLinkingConfig {
  expiryDays?: number;
  autoCleanup?: boolean;
  methods?: DeferredLinkMethods;
}

export interface CreateDeferredLinkRequest {
  fingerprintHash: string;
  url: string;
}

export class DeferredLinkingSdk {
  private config: Required<DeferredLinkingConfig>;

  constructor(config: DeferredLinkingConfig) {
    this.config = {
      expiryDays: config.expiryDays ?? 7,
      autoCleanup: config.autoCleanup ?? true,
      methods: {
        storeDeferredLink: config.methods?.storeDeferredLink || defaultStoreDeferredLink,
        getDeferredLinkByFingerprintHash: config.methods?.getDeferredLinkByFingerprintHash || defaultGetDeferredLinkByFingerprintHash,
      },
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
}

const localStore: Map<string, DeferredLink> = new Map();

const defaultStoreDeferredLink = async (deferredLink: DeferredLink): Promise<void> => {
  localStore.set(deferredLink.fingerprintHash, deferredLink);
};

const defaultGetDeferredLinkByFingerprintHash = async (fingerprintHash: string): Promise<DeferredLink | null> => {
  return localStore.get(fingerprintHash) || null;
};
