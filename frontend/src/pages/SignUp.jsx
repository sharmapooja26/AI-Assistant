import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] max-w-[400px] bg-[#f9f9f9] border border-[#ddd] rounded-3xl shadow-lg p-10 flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[#222] text-3xl font-bold">Create Account</h1>
          <p className="text-blue-500 text-center text-md">
            Register to <span className="font-semibold">Virtual Assistant</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#333] text-md">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full h-[50px] rounded-xl px-4 text-lg text-black outline-none border border-[#ccc]"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#333] text-md">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full h-[50px] rounded-xl px-4 text-lg text-black outline-none border border-[#ccc]"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-[#333] text-md">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="w-full h-[50px] rounded-xl px-4 text-lg text-black outline-none border border-[#ccc]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <IoEye
              className="absolute right-4 top-10 text-gray-500 cursor-pointer text-2xl"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoEyeOff
              className="absolute right-4 top-10 text-gray-500 cursor-pointer text-2xl"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err.length > 0 && (
          <p className="text-red-500 text-sm text-center">* {err}</p>
        )}

        <button
          className="w-full h-[50px] bg-gradient-to-r  bg-black rounded-xl text-white font-semibold text-lg shadow-md hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-center text-[#333] mt-2 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
