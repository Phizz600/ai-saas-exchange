
import { motion } from "framer-motion";

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

export function TestimonialsSection({ title, description, testimonials }: TestimonialsSectionProps) {
  return (
    <div className="py-12 bg-white/5 backdrop-blur-sm rounded-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">{description}</p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author.handle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pt-8 sm:inline-block sm:w-full sm:px-4"
              >
                <figure className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <blockquote className="text-sm leading-6 text-gray-200">
                    <p>{testimonial.text}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={testimonial.author.avatar}
                      alt={testimonial.author.name}
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.author.name}</div>
                      {testimonial.href ? (
                        <a
                          href={testimonial.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300"
                        >
                          {testimonial.author.handle}
                        </a>
                      ) : (
                        <div className="text-gray-400">{testimonial.author.handle}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
