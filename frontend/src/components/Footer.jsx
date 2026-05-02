import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-slate-800 px-8 py-8">
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl font-bold">TaskFlow</h1>
          <p className="text-gray-400 text-sm">
            The visual way to organize work and boost productivity.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Product</h2>
          <p className="text-gray-400 text-sm">Features</p>
          <p className="text-gray-400 text-sm">Pricing</p>
          <p className="text-gray-400 text-sm">Security</p>
          <p className="text-gray-400 text-sm">Roadmap</p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Company</h2>
          <p className="text-gray-400 text-sm">About</p>
          <p className="text-gray-400 text-sm">Blog</p>
          <p className="text-gray-400 text-sm">Careers</p>
          <p className="text-gray-400 text-sm">Contact</p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Resources</h2>
          <p className="text-gray-400 text-sm">Documentation</p>
          <p className="text-gray-400 text-sm">Help Center</p>
          <p className="text-gray-400 text-sm">Community</p>
          <p className="text-gray-400 text-sm">API</p>
        </div>
        <hr className="col-span-full border-gray-600 mt-6" />
      </div>
      <p className="text-center text-gray-400 text-xs mt-6">
        © 2026 TaskFlow. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
