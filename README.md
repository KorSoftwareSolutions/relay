<div align="center">
  <img src="banner.svg" alt="Relay" width="300" />

  <h1>Relay</h1>

  <p><strong>Privacy-first deferred linking and referral attribution for React Native and Expo</strong></p>

  <p>
    <a href="https://korsoftwaresolutions.github.io/relay/docs">Documentation</a> "
    <a href="https://korsoftwaresolutions.github.io/relay/docs/installation">Quick Start</a> "
    <a href="https://github.com/KorSoftwareSolutions/relay/tree/main/examples">Examples</a>
  </p>
 
</div>

---

## About

Relay is a **privacy-focused deferred linking solution** that helps you track referrals and attribute users without relying on third-party analytics services. Built for React Native and Expo applications, it gives you complete control over your user attribution data.

**The Problem:** Traditional referral tracking requires complex analytics SDKs, sends data to third parties, and often violates user privacy. Cookie-based solutions don't work in mobile apps, and deep links alone can't bridge the gap between initial visit and user signup.

**The Solution:** Relay uses device fingerprinting to create a privacy-preserving bridge between when a user first visits your app (via a referral link) and when they complete signup. All data stays on your infrastructure, giving you full compliance control and zero external dependencies.

## Why Relay?

### Privacy-First

No third-party tracking services. Your user data stays on your infrastructure. Full GDPR/CCPA compliance control.

### Bring Your Own Database
Works with any storage solution: JSON files, PostgreSQL, MongoDB, Redis, or your custom database. You control where and how data is stored.

### Simple Integration

Two-phase flow: capture fingerprints on referral visit, process attribution on signup. Just two API calls to implement.

### Flexible Attribution
Track referrals, measure marketing campaigns, implement deep linking, or build custom attribution logic with hooks.

### Zero External Dependencies

No analytics SDKs, no tracking pixels, no external services. Just your app and your server.

## Quick Start

### Installation

```bash
# Using npm
npm install @korsolutions/relay

# Using pnpm
pnpm add @korsolutions/relay

# Using yarn
yarn add @korsolutions/relay
```

### Client Setup

```typescript
import { RelayExpoClient } from "@korsolutions/relay";

const client = new RelayExpoClient({
  serverUrl: "https://api.yourdomain.com",
});

// Capture fingerprint when user visits referral link
await client.capture({
  referralCode: "FRIEND123",
});

// Process attribution after user signs up
const result = await client.process({
  userId: "user_12345",
});

if (result.referralCode) {
  // Reward the referrer!
  console.log(`Referred by: ${result.referralCode}`);
}
```

### Server Setup

```typescript
import { createRelayServer } from "@korsolutions/relay/server";

const relay = createRelayServer({
  fingerprint: {
    methods: {
      storeFingerprint: async (fingerprint, hash) => {
        // Save to your database
        return await db.fingerprints.create({ fingerprint, hash });
      },
      getFingerprintByHash: async (hash) => {
        // Retrieve from your database
        return await db.fingerprints.findOne({ hash });
      },
    },
  },
  deferredLink: {
    methods: {
      storeDeferredLink: async (link) => {
        await db.deferredLinks.create(link);
      },
      getDeferredLinkByFingerprintHash: async (hash) => {
        return await db.deferredLinks.findOne({ fingerprintHash: hash });
      },
      deleteDeferredLink: async (id) => {
        await db.deferredLinks.delete(id);
      },
    },
  },
  hooks: {
    onMatchFound: async (deferredLink, authCtx) => {
      // React to successful matches with access to authenticated user
      if (authCtx?.userId) {
        // Award referral points, send notifications, etc.
        await rewardReferral(authCtx.userId, deferredLink);
      }
    },
  },
});

// Handler with auth context
app.post("/api/relay/*", async (req, res) => {
  const user = await getUserFromSession(req);
  const request = new Request(req.url, {
    method: req.method,
    body: JSON.stringify(req.body),
  });

  const response = await relay.handler(request, {
    userId: user?.id ?? null,
  });

  res.status(response.status).json(await response.json());
});
```

## How It Works

Relay uses a two-phase attribution flow:

### Phase 1: Capture

When a user clicks a referral link and opens your app:

1. Generate anonymous device fingerprint (locale, timezone, device info)
2. Send fingerprint + referral data to your server
3. Store the association in your database

### Phase 2: Process

When the user completes signup:

1. Generate the same fingerprint
2. Match against stored fingerprints
3. Attribute the referral and trigger rewards

**Privacy Note:** Fingerprints use non-personal device characteristics (locale, timezone, screen dimensions). No PII is collected.

## Use Cases

- **Referral Programs** - Track who referred whom, reward users accurately
- **Marketing Attribution** - Measure campaign effectiveness across web-to-app transitions
- **Deep Linking** - Preserve context when users move from browser to native app
- **Growth Analytics** - Understand acquisition funnels without third-party tracking

## Features

- **Device Fingerprinting** - Anonymous, privacy-preserving identification
- **Authentication Context** - Pass user information to hooks for immediate referral attribution
- **Flexible Storage** - Bring your own database or use built-in adapters
- **Server Hooks** - Customize behavior at capture and process stages with access to authenticated user data
- **Type Safety** - Full TypeScript support with Zod validation
- **Expo Compatible** - Built specifically for Expo and React Native
- **Self-Hosted** - Complete control over your infrastructure
- **Zero Dependencies** - No external services or tracking SDKs

## Documentation

Visit [korsoftwaresolutions.github.io/relay](https://korsoftwaresolutions.github.io/relay) for full documentation:

- [Installation Guide](https://korsoftwaresolutions.github.io/relay/docs/installation)
- [Client API Reference](https://korsoftwaresolutions.github.io/relay/docs/client)
- [Server API Reference](https://korsoftwaresolutions.github.io/relay/docs/server)
- [Complete API Documentation](https://korsoftwaresolutions.github.io/relay/docs/api-reference)

## Examples

Check out the [examples directory](./examples) for complete implementations:

- **Expo Example** - Full referral flow with capture and process screens
- **Server Examples** - JSON storage, PostgreSQL, and MongoDB implementations

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

## Security

If you discover a security vulnerability, please email contact@korsolutions.net. Do not open public issues for security concerns.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Relay is built and maintained by [Kor Solutions](https://github.com/KorSoftwareSolutions).
