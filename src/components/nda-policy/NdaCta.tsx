
import { Button } from "@/components/ui/button";

export const NdaCta = () => {
  return (
    <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] p-8 md:p-12 rounded-xl shadow-lg text-white backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="exo-2-heading text-2xl md:text-3xl font-bold mb-4">Ready to List Your AI Product?</h2>
          <p className="text-white/90 max-w-xl">
            List your AI business with confidence, knowing that your confidential information is protected by our 
            comprehensive NDA system.
          </p>
        </div>
        <a href="https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form" target="_blank" rel="noopener noreferrer">
          <Button className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-6 text-lg shadow-md transition-all duration-300 hover:shadow-lg">
            List Your AI Business
          </Button>
        </a>
      </div>
    </div>
  );
};
