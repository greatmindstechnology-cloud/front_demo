import React from "react";
import { heroImg } from "../../assets";
import {AiOutlineSearch} from 'react-icons/ai';
const Hero = ({ searchTerm, setSearchTerm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, you can trigger a search here or just update the state
  };
  return (
    <div className="w-full bg-white py-20">
      <div className=" md:max-w-[1480px] m-auto grid md:grid-cols-2 px-4">
        <div className="flex flex-col justify-start gap-4">
          <p className="py-2 text-2xl text-[#204fb4] font-bold">
            START TO SUCCESS
          </p>
          <h1 className=" py-4 md:leading-[72px]  md:text-6xl text-5xl font-semibold">
            Share your  <span className="text-[#204fb4]">Dreams </span> with us and to let us help you in {" "}
            <span className="text-[#204fb4]"> Achieving</span> them!
          </h1>
          <form className=" max-w-[700px]  border p-4 shadow-lg rounded-md flex justify-between">
            <input
              className="bg-white outline-none"
              type="text"
              placeholder="what do want to leanr"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
                <AiOutlineSearch 
                size={20}
                className="icon"
                style={{color:'#000'}}
                />
            </button>
          </form>
        </div>
        <img src={heroImg} className="md:order-last order-first "/>
      </div>
    </div>
  );
};

export default Hero;
