import { Link } from "react-router-dom";

export const MarketplaceFooter = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <img 
              src="/lovable-uploads/c2d95fc3-b2b8-41f4-bee8-877a1d72cf6c.png"
              alt="AI Exchange Club"
              className="h-16 w-auto mb-6"
            />
            <p className="text-gray-600">
              Your premier destination for AI product trading and innovation.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-gray-800">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-gray-800">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-gray-800">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-800">Blog</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-800">FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-800">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-gray-800">Follow Us</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-gray-600 hover:text-gray-800">Facebook</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-gray-800">Twitter</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-gray-800">Instagram</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
