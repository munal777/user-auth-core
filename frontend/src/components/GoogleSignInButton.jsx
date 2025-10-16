import { useEffect, useRef, useState } from "react";
import { GoogleLoginService } from "../services/authServices";

import { CLIENT_ID } from "../config/api";

export default function GoogleSignIn() {
  const googleSignInDiv = useRef(null);

  // const handleCallbackResponse = async (response) => {

  //   try {
  //     const res = await GoogleLoginService(response.credential);


  //     if (!res.data.IsSuccess) {
  //       throw new Error("Login failed. Please try again.");
  //     }

  //     setSuccess("Login successful! Tokens received:");

  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setError("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            CLIENT_ID.GOOGLE,
          callback: onSuccess,
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
        <div ref={googleSignInDiv}/>
  );
}