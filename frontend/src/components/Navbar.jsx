import React from "react";
import { useState } from "react";
import { X, Menu } from "lucide-react";

export default function Navbar() {
  const [menu, setOpenMenu] = useState(true);

  return (
    <>
      <nav className="flex justify-between bg-black text-white font-semibold md:p-4 p-3.5">
        <div className="md:mx-12">
          <p>Project</p>
        </div>

        <div className="hidden md:flex md:space-x-8">
          <p>Home</p>
          <p>Dashboard</p>
          <p>Login</p>
        </div>

        <div className="md:hidden" onClick={() => setOpenMenu(!menu)}>
          {menu ? <Menu /> : <X />}
        </div>
      </nav>

      {!menu && (
          <div className="bg-black text-white font-semibold w-1/2">
            <div className="flex flex-col space-y-2 py-6">
              <p>Home</p>
              <p>Dashboard</p>
              <p>Login</p>
            </div>
          </div>
        )}
    </>
  );
}
