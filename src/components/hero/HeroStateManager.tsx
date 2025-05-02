
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "./HeroSection";

const HeroStateManager = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);
  const words = ["SaaS"];
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Removed the interval that was changing the current word index

  const handleListProductClick = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session) {
      navigate("/list-product");
    } else {
      navigate("/auth");
    }
  };

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <HeroSection
      isAuthenticated={isAuthenticated}
      currentWordIndex={currentWordIndex}
      words={words}
      newsletterEmail={newsletterEmail}
      setNewsletterEmail={setNewsletterEmail}
      subscriberCount={subscriberCount}
      setSubscriberCount={setSubscriberCount}
      isSellerOpen={isSellerOpen}
      setIsSellerOpen={setIsSellerOpen}
      isBuyerOpen={isBuyerOpen}
      setIsBuyerOpen={setIsBuyerOpen}
      handleListProductClick={handleListProductClick}
      handleAuthRedirect={handleAuthRedirect}
    />
  );
};

export default HeroStateManager;
