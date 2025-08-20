import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Gift, 
  Zap, 
  Star, 
  Shield, 
  Calculator,
  ArrowRight,
  CheckCircle,
  Crown
} from "lucide-react";

const PrivatePartnersProgram = () => {
  const [buyerReferrals, setBuyerReferrals] = useState(5);
  const [sellerReferrals, setSellerReferrals] = useState(2);

  // Commission tiers
  const getCommissionRate = (referrals: number) => {
    if (referrals >= 10) return 15;
    if (referrals >= 5) return 12;
    return 10;
  };

  // Calculate earnings based on plan and tier
  const calculateEarnings = (planPrice: number, referrals: number) => {
    const rate = getCommissionRate(referrals);
    return Math.round((planPrice * rate) / 100);
  };

  const plans = [
    { name: "3-Month Plan", price: 600, period: "every 3 months" },
    { name: "6-Month Plan", price: 1080, period: "every 6 months" },
    { name: "12-Month Plan", price: 1920, period: "every year" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13293D] via-[#16324F] to-[#0EA4E9]">
      {/* Logo Header */}
      <div className="pt-8 pb-4 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/5678c900-f5a3-4336-93da-062cb1e759c4.png" 
              alt="AI Exchange Club Logo" 
              className="h-16 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white border-0 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            Invite-Only Partner Program
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 exo-2-heading">
            Monetize Your Network with the
            <span className="bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent block">
              World's First DFaaS Partner Program
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Earn from recurring buyer subscriptions + one-time seller listings. 
            Two income streams, one invite-only AI SaaS marketplace partner program.
          </p>
          
          <Button 
            size="xl" 
            className="bg-[#D946EE] hover:bg-[#c935dd] text-white shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300"
          >
            Apply Now - Limited Spots Available
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Unique Link",
                description: "Get your personalized referral link and start sharing with your network of AI SaaS buyers and sellers.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: "2", 
                title: "Earn Recurring Commissions",
                description: "Earn 10-15% recurring commissions on every buyer subscription that renews automatically.",
                icon: <TrendingUp className="w-8 h-8" />
              },
              {
                step: "3",
                title: "Split Listing Fees 50/50",
                description: "Get immediate 50% of listing fees when sellers list their AI SaaS through your referral.",
                icon: <DollarSign className="w-8 h-8" />
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-[#D946EE] rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-[#D946EE]">{item.step}</div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-center">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Referral Commissions */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            Commission Tiers & Earnings
            <span className="block text-lg font-normal text-white/70 mt-2">Unlock Higher Commissions as You Grow</span>
          </h2>

          {/* Performance Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { tier: "Base", referrals: "1-4", rate: "10%", color: "bg-white/10", desc: "Start earning immediately" },
              { tier: "Tier 1", referrals: "5-9", rate: "12%", color: "bg-[#8B5CF6]", desc: "Unlock higher rewards" },
              { tier: "Tier 2", referrals: "10+", rate: "15%", color: "bg-[#D946EE]", desc: "Maximum earning potential" }
            ].map((tier, index) => (
              <Card key={index} className={`${tier.color} text-white border-0 transform hover:scale-105 transition-all duration-300`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.tier}</CardTitle>
                  <p className="text-white/90">{tier.referrals} active referrals</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold mb-2">{tier.rate}</div>
                  <p className="text-white/90 mb-2">Recurring Commission</p>
                  <p className="text-sm text-white/70">{tier.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Proof */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Trusted by AI Investment Partners</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <p className="text-white/80 mb-4">"This DFaaS partner program is unlike anything else in the AI space — the recurring revenue is a game-changer for my investment advisory practice."</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#D946EE] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">JS</span>
                    </div>
                    <div>
                      <p className="font-semibold">John Smith</p>
                      <p className="text-white/60 text-sm">AI Investment Advisor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <p className="text-white/80 mb-4">"Finally, an affiliate program that treats partners like actual business partners. The seller fee splits are incredible bonus income."</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#0EA4E9] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">MR</span>
                    </div>
                    <div>
                      <p className="font-semibold">Maria Rodriguez</p>
                      <p className="text-white/60 text-sm">SaaS Broker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-[#D946EE]">200+</div>
                  <p className="text-white/70">Active Buyers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#8B5CF6]">150+</div>
                  <p className="text-white/70">SaaS Listings</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0EA4E9]">$2M+</div>
                  <p className="text-white/70">Partner Payouts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Earnings Examples */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-center text-xl">{plan.name}</CardTitle>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#D946EE]">${plan.price}</div>
                    <p className="text-white/70 text-sm">{plan.period}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Base (10%):</span>
                      <span className="font-bold">${calculateEarnings(plan.price, 1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Tier 1 (12%):</span>
                      <span className="font-bold text-[#8B5CF6]">${calculateEarnings(plan.price, 5)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Tier 2 (15%):</span>
                      <span className="font-bold text-[#D946EE]">${calculateEarnings(plan.price, 10)}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs text-white/70 text-center">
                      Recurring {plan.period}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Referral Commissions */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            Seller Referral Commissions
            <span className="block text-lg font-normal text-white/70 mt-2">One-Time 50/50 Fee Splits</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-12 h-12" />
                </div>
                <CardTitle className="text-3xl mb-4">50/50 Split on Listing Fees</CardTitle>
                <p className="text-white/80 text-lg">Stack seller commissions on top of recurring buyer revenue</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-[#D946EE]">Example Scenario</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span>Listing Fee:</span>
                        <span className="font-bold">$500</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-lg">
                        <span>Your Earnings:</span>
                        <span className="font-bold">$250</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span>Our Share:</span>
                        <span className="font-bold">$250</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-[#0EA4E9]">Key Benefits</h3>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span>Immediate payout upon listing</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span>Stackable with buyer commissions</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span>No recurring work required</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span>Perfect for seller networks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Perks */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            Exclusive Partner Perks
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Recurring Revenue Stream",
                description: "Build monthly, compounding income that grows with every referral"
              },
              {
                icon: <Gift className="w-8 h-8" />,
                title: "Listing Bonuses",
                description: "Split listing fees 50/50 with us for immediate earnings"
              },
              {
                icon: <Crown className="w-8 h-8" />,
                title: "Invite-Only Exclusivity",
                description: "Join an elite group of partners with limited access"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "90-Day Cookie Window",
                description: "Get credit long after your referral clicks your link"
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Flexible Payouts",
                description: "Choose PayPal, ACH, or USDC for your commission payments"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Premium Support",
                description: "Dedicated partner success manager and priority support"
              }
            ].map((perk, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] rounded-full flex items-center justify-center mx-auto mb-4">
                    {perk.icon}
                  </div>
                  <CardTitle className="text-lg">{perk.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-center">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Resources */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            Partner Resources & Support
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Star className="w-8 h-8" />,
                title: "Marketing Materials",
                description: "Professionally designed banners, email templates, and landing pages"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Dedicated Support",
                description: "Priority partner success manager for all your questions and needs"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Performance Dashboard",
                description: "Real-time tracking of clicks, conversions, and commission earnings"
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Flexible Payouts",
                description: "Multiple payout options: PayPal, ACH, Wire, or USDC crypto payments"
              }
            ].map((resource, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-white text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#D946EE] rounded-full flex items-center justify-center mx-auto mb-4">
                    {resource.icon}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the recurring commission work?",
                answer: "You earn 10-15% commission every time your referral renews their subscription. This continues for the lifetime of their account, creating true passive income."
              },
              {
                question: "Do I earn on renewals?",
                answer: "Yes! Your commission continues with every renewal payment. If someone stays subscribed for 2 years, you get paid for 2 years."
              },
              {
                question: "What's the payout structure?",
                answer: "Commissions are paid monthly via PayPal, ACH, or USDC. Minimum payout is $100. Seller listing fees are paid immediately upon listing approval."
              },
              {
                question: "How are seller listing fees split?",
                answer: "It's a simple 50/50 split. If a seller pays $500 to list their SaaS, you earn $250 immediately. This is separate from and in addition to any buyer commissions."
              },
              {
                question: "What's the application process?",
                answer: "Submit your application with your network details and experience. We review within 48 hours and approve partners who demonstrate quality deal flow potential."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg text-[#D946EE]">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12 exo-2-heading">
            <Calculator className="w-10 h-10 inline mr-4" />
            Earnings Calculator
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Buyer Calculator */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#D946EE]">Buyer Referrals</CardTitle>
                <p className="text-white/70 text-center">Recurring commission calculator</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/90 mb-2">Number of Active Referrals</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={buyerReferrals}
                      onChange={(e) => setBuyerReferrals(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="text-2xl font-bold text-[#D946EE]">{buyerReferrals}</span>
                      <span className="text-white/70 ml-2">referrals</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <Badge className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] text-white border-0">
                        {getCommissionRate(buyerReferrals)}% Commission Rate
                      </Badge>
                    </div>
                    
                    {plans.map((plan, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-white/80">{plan.name}:</span>
                        <span className="font-bold text-[#D946EE]">
                          ${calculateEarnings(plan.price, buyerReferrals)} {plan.period}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Calculator */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#0EA4E9]">Seller Referrals</CardTitle>
                <p className="text-white/70 text-center">One-time fee split calculator</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/90 mb-2">Number of Listings per Month</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={sellerReferrals}
                      onChange={(e) => setSellerReferrals(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="text-2xl font-bold text-[#0EA4E9]">{sellerReferrals}</span>
                      <span className="text-white/70 ml-2">listings/month</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <Badge className="bg-gradient-to-r from-[#0EA4E9] to-[#8B5CF6] text-white border-0">
                        50% Fee Split
                      </Badge>
                    </div>
                    
                    {[
                      { fee: 500, label: "Standard Listing" },
                      { fee: 1000, label: "Premium Listing" },
                      { fee: 2000, label: "Enterprise Listing" }
                    ].map((listing, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-white/80">{listing.label} (${listing.fee}):</span>
                        <span className="font-bold text-[#0EA4E9]">
                          ${(listing.fee / 2) * sellerReferrals}/month
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] text-white border-0 px-6 py-3 text-lg">
            <Users className="w-5 h-5 mr-2" />
            Limited Spots Available
          </Badge>
          
          <h2 className="text-5xl font-bold text-white mb-6 exo-2-heading">
            Ready to Earn Like a Partner,
            <span className="block bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
              Not Just an Affiliate?
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join an exclusive group of partners earning recurring revenue from high-ticket AI SaaS subscriptions. 
            This isn't your typical affiliate program—this is a revenue partnership.
          </p>
          
          <div className="space-y-4">
            <Button 
              size="xl" 
              className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#c935dd] hover:to-[#7c4def] text-white text-xl px-12 py-4 shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Apply Now - Limited Spots
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            
            <p className="text-white/60 text-sm">
              Applications reviewed within 48 hours • Partners must be approved to ensure quality
            </p>
            
            <p className="text-white/40 text-xs mt-4">
              Terms & Conditions Apply • AI SaaS Affiliate Program • Deal Flow Partnership
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivatePartnersProgram;