
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import ProductPageContent from "@/components/product/ProductPage";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no product ID is provided
    if (!productId) {
      navigate('/onboarding-redirect');
    }
  }, [productId, navigate]);

  return (
    <>
      <Header />
      <ProductPageContent />
    </>
  );
}
