import React from "react";
import FeatureCard from "./FeatureCard";
import {
  Users,
  Zap,
  Shield,
  ChartColumnBig,
  Bell,
  CircleCheckBig,
} from "lucide-react";

const Features = () => {
  const featuresData = [
    {
      icon: <Users className="text-blue-600" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates and shared boards.",
    },
    {
      icon: <Zap className="text-blue-600" />,
      title: "Lightning Fast",
      description:
        "Drag and drop interface with instant updates and smooth animations.",
    },
    {
      icon: <Shield className="text-blue-600" />,
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected with enterprise-grade security.",
    },
    {
      icon: <ChartColumnBig className="text-blue-600" />,
      title: "Analytics & Insights",
      description:
        "Track progress and productivity with detailed reports and metrics.",
    },
    {
      icon: <Bell className="text-blue-600" />,
      title: "Smart Notifications",
      description:
        "Stay informed with customizable notifications and @mentions.",
    },
    {
      icon: <CircleCheckBig className="text-blue-600" />,
      title: "Task Management",
      description:
        "Organize tasks with labels, due dates, and powerful filters.",
    },
  ];

  return (
    <div className="w-full sm:px-10 md:px-0 py-10 mx-auto bg-gray-100/50">
      <div className="flex items-center flex-col gap-3 mb-10">
        <h1 className="text-4xl font-bold">Everything You Need to Succeed</h1>
        <p className="text-gray-800 text-2xl">
          Powerful features to help teams collaborate and deliver projects on
          time
        </p>
      </div>
      <div className='md:w-[90%] px-10 grid md:grid-cols-3 gap-4 mx-auto'>
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
