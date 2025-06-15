import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="bg-black text-white font-semibold w-full">
        <ul className="flex space-x-4 p-4 justify-evenly max-w-5xl mx-auto">
            <li>Home</li>
            <li>Profile</li>
            <li>Login</li>
        </ul>
      </nav>
    </>
  );
}
