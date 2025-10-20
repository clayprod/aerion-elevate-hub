import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const MobileFloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls past hero section (100vh)
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Show when scrolled past hero section
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show for non-logged in users on mobile
  if (user || window.innerWidth >= 768) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Button
        asChild
        className="w-full bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold shadow-lg"
      >
        <Link to="/contato">
          Quero ser um Revendedor
        </Link>
      </Button>
    </div>
  );
};

export default MobileFloatingCTA;
