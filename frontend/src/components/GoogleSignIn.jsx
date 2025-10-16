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
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            CLIENT_ID.GOOGLE_CLIENT_ID,
          callback: handleCallbackResponse,
        });

        window.google.accounts.id.renderButton(googleSignInDiv.current, {
          theme: "outline",
          size: "large",
          text: "sign_in_with",
          shape: "rectangular",
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
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

// import { useEffect, useRef, useState } from 'react';

// export default function GoogleSignIn() {
//   const googleSignInDiv = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [tokenData, setTokenData] = useState(null);

//   const API = 'http://127.0.0.1:8000/api';

//   const handleCallbackResponse = async (response) => {
//     console.log('Response received:', response);

//     setLoading(true);
//     setError('');
//     setSuccess('');
//     setTokenData(null);

//     const formData = new FormData();
//     formData.append('token', response.credential);

//     try {
//       const res = await fetch(`${API}/google_login/`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error('Login failed. Please try again.');
//       }

//       const data = await res.json();
//       console.log('Login successful:', data);

//       setSuccess('Login successful! Tokens received:');
//       setTokenData(data);
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://accounts.google.com/gsi/client';
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);

//     script.onload = () => {
//       if (window.google && window.google.accounts) {
//         window.google.accounts.id.initialize({
//           client_id:
//             '1060715510362-a41qqebj83vdrlver378ef0q6ppfvom6.apps.googleusercontent.com',
//           callback: handleCallbackResponse,
//         });

//         window.google.accounts.id.renderButton(googleSignInDiv.current, {
//           theme: 'outline',
//           size: 'large',
//           text: 'sign_in_with',
//           shape: 'rectangular',
//         });
//       }
//     };

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
//         <h2 className="text-2xl font-bold text-white">Welcome</h2>
//         <p className="text-gray-300 mt-2">Sign in to your account</p>

//         <div ref={googleSignInDiv} className="flex justify-center mt-4" />

//         {loading && <div className="mt-4 text-sm text-gray-400">Signing in…</div>}

//         {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

//         {success && (
//           <div className="mt-4 text-sm text-green-500">{success}</div>
//         )}

//         {tokenData && (
//           <div className="bg-gray-700 p-4 rounded text-left mt-4 max-h-64 overflow-auto">
//             <div className="font-mono text-xs text-gray-200">
//               <strong>Access Token:</strong>
//               <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
//                 {tokenData.Result?.access || 'Not found'}
//               </pre>
//               <strong className="block mt-4">Full Response:</strong>
//               <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
//                 {JSON.stringify(tokenData, null, 2)}
//               </pre>
//             </div>
//           </div>
//         )}

//         <p className="text-xs text-gray-400 mt-8">
//           By signing in, you agree to our{' '}
//           <a href="#" className="text-blue-400 hover:text-blue-300">
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a href="#" className="text-blue-400 hover:text-blue-300">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }
