import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLoginService } from "../services/authServices";
import GoogleSignInButton from "../components/GoogleSignInButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
  };

  const handleGoogleSignIn = async (response) => {
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
            Welcome back!
          </h1>
          <p className="text-[18px] text-white text-opacity-90 leading-relaxed">
            Sign in to access your BookMyTest account and manage your test
            bookings.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div
        style={{
          flex: 1,
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px",
          }}
        >
          {/* Logo/Brand */}
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#0A1F44",
                marginBottom: "8px",
              }}
            >
              BookMyTest
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              Sign in to your account
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="my-3">
            <GoogleSignInButton onSuccess={handleGoogleSignIn} text={"signin_with"}/>
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

            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-3 px-4 border-[1.5px] border-[#E5E7EB] rounded-lg text-base text-[#0A1F44] outline-none transition-colors duration-200 focus:border-[#0047AB]"
              />
            </div>

            <div className="flex justify-end mb-6">
              <a
                href="#"
                className="text-sm text-[#0047AB] no-underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-[14px] bg-[#0047AB] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mb-5 hover:bg-[#003A8C] hover:translate-y-[-1px]"
            >
              Sign In
            </button>

            <div className="text-center">
              <span className="text-sm text-[#6B7280]">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-sm text-[#0047AB] no-underline font-semibold"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
