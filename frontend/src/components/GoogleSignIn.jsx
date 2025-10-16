import { useEffect, useRef, useState } from "react";
import { GoogleLoginService } from "../services/authServices";

import { CLIENT_ID } from "../config/api";

export default function GoogleSignIn() {
  const googleSignInDiv = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCallbackResponse = async (response) => {

    setLoading(true);
    setError("");
    setSuccess("");

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

  useEffect(() => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            CLIENT_ID.GOOGLE,
          callback: handleCallbackResponse,
        });

        window.google.accounts.id.renderButton(googleSignInDiv.current, {
          theme: "outline",
          size: "large",
          text: "sign_in_with",
          shape: "rectangular",
        });
      }
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white">Welcome</h2>
        <p className="text-gray-300 mt-2">Sign in to your account</p>

        <div ref={googleSignInDiv} className="flex justify-center mt-4" />

        {loading && (
          <div className="mt-4 text-sm text-gray-400">Signing in…</div>
        )}

        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

        {success && (
          <div className="mt-4 text-sm text-green-500">{success}</div>
        )}
      </div>
    </div>
  );
}