import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Happy family shopping online"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Where <span className="text-primary">Savings</span> Meet{" "}
            <span className="text-secondary">Convenience</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8">
            Connecting metro, semi-urban, and small-town India
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/categories">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Start Shopping
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6"
              onClick={() => {
                document.getElementById("india-reach")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Our Reach
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
