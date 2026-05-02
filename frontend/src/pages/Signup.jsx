import React, { useState } from "react";
import { UserRound, Mail, Lock, ArrowLeft, Upload, Trash } from "lucide-react";
import Input from "../components/Input";
import { useNavigate, Link } from "react-router-dom";
import { postRequest } from "../lib/axios";
import { useUser } from "../context/userContext";

const Signup = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const createAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (image) {
        data.append("image", image);
      }
      const res = await postRequest("/auth/register", data);
      login(res);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-4 bg-gray-50">
      <div className="w-full max-w-md mb-2">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70 group"
        >
          <ArrowLeft size={18} className="text-gray-500 group-hover:-translate-x-1 transition-transform" />
          <p className="font-medium text-gray-700 text-xs md:text-sm">Back to home</p>
        </div>
      </div>

      <form 
        onSubmit={createAccount}
        className="w-full max-w-md px-6 py-4 shadow-xl rounded-2xl bg-white flex flex-col"
      >
        <div className="text-center md:text-left mb-2">
          <h1 className="text-xl font-medium mb-2">Create account</h1>
          <p className="text-sm text-gray-600 font-normal mb-3">Start organizing your work today</p>
        </div>

        <div className="flex justify-center mb-2">
          <div className="relative w-16 h-16 md:w-20 md:h-20 group">
            {preview ? (
              <img src={preview} className="h-full w-full rounded-full object-cover border shadow-sm" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 flex justify-center items-center border-2 border-dashed border-gray-200">
                <UserRound size={28} className="text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md">
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }} 
              />
              {preview ? <Trash size={14} onClick={() => {setPreview(null); setImage(null)}}/> : <Upload size={14} />}
            </label>
          </div>
        </div>
        <div className="[&_div]:w-full [&_div]:sm:w-auto">
          <div className="flex flex-col">
            <div className="-my-3">
               <Input label="Full Name" name="name" placeholder="John Doe" onChange={handleChange} value={formData.name} icon={UserRound} />
            </div>
            <div className="-my-3">
               <Input label="Email" type="email" name="email" placeholder="you@example.com" onChange={handleChange} value={formData.email} icon={Mail} />
            </div>

            <div className="grid grid-cols-2 gap-3 -mt-3">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.password}
                icon={Lock}
              />
              <Input
                label="Confirm"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.confirmPassword}
                icon={Lock}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-md px-4 py-2 rounded-md mt-2 flex items-center justify-center gap-2 
            ${loading 
              ? "bg-blue-400 cursor-not-allowed text-white" 
              : "bg-blue-500 hover:bg-blue-600 text-white"}
          `}
        >
          {loading ?
            <>
              <span className="w-4 h-4 border-2 text-white border-white border-t-transparent rounded-full animate-spin"></span>
              Creating account...
            </>
          : "Create Account"}
        </button>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline text-sm text-blue-500 cursor-pointer ml-1">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;