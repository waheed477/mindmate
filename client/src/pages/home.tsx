import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, HeartPulse, Clock } from "lucide-react";
import { Navbar } from "@/components/layout-navbar";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "@assets/stock_images/mental_health_suppor_2eb9fe48.jpg";
import image2 from "@assets/stock_images/mental_health_suppor_e35f5b45.jpg";
import image3 from "@assets/stock_images/mental_health_suppor_c02cab2e.jpg";

const heroImages = [image1, image2, image3];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
              >
                {/* Dark Wash Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-start text-left space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-tight">
                Mental Healthcare <br />
                <span className="text-primary-foreground bg-primary/20 px-4 rounded-lg backdrop-blur-sm">Reimagined</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Connect with specialized doctors, manage appointments, and prioritize your mental well-being with MindMate's secure and compassionate platform.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8 text-lg h-12 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/doctors">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                  Find a Doctor
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Verified Specialists"
              description="Every doctor on our platform is verified and licensed to ensure you receive the highest quality care."
            />
            <FeatureCard 
              icon={<HeartPulse className="h-10 w-10 text-primary" />}
              title="Personalized Care"
              description="Find specialists that match your specific needs, conditions, and preferences for a tailored experience."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Flexible Scheduling"
              description="Book online or in-person appointments at times that work for you, with easy rescheduling options."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="bg-primary rounded-3xl p-8 md:p-12 lg:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/25">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Ready to prioritize your mental health?</h2>
              <p className="text-primary-foreground/80 text-lg">Join thousands of patients who have found support and healing through MindMate.</p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="rounded-full px-8 text-lg h-12 font-semibold text-primary hover:bg-white">
                  Join Now - It's Free
                </Button>
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}


