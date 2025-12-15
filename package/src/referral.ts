export interface Referral {
  referrerId: string;
  referredId: string;
  code: string;
  source?: string;
  medium?: string;
  campaign?: string;
  metadata?: Record<string, any>;
}

export interface CreateReferralInput {
  referrerId: string;
  email?: string;
  metadata?: Record<string, any>;
  expiresInDays?: number;
}

export interface ReferralHooks {
  onReferralCreated?: (referral: Referral) => Promise<void> | void;
  onReferralCompleted?: (referral: Referral, referredUserId: string) => Promise<void> | void;
  onReferralExpired?: (referral: Referral) => Promise<void> | void;
}

export interface ReferralConfig {
  expiryDays?: number;
  autoCleanup?: boolean;
  codeLength?: number;
  hooks?: ReferralHooks;
}

export interface CreateReferralOptions {
  email?: string;
  metadata?: Record<string, any>;
  expiresInDays?: number;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  expiredReferrals: number;
}

export interface AttributionData {
  source?: string;
  medium?: string;
  campaign?: string;
  metadata?: Record<string, any>;
}

export class Referrals {
  private expiryDays: number;
  private autoCleanup: boolean;
  private hooks: ReferralHooks;

  constructor(config: ReferralConfig) {
    this.expiryDays = config.expiryDays || 365;
    this.autoCleanup = config.autoCleanup ?? true;
    this.hooks = config.hooks || {};
  }
}
