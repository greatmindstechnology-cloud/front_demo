import { cta } from "../../assets";
import React from "react";

const Cta = () => {
    return (
        <div className="w-full bg-[#e9f8f3] py-24">
        <div className=" md:max-w-[1480px] m-auto grid md:grid-cols-2 px-4 items-center">
        <img src={cta} className="w-[500px] mx-auto"/>
          <div className="">
         
          <h1 className="py-2  text-3xl font-semibold">Join <span className="text-[#20B486]"> World's largest</span> learning platform today </h1>
          <p className="py-2 text-lg text-gray-600">Start learning by registering for free</p>
          <button className="bg-[#20b486] rounded-md px-8 py-5 text-white font-bold max-[780px]:w-full">
            Sign Up For Free
          </button>
          </div>
          
        </div>
      </div>
    );
};

export default Cta;