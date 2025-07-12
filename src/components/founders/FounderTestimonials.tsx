
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export const FounderTestimonials = () => {
  const testimonials = [
    {
      quote: "It felt like I had a team without hiring one. The buyer network was solid, and the support was fast.",
      author: "James",
      role: "exited AI founder"
    },
    {
      quote: "I was hesitant to list, but this was low-lift and high-leverage. I wish I'd done it sooner.",
      author: "Rachel",
      role: "solo SaaS builder"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <span className="text-2xl mb-4 block">💬</span>
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-gray-900">
            What Founders Say
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <Quote className="h-8 w-8 text-[#8B5CF6] mb-4" />
              <blockquote className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
