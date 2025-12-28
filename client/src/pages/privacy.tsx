import { Navbar } from "@/components/layout-navbar";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including name, email address, medical history, and consultation notes when you register for an account or book an appointment.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to facilitate mental health consultations, manage appointments, and improve our services. Your medical data is handled with strict confidentiality.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">3. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect the security of your personal and medical information against unauthorized access or disclosure.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">4. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@mindmate.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
