import { BsArrowUpRight } from "react-icons/bs";
import React from "react";
const CategoryCard = ({icons,title}) => {
    return (
        <div className="bg-white p-4 shadow-lg rounded-md flex items-center gap-4 justify-between border border-transparent hover:border-[#20b486] hover:cursor-pointer  group/edit">
            <div className="flex gap-4">
           {icons}

            <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
          

           <div className="group-hover/edit:bg-[#20b486] rounded-lg p-3 group-hover/edit:text-white">
           <BsArrowUpRight 
            size={30}
           
            />
           </div>
        </div>
    );
};

export default CategoryCard;