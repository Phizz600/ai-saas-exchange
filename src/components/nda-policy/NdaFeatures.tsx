
import { Card } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Eye, UserCheck, AlertTriangle } from "lucide-react";

export const NdaFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 border-t-4 border-t-[#D946EE] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#D946EE]/10 p-3 rounded-full">
            <Shield className="h-6 w-6 text-[#D946EE]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">IP Address Tracking</h3>
            <p className="text-gray-700">
              Every NDA signature is recorded with the signer's IP address, providing an additional layer 
              of accountability and traceability.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-[#8B5CF6] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#8B5CF6]/10 p-3 rounded-full">
            <Lock className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Digital Signatures</h3>
            <p className="text-gray-700">
              Our system uses secure digital signatures that are timestamped and legally binding in most jurisdictions.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-[#0EA4E9] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#0EA4E9]/10 p-3 rounded-full">
            <FileCheck className="h-6 w-6 text-[#0EA4E9]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Legal Enforceability</h3>
            <p className="text-gray-700">
              Our NDAs are drafted by technology law specialists to ensure they are legally enforceable 
              and provide meaningful protection.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-[#D946EE] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#D946EE]/10 p-3 rounded-full">
            <Eye className="h-6 w-6 text-[#D946EE]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Access Controls</h3>
            <p className="text-gray-700">
              Confidential information is only revealed after an NDA is signed, with clear visual indicators 
              showing protected content.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-[#8B5CF6] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#8B5CF6]/10 p-3 rounded-full">
            <UserCheck className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Device Fingerprinting</h3>
            <p className="text-gray-700">
              We capture device information at the time of signature for additional verification and security measures.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-[#0EA4E9] bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#0EA4E9]/10 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-[#0EA4E9]" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Copy Protection</h3>
            <p className="text-gray-700">
              Our platform includes technical measures to prevent unauthorized copying, printing, and sharing of confidential content.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
