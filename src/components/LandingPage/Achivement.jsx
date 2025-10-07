import { achievement } from "../../assets";
import { PiGraduationCapThin } from "react-icons/pi";
import { GoDeviceCameraVideo } from "react-icons/go";
import { TbUsers } from "react-icons/tb";
import React from "react";

const Achivement = () => {
  return (
    <div className="w-full bg-white py-24">
      <div className=" md:max-w-[1480px] m-auto grid md:grid-cols-2 px-4">
        <div className="flex flex-col justify-center ">
          <h1 className="md:leading-[72px] text-3xl font-bold">
            Our <span className="text-[#20B486]">Achievements</span>
          </h1>
          <p className="text-lg text-gray-600">
            Various versions have evolved over the years, sometimes by accident.
          </p>
          <div className="grid grid-cols-2 py-16">
                <div className=" py-6 flex">
                    <div className=" p-4 bg-green-100 rounded-lg">
                    <PiGraduationCapThin size={30} style={{color:'#1a906b'}}/>
                    </div>
                    <div className="px-3">
                    <h1 className="text-2xl font-semibold">300</h1>
                        <p className="text-[#6D737A]">Instructor</p>
                    </div>
                </div>

                <div className=" py-6 flex">
                    <div className=" p-4 bg-[#FFFAF5] rounded-lg">
                    <GoDeviceCameraVideo size={30} style={{color:'#ffc27a'}}/>
                    </div>
                    <div className="px-3">
                    <h1 className="text-2xl font-semibold">10,000</h1>
                        <p className="text-[#6D737A]">Video</p>
                    </div>
                </div>

                
                <div className=" py-6 flex">
                    <div className=" p-4 bg-[#FFEEF0] rounded-lg">
                    <PiGraduationCapThin size={30} style={{color:'rgb(237, 68, 89)'}}/>
                    </div>
                    <div className="px-3">
                    <h1 className="text-2xl font-semibold">20,000+</h1>
                        <p className="text-[#6D737A]">Student</p>
                    </div>
                </div>

                
                <div className=" py-6 flex">
                    <div className=" p-4 bg-[#F0F7FF] rounded-lg">
                    <TbUsers size={30} style={{color:'rgb(0, 117, 253)'}}/>
                    </div>
                    <div className="px-3">
                    <h1 className="text-2xl font-semibold">1,000,000</h1>
                        <p className="text-[#6D737A]">Users</p>
                    </div>
                </div>
                
          </div>
        </div>

        <img src={achievement} className="md:order-last order-first m-auto" />
      </div>
    </div>
  );
};

export default Achivement;
