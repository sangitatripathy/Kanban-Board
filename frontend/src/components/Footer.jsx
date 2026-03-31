import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-slate-800 px-10 py-15">
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl font-bold">TaskFlow</h1>
          <p className="text-gray-400">
            The visual way to organize work and boost productivity.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Product</h2>
          <p className="text-gray-400">Features</p>
          <p className="text-gray-400">Pricing</p>
          <p className="text-gray-400">Security</p>
          <p className="text-gray-400">Roadmap</p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Company</h2>
          <p className="text-gray-400">About</p>
          <p className="text-gray-400">Blog</p>
          <p className="text-gray-400">Careers</p>
          <p className="text-gray-400">Contact</p>
        </div>
        <div className="flex flex-col gap-2 text-white">
          <h2 className="text-lg font-semibold">Resources</h2>
          <p className="text-gray-400">Documentation</p>
          <p className="text-gray-400">Help Center</p>
          <p className="text-gray-400">Community</p>
          <p className="text-gray-400">API</p>
        </div>
        <hr className="col-span-full border-gray-600 mt-6" />
      </div>
      <p className="text-center text-gray-400 text-sm mt-10">
        © 2026 TaskFlow. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
