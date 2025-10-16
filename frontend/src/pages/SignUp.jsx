import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLoginService } from "../services/authServices";
import GoogleSignInButton from "../components/GoogleSignInButton";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Handle sign up logic here
    console.log("Sign up with:", formData);
  };

  const handleGoogleSignUp = async (response) => {
    setLoading(true);
    setError("");

    try {
      const res = await GoogleLoginService(response.credential);

      if (!res.data.IsSuccess) {
        throw new Error("Login failed. Please try again.");
      }

      setSuccess("Login successful! Tokens received:");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-system">
      {/* Left Side - Decorative */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0047AB] to-[#1C75BC] relative flex-col justify-center items-center p-[60px] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-[10%] left-[10%] w-[100px] h-[100px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)] border-opacity-20" />
        <div className="absolute top-[20%] right-[15%] w-[6px] h-[60px] bg-[rgba(255,255,255,0.3)] bg-opacity-30 rounded-[3px]" />
        <div className="absolute bottom-[15%] left-[15%] w-[80px] h-[80px] border-[2px] border-[rgba(255,255,255,0.15)] border-opacity-15 rotate-45" />

        {/* Wavy decorative lines */}
        <svg
          className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] opacity-30"
          viewBox="0 0 200 200"
        >
          <path
            d="M 20 100 Q 60 80, 100 100 T 180 100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 20 120 Q 60 100, 100 120 T 180 120"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 20 140 Q 60 120, 100 140 T 180 140"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center max-w-[400px]">
          <h1 className="text-[48px] font-bold text-white mb-5 tracking-tight">
            Join BookMyTest
          </h1>
          <p className="text-[18px] text-white text-opacity-90 leading-relaxed">
            Create your account and start booking your IELTS, TOEFL, PTE, GRE,
            and other test vouchers today.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex justify-center items-center p-10 overflow-y-auto">
        <div className="w-full max-w-[420px] p-10 pt-10">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <h2 className="text-[32px] font-bold text-[#0A1F44] mb-2">
              BookMyTest
            </h2>
            <p className="text-sm text-[#6B7280]">Create your account</p>
          </div>

          {/* Google Sign Up Button */}
          <div className="my-3">
            <GoogleSignInButton onSuccess={handleGoogleSignUp} text={"signup_with"}/>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6 gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-sm text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg text-[#991B1B] text-sm mb-5">
                {error}
              </div>
            )}

            {/* Name Fields Row */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-[14px] bg-[#0047AB] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mb-5 hover:bg-[#003A8C] hover:translate-y-[-1px]"
            >
              Create Account
            </button>

            <div className="text-center">
              <span className="text-sm text-[#6B7280]">
                Already have an account?{" "}
              </span>
              <Link
                to="/signin"
                className="text-sm text-[#0047AB] no-underline font-semibold"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
