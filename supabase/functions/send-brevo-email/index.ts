import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    
    if (!brevoApiKey) {
      throw new Error('Missing Brevo API key')
    }

    // First create/update contact and add to list
    const contactData = {
      email: body.identifiers.email,
      attributes: body.contactProperties || {},
      listIds: [5], // Free Valuation #5 list
    };

    console.log('Creating/updating contact in Brevo:', contactData);

    // Create or update contact and add to list
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(contactData),
    });

    const contactResult = await contactResponse.json();
    console.log('Contact API response:', contactResult);

    if (!contactResponse.ok) {
      throw new Error(`Brevo Contact API error: ${JSON.stringify(contactResult)}`);
    }

    // Then track the event
    if (body.mode === 'track_event_api') {
      const { eventName, identifiers, contactProperties, eventProperties } = body;
      
      if (!eventName || !identifiers) {
        throw new Error('Missing required parameters: eventName and identifiers');
      }

      console.log(`Tracking event via API: ${eventName}`, JSON.stringify(identifiers));
      
      // Track the event
      const eventResponse = await fetch('https://api.brevo.com/v3/events', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          event_name: eventName,
          identifiers: identifiers,
          contact_properties: contactProperties || {},
          event_properties: eventProperties || {}
        }),
      });

      const eventData = await eventResponse.json();
      console.log('Brevo Events API response:', eventData);

      if (!eventResponse.ok) {
        throw new Error(`Brevo Events API error: ${JSON.stringify(eventData)}`);
      }

      // Send transactional email with valuation results
      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          to: [{
            email: identifiers.email,
            name: contactProperties.NAME || 'there'
          }],
          templateId: 2,
          params: {
            name: contactProperties.NAME || 'there',
            company: contactProperties.COMPANY || 'your AI business',
            valuation_low: contactProperties.ESTIMATED_VALUE_LOW,
            valuation_high: contactProperties.ESTIMATED_VALUE_HIGH,
            insights: contactProperties.INSIGHTS,
            recommendations: contactProperties.RECOMMENDATIONS,
            confidence_score: contactProperties.CONFIDENCE_SCORE || 70,
            ai_category: contactProperties.AI_CATEGORY || 'AI Technology',
            user_count: contactProperties.USER_COUNT || 'N/A',
            growth_rate: contactProperties.GROWTH_RATE || 'N/A',
            market_trend: contactProperties.MARKET_TREND || 'N/A',
            metrics: {
              revenue_score: contactProperties.REVENUE_SCORE || 0,
              growth_score: contactProperties.GROWTH_SCORE || 0,
              market_score: contactProperties.MARKET_SCORE || 0,
              user_score: contactProperties.USER_SCORE || 0,
              overall_score: contactProperties.OVERALL_SCORE || 0
            },
            improvement_areas: JSON.parse(contactProperties.IMPROVEMENT_AREAS || '[]'),
            base_metrics: {
              mrr: contactProperties.MRR || 'N/A',
              user_base: contactProperties.USER_COUNT || 'N/A',
              growth: contactProperties.GROWTH_RATE || 'N/A'
            },
            market_analysis: {
              category: contactProperties.AI_CATEGORY || 'AI Technology',
              trend: contactProperties.MARKET_TREND || 'N/A',
              position: getMarketPosition(contactProperties)
            },
            growth_potential: {
              user_analysis: getUserBaseAnalysis(contactProperties.USER_COUNT),
              revenue_trajectory: getRevenueTrajectory(contactProperties.GROWTH_RATE),
              market_opportunity: getMarketOpportunity(contactProperties.MARKET_TREND)
            },
            specific_recommendations: getSpecificRecommendations(contactProperties)
          }
        })
      });

      const emailData = await emailResponse.json();
      console.log('Brevo Email API response:', emailData);

      if (!emailResponse.ok) {
        throw new Error(`Brevo Email API error: ${JSON.stringify(emailData)}`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Contact created, event tracked, and valuation email sent successfully`,
        data: { event: eventData, email: emailData }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid mode or missing parameters');
    }
  } catch (error) {
    console.error('Error processing Brevo request:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions for email content
function getMarketPosition(props: any) {
  const category = props.AI_CATEGORY?.toLowerCase();
  const userCount = parseInt(props.USER_COUNT) || 0;
  const growth = parseInt(props.GROWTH_RATE) || 0;

  if (category === 'nlp' && growth > 50 && userCount > 10000) {
    return 'Market Leader';
  } else if ((category === 'nlp' || category === 'cv') && growth > 30) {
    return 'Strong Competitor';
  } else if (growth > 20) {
    return 'Growing Player';
  }
  return 'Emerging Participant';
}

function getUserBaseAnalysis(userCount: string) {
  const count = parseInt(userCount) || 0;
  if (count > 50000) return "Enterprise-Level User Base";
  if (count > 5000) return "Strong Growth Stage";
  if (count > 500) return "Early Traction";
  return "Early Stage";
}

function getRevenueTrajectory(growthRate: string) {
  const growth = parseInt(growthRate) || 0;
  if (growth > 100) return "Hypergrowth";
  if (growth > 50) return "Rapid Growth";
  if (growth > 20) return "Steady Growth";
  return "Early Stage Growth";
}

function getMarketOpportunity(marketTrend: string) {
  switch (marketTrend?.toLowerCase()) {
    case 'emerging':
      return "High Growth Potential";
    case 'growing':
      return "Strong Market Opportunity";
    case 'stable':
      return "Established Market";
    default:
      return "Challenging Market";
  }
}

function getSpecificRecommendations(props: any) {
  const recommendations = [];
  const category = props.AI_CATEGORY?.toLowerCase();
  const userCount = parseInt(props.USER_COUNT) || 0;
  const growth = parseInt(props.GROWTH_RATE) || 0;
  const marketTrend = props.MARKET_TREND?.toLowerCase();

  // Category-specific recommendations
  if (category === 'nlp') {
    recommendations.push("Focus on specialized NLP models for enterprise clients");
  } else if (category === 'cv') {
    recommendations.push("Target high-value computer vision applications in healthcare and security");
  } else if (category === 'automation') {
    recommendations.push("Develop industry-specific automation solutions");
  }

  // Growth-based recommendations
  if (growth < 20) {
    recommendations.push("Increase marketing efforts and customer acquisition");
  } else if (growth > 100) {
    recommendations.push("Focus on scalability and infrastructure");
  }

  // User base recommendations
  if (userCount < 1000) {
    recommendations.push("Prioritize user acquisition and product-market fit");
  } else if (userCount > 10000) {
    recommendations.push("Optimize for enterprise customers and expand features");
  }

  // Market trend recommendations
  if (marketTrend === 'emerging') {
    recommendations.push("Establish market leadership through innovation");
  } else if (marketTrend === 'declining') {
    recommendations.push("Explore adjacent market opportunities");
  }

  return recommendations;
}
