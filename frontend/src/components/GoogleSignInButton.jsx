import { useEffect, useRef, useState } from "react";

import { CLIENT_ID } from "../config/api";

export default function GoogleSignInButton({ onSuccess, text }) {
  const googleSignInDiv = useRef(null);

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID.GOOGLE,
        callback: onSuccess,
      });

      window.google.accounts.id.renderButton(googleSignInDiv.current, {
        theme: "outline",
        size: "large",
        text: text,
        shape: "rectangular",
      });
    }
  }, []);

  return (
    <div ref={googleSignInDiv} />
  );
}
