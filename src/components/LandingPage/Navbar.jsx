import React from "react";
import { useState } from "react";
import { logo, lock, hamburgerMenu, close } from "../../assets";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const clickHandler = () => {
    setToggle(() => !toggle);
  };
  return (
    <div className="w-full h-[80px] bg-white border-b-2">
      <div className="md:max-w-[1480px] sm:max-w-[600px]  w-full h-full flex justify-between m-auto px-4  items-center">
        <img src={logo} className="h-[10rem] mb-" />
        <div className="hidden md:flex items-cente ">
          <ul className="flex gap-4">
            {/* <li>Home</li>
            <li>About</li>
            <li>Suport</li>
            <li>Platform</li>
            <li>Pricing</li> */}
          </ul>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="flex justify-between items-center bg-transparent px-6 gap-2">
            <img src={lock} /><a href="/Login">
            Login</a>
          </button>
          <button className="bg-[#204fb4] rounded-md px-8 py-3 text-white font-bold"><a href="/Signup">
            Sign Up as Student</a>
          </button>
          <button className="bg-[#204fb4] rounded-md px-8 py-3 text-white font-bold"><a href="/trainer-details">
            Apply for Trainer</a>
          </button>
          <button className="bg-[#204fb4] rounded-md px-8 py-3 text-white font-bold"><a href="/vendor-details">
            Apply for Vendor</a>
          </button>
        </div>

        <div className="md:hidden" onClick={clickHandler}>
          <img src={toggle ? close : hamburgerMenu} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
