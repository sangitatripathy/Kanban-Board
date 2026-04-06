import React, { useState, useRef } from "react";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import image from "../assets/heroImage.jpg";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const featureRef = useRef(null);
  const testimonialRef = useRef(null);
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    console.log(featureRef);
    console.log(featureRef.current);
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTestimonials = () => {
    testimonialRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="w-full flex justify-between px-10 py-3 border-b border-gray-300">
        <h1 className="font-bold text-xl my-auto">TaskFlow</h1>

        <div className="hidden md:flex gap-5 items-center">
          <p
            onClick={scrollToFeatures}
            className="text-gray-500 font-medium text-sm cursor-pointer"
          >
            Features
          </p>
          <p
            onClick={scrollToTestimonials}
            className="text-gray-500 font-medium text-sm cursor-pointer"
          >
            Testimonials
          </p>
          <p className="text-gray-500 font-medium text-sm">pricing</p>
          <p
            onClick={() => navigate("/login")}
            className="font-medium text-gray-700 cursor-pointer text-sm"
          >
            Login
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer text-sm"
          >
            Get Started
          </button>
        </div>

        <div className="md:hidden">
          {isOpen ?
            <X onClick={() => setOpen(false)} className="cursor-pointer" />
          : <Menu onClick={() => setOpen(true)} className="cursor-pointer" />}
        </div>

        {isOpen && (
          <div className="absolute top-14 left-0 w-full flex flex-col items-center bg-white shadow-md gap-3 py-4 md:hidden">
            <p className="text-gray-500 font-medium">Features</p>
            <p className="text-gray-500 font-medium">Testimonials</p>
            <p className="text-gray-500 font-medium">pricing</p>
            <p
              onClick={() => navigate("/login")}
              className="font-medium text-gray-700 cursor-pointer"
            >
              Login
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
      <div className="h-screen w-full md:w-[90%] grid md:grid-cols-2 px-10 gap-8 mx-auto">
        <div className="flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4">
            Organize Your Work,{" "}
            <span className="text-6xl font-bold bg-linear-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent">
              Amplify Your Team
            </span>
          </h1>
          <div className="mt-4">
            <p className="text-gray-800 text-lg">
              The visual project management tool that helps teams move work
              forward with clarity and confidence.
            </p>
            <div className="my-4 flex gap-5">
              <button className="bg-blue-500 text-white px-4 py-3 rounded-lg cursor-pointer">
                Get Started Free
              </button>
              <button className="bg-gray-300 px-4 py-3 rounded-lg cursor-pointer">
                Watch Demo
              </button>
            </div>
            <p className="text-s text-gray-500">
              No credit card required • Free forever • 14-day trial of premium
              features
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            className="object-cover rounded-3xl shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            src={image}
            alt=""
          />
        </div>
      </div>
      <div ref={featureRef}>
        <Features />
      </div>
      <div ref={testimonialRef}>
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
