import { Shield, Truck, Award, Headphones } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "100% safe and secure transactions",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Fast delivery to every corner",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Verified products from trusted sellers",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help you",
  },
];

export const TrustBadges = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{badge.title}</h3>
                <p className="text-sm text-text-secondary">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
