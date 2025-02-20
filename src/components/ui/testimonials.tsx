
"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface Testimonial {
  image: string
  text: string
  name: string
  username: string
  social: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
}

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-1">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-4">
                <div className="flex flex-col rounded-lg border bg-[#EEF7FF] p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      alt={`${testimonial.name}'s profile picture`}
                      className="h-12 w-12 rounded-full object-cover"
                      src={testimonial.image}
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#13293D]">{testimonial.name}</div>
                      <div className="text-sm text-[#2A628F]">
                        {testimonial.username}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-grow text-sm text-[#2A628F]">
                    "{testimonial.text}"
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </div>
  )
}
