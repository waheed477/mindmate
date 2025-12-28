import { Navbar } from "@/components/layout-navbar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using MindMate, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">2. Medical Disclaimer</h2>
            <p className="text-muted-foreground">
              MindMate is a platform connecting patients with providers. We do not provide medical advice directly. In case of emergency, please contact your local emergency services immediately.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users are responsible for providing accurate information and maintaining the confidentiality of their account credentials.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">4. Appointment Cancellations</h2>
            <p className="text-muted-foreground">
              Cancellations must be made at least 24 hours in advance. Late cancellations may be subject to a fee as determined by the specific healthcare provider.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
