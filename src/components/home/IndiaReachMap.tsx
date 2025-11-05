import indiaMap from "@/assets/india-map.png";
import { MapPin } from "lucide-react";

const cities = [
  { name: "Delhi", since: "2019", top: "25%", left: "35%" },
  { name: "Mumbai", since: "2020", top: "45%", left: "20%" },
  { name: "Bangalore", since: "2020", top: "70%", left: "32%" },
  { name: "Jaipur", since: "2021", top: "30%", left: "32%" },
  { name: "Bhopal", since: "2021", top: "42%", left: "35%" },
  { name: "Patna", since: "2022", top: "35%", left: "55%" },
];

export const IndiaReachMap = () => {
  return (
    <section id="india-reach" className="py-20 bg-warm-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Connecting Every Corner of India
        </h2>
        <p className="text-xl text-text-secondary text-center mb-12">
          Active in 120+ cities across metro, tier-2, and tier-3 regions
        </p>

        <div className="relative max-w-4xl mx-auto">
          <img
            src={indiaMap}
            alt="India Map showing ShopEase reach"
            className="w-full h-auto"
          />
          
          {cities.map((city) => (
            <div
              key={city.name}
              className="absolute group cursor-pointer"
              style={{ top: city.top, left: city.left }}
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary fill-primary animate-bounce" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg whitespace-nowrap">
                    <p className="font-semibold">{city.name}</p>
                    <p className="text-sm text-text-secondary">
                      Active Since {city.since}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-text-secondary">
            And we're expanding to more cities every month!
          </p>
        </div>
      </div>
    </section>
  );
};
