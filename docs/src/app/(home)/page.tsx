import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fd-primary to-fd-primary/60 bg-clip-text text-transparent">
          Privacy-First Deferred Linking
        </h1>
        <p className="text-xl md:text-2xl text-fd-muted-foreground mb-8 max-w-3xl mx-auto">
          Track referrals and attribute users without third-party analytics. Full control over your data, zero external dependencies.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/docs"
            className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/docs/installation"
            className="px-6 py-3 border border-fd-border rounded-lg font-semibold hover:bg-fd-accent transition-colors"
          >
            Installation
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Relay?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Privacy-Focused"
            description="No third-party tracking services. Your data stays on your infrastructure, giving you complete control and compliance."
          />
          <FeatureCard
            title="Flexible Storage"
            description="Bring your own database. Works with JSON files, PostgreSQL, MongoDB, or any storage solution you prefer."
          />
          <FeatureCard
            title="Simple Integration"
            description="Two-phase capture and process flow. Drop in the SDK, add two API calls, and you're done."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="text-fd-primary font-bold mb-2">STEP 1: CAPTURE</div>
            <h3 className="text-xl font-semibold mb-4">Generate Anonymous Fingerprint</h3>
            <p className="text-fd-muted-foreground mb-6">
              When a user visits your referral link, capture their device fingerprint. No personal data collected.
            </p>
            <pre className="bg-fd-secondary p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`const client = new RelayExpoClient({
  serverUrl: 'https://api.example.com'
});

await client.capture({
  referralCode: 'FRIEND123'
});`}</code>
            </pre>
          </div>
          <div>
            <div className="text-fd-primary font-bold mb-2">STEP 2: PROCESS</div>
            <h3 className="text-xl font-semibold mb-4">Match and Attribute</h3>
            <p className="text-fd-muted-foreground mb-6">
              After signup, match the fingerprint to attribute the referral. Reward referrers automatically.
            </p>
            <pre className="bg-fd-secondary p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`const result = await client.process({
  userId: 'user_12345'
});

if (result.referralCode) {
  // Reward the referrer!
  await rewardUser(result.referralCode);
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-20 bg-fd-secondary/30 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">Built For</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <UseCaseCard
            title="Referral Programs"
            description="Track who referred whom without complex analytics. Reward users based on accurate attribution."
          />
          <UseCaseCard
            title="Marketing Attribution"
            description="Measure campaign effectiveness across app installs and sign-ups with privacy-first tracking."
          />
          <UseCaseCard
            title="Deep Linking"
            description="Bridge web-to-app experiences. Preserve context when users transition from browser to native app."
          />
          <UseCaseCard
            title="Growth Analytics"
            description="Understand user acquisition funnels without compromising privacy or relying on third parties."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
          Install Relay in minutes and start tracking referrals with complete privacy control.
        </p>
        <Link
          href="/docs/installation"
          className="inline-block px-8 py-4 bg-fd-primary text-fd-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          View Installation Guide
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border border-fd-border rounded-lg hover:border-fd-primary/50 transition-colors">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-fd-background rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-fd-muted-foreground text-sm">{description}</p>
    </div>
  );
}
