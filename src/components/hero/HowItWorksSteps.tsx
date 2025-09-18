const HowItWorksSteps = () => {
  return <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-0 py-0 mx-0">
        <div style={{
        animationDelay: '0.1s'
      }} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-fade-in-up px-[23px] my-[24px]">
          <div className="text-2xl font-bold text-white mb-2">1</div>
          <h3 className="text-xl font-semibold text-white mb-3">List Your AI SaaS (Free)</h3>
          <p className="text-gray-300">Submit basic info about your AI SaaS business via our listing form.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-fade-in-up" style={{
        animationDelay: '0.2s'
      }}>
          <div className="text-2xl font-bold text-white mb-2">2</div>
          <h3 className="text-xl font-semibold text-white mb-3">We Curate & Share</h3>
          <p className="text-gray-300">We share your listing with our vetted buyer community via our private network.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-fade-in-up" style={{
        animationDelay: '0.3s'
      }}>
          <div className="text-2xl font-bold text-white mb-2">3</div>
          <h3 className="text-xl font-semibold text-white mb-3">Connect Directly</h3>
          <p className="text-gray-300">Interested buyers contact you directly to negotiate and complete the deal on their own terms.</p>
        </div>
      </div>
    </div>;
};
export default HowItWorksSteps;