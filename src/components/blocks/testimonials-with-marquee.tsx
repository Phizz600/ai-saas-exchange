
import { cn } from "@/lib/utils";

interface Author {
  name: string;
  handle: string;
  avatar: string;
}

interface Testimonial {
  author: Author;
  text: string;
  href?: string;
}

interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-200 sm:mt-4">
            {description}
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg bg-white/10 backdrop-blur-sm p-6 shadow-lg hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-white">
                    {testimonial.author.name}
                  </div>
                  <div className="text-gray-300">{testimonial.author.handle}</div>
                </div>
              </div>
              <p className="text-gray-200">{testimonial.text}</p>
              {testimonial.href && (
                <a
                  href={testimonial.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-purple-300 hover:text-purple-200"
                >
                  View on Twitter →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
