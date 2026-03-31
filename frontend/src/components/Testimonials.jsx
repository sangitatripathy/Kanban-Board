import React from "react";
import men1 from "../assets/men1.jpg";
import women1 from "../assets/women1.jpeg";
import women2 from "../assets/women2.jpeg";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  const testimonialData = [
    {
      description:
        "This tool has completely transformed how our team manages projects. The real-time collaboration features are game-changing.",
      name: "Sarah Johnson",
      designation: "Product Manager at TechCorp",
      image: women1,
    },
    {
      description:
        "Simple, intuitive, and powerful. Exactly what we needed to keep our remote team aligned and productive.",
      name: "Michael Chen",
      designation: "Founder at StartupXYZ",
      image: men1,
    },
    {
      description:
        "The drag-and-drop interface is so smooth, and the dark mode is beautiful. Our entire design team loves it!",
      name: "Emily Rodriguez",
      designation: "Design Lead at Creative Co",
      image: women2,
    },
  ];

  return (
    <div className="bg-white w-full p-10">
      <div className="w-full flex flex-col items-center gap-2 mb-20">
        <h1 className="text-4xl font-bold">Loved by Teams Worldwide</h1>
        <p className="text-gray-800 text-xl">
          See what our users have to say about TaskFlow
        </p>
      </div>
      <div className="justify-items-center md:w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {testimonialData.map((testimony, index) => (
          <TestimonialCard
            key={index}
            description={testimony.description}
            name={testimony.name}
            designation={testimony.designation}
            image={testimony.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
