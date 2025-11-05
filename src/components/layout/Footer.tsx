import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About ShopEase</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Bringing savings and convenience to every corner of India. From metro cities to small towns, we're here for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="text-text-secondary hover:text-primary transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-text-secondary hover:text-primary transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-text-secondary hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Electronics</li>
              <li className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Fashion</li>
              <li className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Home & Living</li>
              <li className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Grocery</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
          <p>© 2024 ShopEase. Empowering India's shopping journey.</p>
        </div>
      </div>
    </footer>
  );
};
